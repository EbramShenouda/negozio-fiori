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


