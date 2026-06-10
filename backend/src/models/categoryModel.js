const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { slugify } = require('../utils/slugify');

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
