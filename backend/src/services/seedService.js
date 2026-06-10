/**
 * Seed Service – inizializza DB se vuoto
 */

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('../config/db');
const env = require('../config/env');
const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');

// ─────────────────────────────
// DEMO DATA
// ─────────────────────────────

const DEMO_CATEGORIES = [
  { nome: 'Bouquet', descrizione: 'Composizioni di fiori freschi legati a mano' },
  { nome: 'Composizioni', descrizione: 'Arrangiamenti floreali per ogni occasione' },
  { nome: 'Piante', descrizione: 'Piante da interno e da esterno' },
  { nome: 'Matrimoni & Sposa', descrizione: 'Bouquet nuziali e decorazioni cerimonie' },
  { nome: 'Occasioni Speciali', descrizione: 'Fiori per compleanni, anniversari e regali' },
];

const DEMO_PRODUCTS = [
  {
    nome: 'Bouquet di Rose Rosse',
    descrizione: 'Classico bouquet romantico',
    prezzo: 45,
    categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=600&q=80',
  },
];

// ─────────────────────────────
// SEED FUNCTIONS
// ─────────────────────────────

async function seedAdmin() {
  const existing = db.from ? await db.from('admins').select('id').limit(1) : db.prepare('SELECT id FROM admins LIMIT 1').get();
  if (existing?.data?.length || existing?.id) return;

  const hash = await bcrypt.hash(env.adminPassword, 12);

  await db.from
    ? db.from('admins').insert({
        id: uuidv4(),
        username: env.adminUsername,
        password_hash: hash,
      })
    : db.prepare(`
        INSERT INTO admins (id, username, password_hash, data_creazione)
        VALUES (?, ?, ?, ?)
      `).run(uuidv4(), env.adminUsername, hash, new Date().toISOString());

  console.log('✅ Admin creato');
}

async function seedCategories() {
  const count = await CategoryModel.count();
  if (count > 0) return {};

  const map = {};

  for (const c of DEMO_CATEGORIES) {
    const created = await CategoryModel.create(c);
    map[c.nome] = created.id;
  }

  return map;
}

async function seedProducts(map) {
  const count = await ProductModel.count();
  if (count > 0) return;

  for (const p of DEMO_PRODUCTS) {
    await ProductModel.create({
      ...p,
      categoria_id: map[p.categoria] || null,
      disponibile: true,
    });
  }
}

async function runSeed() {
  await seedAdmin();
  const map = await seedCategories();
  await seedProducts(map);
}

module.exports = { runSeed };