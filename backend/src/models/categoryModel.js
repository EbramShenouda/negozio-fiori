const db = require('../config/db');   // Supabase client
const { v4: uuidv4 } = require('uuid');
const { slugify } = require('../utils/slugify');

// Colonne Supabase → campi API italiani
function mapCategory(row) {
  if (!row) return null;
  return {
    id:             row.id,
    nome:           row.name,
    descrizione:    row.description || '',
    slug:           row.slug,
    data_creazione: row.created_at,
    prodotti_count: row.prodotti_count ?? 0,
  };
}

const CategoryModel = {

  async findAll() {
    // Carica categorie e conteggio prodotti in due query leggere
    const [{ data: cats, error }, { data: prods }] = await Promise.all([
      db.from('categories').select('*').order('name', { ascending: true }),
      db.from('products').select('category_id'),
    ]);
    if (error) throw error;

    // Conta per categoria lato JS (catalogo piccolo, nessun overhead)
    const countMap = {};
    (prods || []).forEach((p) => {
      if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    });

    return (cats || []).map((row) => ({
      ...mapCategory(row),
      prodotti_count: countMap[row.id] || 0,
    }));
  },

  async findById(id) {
    const { data, error } = await db.from('categories').select('*').eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapCategory(data);
  },

  async findBySlug(slug) {
    const { data, error } = await db.from('categories').select('*').eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapCategory(data);
  },

  async findByNome(nome) {
    const { data, error } = await db
      .from('categories')
      .select('*')
      .ilike('name', nome)
      .maybeSingle();
    if (error) throw error;
    return mapCategory(data);
  },

  async create(data) {
    const id   = uuidv4();
    const slug = slugify(data.nome);

    const { data: row, error } = await db
      .from('categories')
      .insert({ id, name: data.nome, description: data.descrizione || '', slug })
      .select()
      .single();

    if (error) throw error;
    return mapCategory(row);
  },

  async update(id, data) {
    const updates = {};
    if (data.nome        !== undefined) { updates.name = data.nome; updates.slug = slugify(data.nome); }
    if (data.descrizione !== undefined)   updates.description = data.descrizione;

    if (!Object.keys(updates).length) return this.findById(id);

    const { data: row, error } = await db
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return mapCategory(row);
  },

  async delete(id) {
    const { error } = await db.from('categories').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async count() {
    const { count, error } = await db
      .from('categories')
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  },
};

module.exports = CategoryModel;


const CategoryModel = {
  findAll() {
    return db.prepare(`
      SELECT c.*, COUNT(p.id) AS prodotti_count
      FROM   categories c
      LEFT JOIN products p ON p.categoria_id = c.id
      GROUP BY c.id
      ORDER BY c.nome ASC
    `).all();
  },

  findById(id) {
    return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
  },

  findBySlug(slug) {
    return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
  },

  findByNome(nome) {
    return db.prepare('SELECT * FROM categories WHERE LOWER(nome) = LOWER(?)').get(nome);
  },

  create(data) {
    const id = uuidv4();
    const slug = slugify(data.nome);
    const dataCreazione = new Date().toISOString();

    db.prepare(`
      INSERT INTO categories (id, nome, descrizione, slug, data_creazione)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, data.nome, data.descrizione || '', slug, dataCreazione);

    return this.findById(id);
  },

  update(id, data) {
    if (!this.findById(id)) return null;

    const sets = [];
    const params = [];

    if (data.nome !== undefined) {
      sets.push('nome = ?', 'slug = ?');
      params.push(data.nome, slugify(data.nome));
    }
    if (data.descrizione !== undefined) {
      sets.push('descrizione = ?');
      params.push(data.descrizione);
    }

    if (sets.length === 0) return this.findById(id);

    params.push(id);
    db.prepare(`UPDATE categories SET ${sets.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  },

  delete(id) {
    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    return result.changes > 0;
  },

  count() {
    return db.prepare('SELECT COUNT(*) AS n FROM categories').get().n;
  },
};

module.exports = CategoryModel;
