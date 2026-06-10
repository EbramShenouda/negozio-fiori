const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const supabase = require('../config/db');
const env = require('../config/env');
const CategoryModel = require('../models/categoryModel');
const ProductModel = require('../models/productModel');

const DEMO_CATEGORIES = [
  { nome: 'Bouquet', descrizione: 'Composizioni di fiori freschi' },
  { nome: 'Composizioni', descrizione: 'Arrangiamenti floreali' },
  { nome: 'Piante', descrizione: 'Piante da interno e esterno' },
];

const DEMO_PRODUCTS = [
  {
    nome: 'Bouquet di Rose Rosse',
    descrizione: 'Classico romantico',
    prezzo: 45,
    categoria: 'Bouquet',
    immagine: 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=600',
  },
];

async function seedAdmin() {
  const { data } = await supabase
    .from('admins')
    .select('id')
    .limit(1);

  if (data?.length) return;

  const hash = await bcrypt.hash(env.adminPassword, 12);

  const { error } = await supabase.from('admins').insert({
    id: uuidv4(),
    username: env.adminUsername,
    password_hash: hash,
  });

  if (error) throw error;

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

  console.log('✅ Categorie create');
  return map;
}

async function seedProducts(map) {
  const count = await ProductModel.count();
  if (count > 0) return;

  for (const p of DEMO_PRODUCTS) {
    await ProductModel.create({
      ...p,
      categoria_id: map[p.categoria] || null,
    });
  }

  console.log('✅ Prodotti creati');
}

async function runSeed() {
  await seedAdmin();
  const map = await seedCategories();
  await seedProducts(map);
}

module.exports = { runSeed };