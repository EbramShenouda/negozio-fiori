-- ============================================================
-- Fiori di Sandro – Schema Supabase PostgreSQL
-- Esegui questo script nel Supabase SQL Editor:
--   Dashboard → SQL Editor → New query → incolla → Run
-- ============================================================

-- Estensione per generazione UUID (abilitata di default su Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tabella categorie ────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  slug        TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT categories_name_unique UNIQUE (name)
);

-- ── Tabella prodotti ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  price        NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category_id  UUID REFERENCES categories (id) ON DELETE SET NULL,
  image_url    TEXT DEFAULT NULL,
  available    BOOLEAN NOT NULL DEFAULT TRUE,
  slug         TEXT NOT NULL UNIQUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Tabella admin (autenticazione JWT custom) ────────────
CREATE TABLE IF NOT EXISTS admins (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username      TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admins_username_unique UNIQUE (username)
);

-- ── Indici per performance ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_available    ON products (available);
CREATE INDEX IF NOT EXISTS idx_products_category_id  ON products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug         ON products (slug);
CREATE INDEX IF NOT EXISTS idx_products_created_at   ON products (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug       ON categories (slug);

-- ── Row Level Security ───────────────────────────────────
-- Il backend usa la service role key che bypassa RLS.
-- Le policy pubbliche sotto proteggono da accessi diretti non autorizzati
-- (es. se qualcuno usa la anon key).

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins     ENABLE ROW LEVEL SECURITY;

-- Categorie: lettura pubblica, scrittura solo service role
CREATE POLICY "public_read_categories"
  ON categories FOR SELECT TO anon, authenticated
  USING (TRUE);

-- Prodotti: lettura pubblica solo se disponibili, scrittura solo service role
CREATE POLICY "public_read_available_products"
  ON products FOR SELECT TO anon, authenticated
  USING (available = TRUE);

-- Admins: nessun accesso pubblico (solo service role)
-- (nessuna policy = blocco totale per anon/authenticated)

-- ============================================================
-- STORAGE BUCKET
-- Crea il bucket "products" dal dashboard Supabase oppure esegui:
--   Dashboard → Storage → New bucket
--   Nome: products
--   Public: ✅ (per URL pubblici delle immagini)
--
-- Oppure via API (una tantum):
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('products', 'products', true)
-- ON CONFLICT (id) DO NOTHING;
-- ============================================================

-- Storage policy: upload solo per service role (già garantito),
-- lettura pubblica delle immagini
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public_read_product_images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'products');
