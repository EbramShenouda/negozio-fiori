const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { uniqueSlug } = require('../utils/slugify');

const ProductModel = {
  /**
   * Restituisce l'elenco prodotti con join sulla categoria.
   * Opzioni: disponibile (bool), categoria_id, limit, offset, orderBy, order
   */
  findAll(options = {}) {
    const {
      disponibile,
      categoria_id,
      limit,
      offset = 0,
      orderBy = 'data_creazione',
      order = 'DESC',
    } = options;

    const ALLOWED_ORDER = ['data_creazione', 'prezzo', 'nome'];
    const safeOrderBy = ALLOWED_ORDER.includes(orderBy) ? orderBy : 'data_creazione';
    const safeOrder = order === 'ASC' ? 'ASC' : 'DESC';

    let query = `
      SELECT p.id, p.nome, p.descrizione, p.prezzo, p.immagine,
             p.disponibile, p.slug, p.data_creazione,
             p.categoria_id,
             c.nome  AS categoria_nome,
             c.slug  AS categoria_slug
      FROM   products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE  1=1
    `;
    const params = [];

    if (disponibile !== undefined) {
      query += ' AND p.disponibile = ?';
      params.push(disponibile ? 1 : 0);
    }
    if (categoria_id) {
      query += ' AND p.categoria_id = ?';
      params.push(categoria_id);
    }

    query += ` ORDER BY p.${safeOrderBy} ${safeOrder}`;

    if (limit) {
      query += ' LIMIT ? OFFSET ?';
      params.push(limit, offset);
    }

    return db.prepare(query).all(...params);
  },

  findById(id) {
    return db.prepare(`
      SELECT p.*, c.nome AS categoria_nome, c.slug AS categoria_slug
      FROM   products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE  p.id = ?
    `).get(id);
  },

  findBySlug(slug) {
    return db.prepare(`
      SELECT p.*, c.nome AS categoria_nome, c.slug AS categoria_slug
      FROM   products p
      LEFT JOIN categories c ON p.categoria_id = c.id
      WHERE  p.slug = ?
    `).get(slug);
  },

  create(data) {
    const id = uuidv4();
    const slug = uniqueSlug(data.nome, id);
    const dataCreazione = new Date().toISOString();

    db.prepare(`
      INSERT INTO products
        (id, nome, descrizione, prezzo, categoria_id, immagine, disponibile, slug, data_creazione)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.nome,
      data.descrizione || '',
      Number(data.prezzo),
      data.categoria_id || null,
      data.immagine || null,
      data.disponibile !== undefined ? (data.disponibile ? 1 : 0) : 1,
      slug,
      dataCreazione,
    );

    return this.findById(id);
  },

  update(id, data) {
    if (!this.findById(id)) return null;

    const sets = [];
    const params = [];

    if (data.nome        !== undefined) { sets.push('nome = ?');         params.push(data.nome); }
    if (data.descrizione !== undefined) { sets.push('descrizione = ?');  params.push(data.descrizione); }
    if (data.prezzo      !== undefined) { sets.push('prezzo = ?');       params.push(Number(data.prezzo)); }
    if (data.categoria_id !== undefined) { sets.push('categoria_id = ?'); params.push(data.categoria_id || null); }
    if (data.immagine    !== undefined) { sets.push('immagine = ?');     params.push(data.immagine); }
    if (data.disponibile !== undefined) { sets.push('disponibile = ?');  params.push(data.disponibile ? 1 : 0); }

    if (sets.length === 0) return this.findById(id);

    params.push(id);
    db.prepare(`UPDATE products SET ${sets.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  },

  delete(id) {
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return result.changes > 0;
  },

  updateImage(id, imagePath) {
    db.prepare('UPDATE products SET immagine = ? WHERE id = ?').run(imagePath, id);
    return this.findById(id);
  },

  count(options = {}) {
    const { disponibile, categoria_id } = options;
    let query = 'SELECT COUNT(*) AS n FROM products WHERE 1=1';
    const params = [];
    if (disponibile !== undefined) { query += ' AND disponibile = ?'; params.push(disponibile ? 1 : 0); }
    if (categoria_id)               { query += ' AND categoria_id = ?'; params.push(categoria_id); }
    return db.prepare(query).get(...params).n;
  },
};

module.exports = ProductModel;
