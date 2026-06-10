/**
 * Seed Service – Popola Supabase con:
 *  1. Utente admin iniziale
 *  2. Categorie demo
 *  3. Prodotti demo (bouquet e composizioni)
 *
 * Eseguito all'avvio solo se DB è vuoto.
 */

const bcrypt = require('bcryptjs');
const db     = require('../config/db');   // Supabase client
const env    = require('../config/env');
const CategoryModel = require('../models/categoryModel');
const ProductModel  = require('../models/productModel');

// ──────────────────────────────────────────────────────────
// Dati demo
// ──────────────────────────────────────────────────────────

const DEMO_CATEGORIES = [
  { nome: 'Bouquet',            descrizione: 'Composizioni di fiori freschi legati a mano' },
  { nome: 'Composizioni',       descrizione: 'Arrangiamenti floreali per ogni occasione' },
  { nome: 'Piante',             descrizione: 'Piante da interno e da esterno' },
  { nome: 'Matrimoni & Sposa',  descrizione: 'Bouquet nuziali e decorazioni cerimonie' },
  { nome: 'Occasioni Speciali', descrizione: 'Fiori per compleanni, anniversari e regali' },
];

const DEMO_PRODUCTS = [
  {
    nome: 'Bouquet di Rose Rosse',
    descrizione: 'Un classico senza tempo. Dodici rose rosse di prima scelta, simbolo di amore e passione, confezionate con carta kraft naturale e nastro di raso.',
    prezzo: 45.0, categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=600&q=80',
  },
  {
    nome: 'Composizione Primaverile Mista',
    descrizione: 'Un trionfo di colori primaverili: tulipani, ranuncoli, fresie e verdi fogliame in un cestino di vimini.',
    prezzo: 35.0, categoria: 'Composizioni',
    immagine: 'https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=600&q=80',
  },
  {
    nome: 'Bouquet di Tulipani Colorati',
    descrizione: 'Venti tulipani freschi nei colori del sole: giallo, arancio, rosa e rosso. Avvolti in cellophane trasparente.',
    prezzo: 28.0, categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  },
  {
    nome: 'Orchidea Elegante in Vaso',
    descrizione: 'Phalaenopsis in piena fioritura, in vaso di ceramica bianca con muschio decorativo. Pianta di lunga durata.',
    prezzo: 55.0, categoria: 'Piante',
    immagine: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80',
  },
  {
    nome: 'Bouquet Sposa Romantico',
    descrizione: 'Bouquet da sposa in stile garden: peonie bianche, rose spray, eucalipto e garofani selvatici.',
    prezzo: 90.0, categoria: 'Matrimoni & Sposa',
    immagine: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
  },
  {
    nome: 'Girasoli e Margherite',
    descrizione: 'Un bouquet luminoso e gioioso: girasoli freschi abbinati a margherite bianche e foglie di limone.',
    prezzo: 25.0, categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1461344153046-ef4923d0b094?w=600&q=80',
  },
  {
    nome: 'Composizione Anniversario',
    descrizione: 'Box floreale di lusso: rose inglesi in toni rosa antico, fresie profumate e ranuncoli in scatola regalo nera.',
    prezzo: 65.0, categoria: 'Occasioni Speciali',
    immagine: 'https://images.unsplash.com/photo-1470509037663-253d2d33012f?w=600&q=80',
  },
  {
    nome: 'Pianta Succulenta Decorativa',
    descrizione: 'Composizione di succulente in vaso di terracotta artistica. Richiede poca manutenzione.',
    prezzo: 18.0, categoria: 'Piante',
    immagine: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80',
  },
  {
    nome: 'Bouquet di Peonie Rosa',
    descrizione: 'Dieci peonie in piena fioritura, profumatissime, nei toni del rosa cipria e del corallo. Stagionali.',
    prezzo: 50.0, categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=600&q=80',
  },
  {
    nome: 'Centrotavola Matrimonio',
    descrizione: 'Centrotavola boho-chic: rose bianche, gypsophila, eucalipto e candele LED. Per banchetti eleganti.',
    prezzo: 75.0, categoria: 'Matrimoni & Sposa',
    immagine: 'https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=600&q=80',
  },
];

// ──────────────────────────────────────────────────────────
// Seed functions
// ──────────────────────────────────────────────────────────

async function seedAdmin() {
  const { data } = await db.from('admins').select('id').limit(1);
  if (data && data.length > 0) return;

  const { v4: uuidv4 } = require('uuid');
  const hash = await bcrypt.hash(env.adminPassword, 12);
  await db.from('admins').insert({
    id:            uuidv4(),
    username:      env.adminUsername,
    password_hash: hash,
  });
  console.log(`✅ Admin creato: ${env.adminUsername}`);
}

async function seedCategories() {
  const n = await CategoryModel.count();
  if (n > 0) return {};

  const map = {};
  for (const cat of DEMO_CATEGORIES) {
    const created  = await CategoryModel.create(cat);
    map[cat.nome]  = created.id;
  }
  console.log(`✅ Categorie create: ${DEMO_CATEGORIES.length}`);
  return map;
}

async function seedProducts(categoryMap) {
  const n = await ProductModel.count();
  if (n > 0) return;

  for (const p of DEMO_PRODUCTS) {
    await ProductModel.create({
      nome:         p.nome,
      descrizione:  p.descrizione,
      prezzo:       p.prezzo,
      categoria_id: categoryMap[p.categoria] || null,
      immagine:     p.immagine,
      disponibile:  true,
    });
  }
  console.log(`✅ Prodotti demo creati: ${DEMO_PRODUCTS.length}`);
}

async function runSeed() {
  await seedAdmin();
  const categoryMap = await seedCategories();
  await seedProducts(categoryMap);
}

module.exports = { runSeed };

 *  1. L'utente admin iniziale
 *  2. Le categorie demo
 *  3. I prodotti demo (bouquet e composizioni)
 *
 * Viene eseguito all'avvio del server se il DB è vuoto.
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');
const env = require('../config/env');

// ──────────────────────────────────────────────────────────
// Dati demo
// ──────────────────────────────────────────────────────────

const DEMO_CATEGORIES = [
  { nome: 'Bouquet',            descrizione: 'Composizioni di fiori freschi legati a mano' },
  { nome: 'Composizioni',       descrizione: 'Arrangiamenti floreali per ogni occasione' },
  { nome: 'Piante',             descrizione: 'Piante da interno e da esterno' },
  { nome: 'Matrimoni & Sposa',  descrizione: 'Bouquet nuziali e decorazioni cerimonie' },
  { nome: 'Occasioni Speciali', descrizione: 'Fiori per compleanni, anniversari e regali' },
];

const DEMO_PRODUCTS = [
  {
    nome: 'Bouquet di Rose Rosse',
    descrizione:
      'Un classico senza tempo. Dodici rose rosse di prima scelta, simbolo di amore e passione, confezionate con carta kraft naturale e nastro di raso. Perfette per ogni dichiarazione romantica.',
    prezzo: 45.0,
    categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=600&q=80',
  },
  {
    nome: 'Composizione Primaverile Mista',
    descrizione:
      'Un trionfo di colori primaverili: tulipani, ranuncoli, fresie e verdi fogliame in un cestino di vimini. Ideale come regalo o decorazione per la tavola.',
    prezzo: 35.0,
    categoria: 'Composizioni',
    immagine: 'https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=600&q=80',
  },
  {
    nome: 'Bouquet di Tulipani Colorati',
    descrizione:
      'Venti tulipani freschi nei colori del sole: giallo, arancio, rosa e rosso. Avvolti in cellophane trasparente con fiocco decorativo. Annunciano la primavera in ogni ambiente.',
    prezzo: 28.0,
    categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80',
  },
  {
    nome: 'Orchidea Elegante in Vaso',
    descrizione:
      'Phalaenopsis in piena fioritura, in vaso di ceramica bianca con muschio decorativo. Una pianta di lunga durata, perfetta come regalo di classe o per abbellire interni moderni.',
    prezzo: 55.0,
    categoria: 'Piante',
    immagine: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=600&q=80',
  },
  {
    nome: 'Bouquet Sposa Romantico',
    descrizione:
      'Bouquet da sposa in stile garden: peonie bianche, rose spray, eucalipto e garofani selvatici. Realizzato su misura secondo i desideri della sposa. Prezzo indicativo base.',
    prezzo: 90.0,
    categoria: 'Matrimoni & Sposa',
    immagine: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
  },
  {
    nome: 'Girasoli e Margherite',
    descrizione:
      'Un bouquet luminoso e gioioso: girasoli freschi abbinati a margherite bianche e foglie di limone. Porta il profumo della campagna direttamente a casa tua.',
    prezzo: 25.0,
    categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1461344153046-ef4923d0b094?w=600&q=80',
  },
  {
    nome: 'Composizione Anniversario',
    descrizione:
      'Una box floreale di lusso: rose inglesi in toni rosa antico, fresie profumate e ranuncoli, disposti a mano in una scatola regalo nera con coperchio trasparente.',
    prezzo: 65.0,
    categoria: 'Occasioni Speciali',
    immagine: 'https://images.unsplash.com/photo-1470509037663-253d2d33012f?w=600&q=80',
  },
  {
    nome: 'Pianta Succulenta Decorativa',
    descrizione:
      'Composizione di succulente in vaso di terracotta artistica. Richiede poca manutenzione ed è perfetta per chi non ha il pollice verde. Un regalo originale e duraturo.',
    prezzo: 18.0,
    categoria: 'Piante',
    immagine: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80',
  },
  {
    nome: 'Bouquet di Peonie Rosa',
    descrizione:
      'Dieci peonie in piena fioritura, profumatissime, nei toni del rosa cipria e del corallo. Stagionali e irresistibili. Disponibili da aprile a giugno.',
    prezzo: 50.0,
    categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=600&q=80',
  },
  {
    nome: 'Centrotavola Matrimonio',
    descrizione:
      'Centrotavola in stile boho-chic: composizione bassa con rose bianche, gypsophila, eucalipto e candele LED. Ideale per banchetti nuziali ed eventi eleganti.',
    prezzo: 75.0,
    categoria: 'Matrimoni & Sposa',
    immagine: 'https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=600&q=80',
  },
];

// ──────────────────────────────────────────────────────────
// Funzioni di seed
// ──────────────────────────────────────────────────────────

async function seedAdmin() {
  const existing = db.prepare('SELECT id FROM admins LIMIT 1').get();
  if (existing) return;

  const { v4: uuidv4 } = require('uuid');
  const hash = await bcrypt.hash(env.adminPassword, 12);

  db.prepare(`
    INSERT INTO admins (id, username, password_hash, data_creazione)
    VALUES (?, ?, ?, ?)
  `).run(uuidv4(), env.adminUsername, hash, new Date().toISOString());

  console.log(`✅ Admin creato: ${env.adminUsername}`);
}

function seedCategories() {
  const existing = CategoryModel.count();
  if (existing > 0) return {};

  const map = {};
  for (const cat of DEMO_CATEGORIES) {
    const created = CategoryModel.create(cat);
    map[cat.nome] = created.id;
  }
  console.log(`✅ Categorie create: ${DEMO_CATEGORIES.length}`);
  return map;
}

function seedProducts(categoryMap) {
  const existing = ProductModel.count();
  if (existing > 0) return;

  for (const p of DEMO_PRODUCTS) {
    ProductModel.create({
      nome:         p.nome,
      descrizione:  p.descrizione,
      prezzo:       p.prezzo,
      categoria_id: categoryMap[p.categoria] || null,
      immagine:     p.immagine,
      disponibile:  true,
    });
  }
  console.log(`✅ Prodotti demo creati: ${DEMO_PRODUCTS.length}`);
}

/**
 * Esegue il seed completo se il database è vuoto.
 */
async function runSeed() {
  await seedAdmin();
  const categoryMap = seedCategories();
  seedProducts(categoryMap);
}

module.exports = { runSeed };
