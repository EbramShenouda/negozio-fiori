const db = require('../config/db');   // Supabase client
const { v4: uuidv4 } = require('uuid');
const { uniqueSlug } = require('../utils/slugify');

// Colonne Supabase → campi API italiani (mantenuta retrocompatibilità con frontend)
function mapProduct(row) {
  if (!row) return null;
  return {
    id:             row.id,
    nome:           row.name,
    descrizione:    row.description,
    prezzo:         row.price,
    categoria_id:   row.category_id,
    immagine:       row.image_url,
    immagine_url:   row.image_url,     // già URL completo su Supabase Storage
    disponibile:    row.available,
    slug:           row.slug,
    data_creazione: row.created_at,
    categoria_nome: row.categories?.name  ?? null,
    categoria_slug: row.categories?.slug  ?? null,
  };
}

// PostgREST select con join categoria
const SEL = '*, categories(id, name, slug)';

// Mappa nomi campo italiani → nomi colonne Supabase per ORDER BY
const ORDER_COL = {
  data_creazione: 'created_at',
  prezzo:         'price',
  nome:           'name',
};

const ProductModel = {

  async findAll(options = {}) {
    const {
      disponibile,
      categoria_id,
      limit,
      offset = 0,
      orderBy = 'data_creazione',
      order  = 'DESC',
    } = options;

    const col  = ORDER_COL[orderBy] || 'created_at';
    const asc  = order === 'ASC';

    let q = db.from('products').select(SEL).order(col, { ascending: asc });

    if (disponibile !== undefined) q = q.eq('available',    disponibile);
    if (categoria_id)              q = q.eq('category_id',  categoria_id);
    if (limit)                     q = q.range(offset, offset + limit - 1);

    const { data, error } = await q;
    if (error) throw error;
    return (data || []).map(mapProduct);
  },

  async findById(id) {
    const { data, error } = await db.from('products').select(SEL).eq('id', id).single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapProduct(data);
  },

  async findBySlug(slug) {
    const { data, error } = await db.from('products').select(SEL).eq('slug', slug).single();
    if (error && error.code !== 'PGRST116') throw error;
    return mapProduct(data);
  },

  async create(data) {
    const id   = uuidv4();
    const slug = uniqueSlug(data.nome, id);

    const { data: row, error } = await db
      .from('products')
      .insert({
        id,
        name:        data.nome,
        description: data.descrizione  || '',
        price:       Number(data.prezzo),
        category_id: data.categoria_id || null,
        image_url:   data.immagine     || null,
        available:   data.disponibile  !== false,
        slug,
      })
      .select(SEL)
      .single();

    if (error) throw error;
    return mapProduct(row);
  },

  async update(id, data) {
    const updates = {};
    if (data.nome        !== undefined) updates.name        = data.nome;
    if (data.descrizione !== undefined) updates.description = data.descrizione;
    if (data.prezzo      !== undefined) updates.price       = Number(data.prezzo);
    if (data.categoria_id !== undefined) updates.category_id = data.categoria_id || null;
    if (data.immagine    !== undefined) updates.image_url   = data.immagine;
    if (data.disponibile !== undefined) updates.available   = Boolean(data.disponibile);

    if (!Object.keys(updates).length) return this.findById(id);

    const { data: row, error } = await db
      .from('products')
      .update(updates)
      .eq('id', id)
      .select(SEL)
      .single();

    if (error) throw error;
    return mapProduct(row);
  },

  async delete(id) {
    const { error } = await db.from('products').delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  async updateImage(id, imageUrl) {
    const { data: row, error } = await db
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', id)
      .select(SEL)
      .single();

    if (error) throw error;
    return mapProduct(row);
  },

  async count(options = {}) {
    let q = db.from('products').select('*', { count: 'exact', head: true });
    if (options.disponibile !== undefined) q = q.eq('available',   options.disponibile);
    if (options.categoria_id)              q = q.eq('category_id', options.categoria_id);
    const { count, error } = await q;
    if (error) throw error;
    return count || 0;
  },
};

module.exports = ProductModel;


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
