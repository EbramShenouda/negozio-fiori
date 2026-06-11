const ProductService = require('../services/productService');
const { uploadToSupabase } = require('../config/storage');
const { sanitizeObject } = require('../utils/sanitize');

// ──────────────────────────────────────────────────────────
// Helper: normalizza il campo disponibile e garantisce
// che immagine_url sia sempre presente (già full URL su Supabase)
// ──────────────────────────────────────────────────────────
function enrich(product) {
  if (!product) return null;
  return {
    ...product,
    disponibile: product.disponibile === true || product.disponibile === 1,
  };
}

// ──────────────────────────────────────────────────────────
// Endpoint pubblici
// ──────────────────────────────────────────────────────────

async function getProducts(req, res, next) {
  try {
    const { categoria_id } = req.query;
    const products = await ProductService.getPublicProducts({ categoria_id });
    return res.json({ success: true, data: products.map(enrich) });
  } catch (err) { next(err); }
}

async function getFeatured(req, res, next) {
  try {
    const products = await ProductService.getFeatured();
    return res.json({ success: true, data: products.map(enrich) });
  } catch (err) { next(err); }
}

async function getProductBySlug(req, res, next) {
  try {
    const product = await ProductService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, data: enrich(product) });
  } catch (err) { next(err); }
}

// ──────────────────────────────────────────────────────────
// Endpoint admin
// ──────────────────────────────────────────────────────────

async function adminGetProducts(req, res, next) {
  try {
    const { categoria_id, disponibile } = req.query;
    const opts = { categoria_id };
    if (disponibile !== undefined) opts.disponibile = disponibile === 'true';
    const products = await ProductService.getAllAdmin(opts);
    return res.json({ success: true, data: products.map(enrich) });
  } catch (err) { next(err); }
}

async function createProduct(req, res, next) {
  try {
    const safe    = sanitizeObject(req.body);
    const product = await ProductService.create({
      nome:         safe.nome,
      descrizione:  safe.descrizione,
      prezzo:       parseFloat(safe.prezzo),
      categoria_id: safe.categoria_id || null,
      disponibile:  safe.disponibile !== 'false' && safe.disponibile !== false,
    });
    return res.status(201).json({ success: true, data: enrich(product) });
  } catch (err) { next(err); }
}

async function updateProduct(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    const data = {};
    if (safe.nome        !== undefined) data.nome        = safe.nome;
    if (safe.descrizione !== undefined) data.descrizione = safe.descrizione;
    if (safe.prezzo      !== undefined) data.prezzo      = parseFloat(safe.prezzo);
    if (safe.categoria_id !== undefined) data.categoria_id = safe.categoria_id || null;
    if (safe.disponibile !== undefined) data.disponibile  = safe.disponibile !== 'false' && safe.disponibile !== false;

    const product = await ProductService.update(req.params.id, data);
    if (!product) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, data: enrich(product) });
  } catch (err) { next(err); }
}

async function deleteProduct(req, res, next) {
  try {
    await ProductService.delete(req.params.id);
    return res.json({ success: true, message: 'Prodotto eliminato.' });
  } catch (err) { next(err); }
}

/**
 * Carica l'immagine in memoria (multer) → la carica su Supabase Storage →
 * salva l'URL pubblico nel record del prodotto.
 */
async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nessun file caricato.' });
    }
    const imageUrl = await uploadToSupabase(req.file);
    const product  = await ProductService.updateImage(req.params.id, imageUrl);
    if (!product) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, data: enrich(product) });
  } catch (err) { next(err); }
}

async function getDashboard(req, res, next) {
  try {
    const stats = await ProductService.getDashboardStats();
    stats.recenti = (stats.recenti || []).map(enrich);
    return res.json({ success: true, data: stats });
  } catch (err) { next(err); }
}

module.exports = {
  getProducts,
  getFeatured,
  getProductBySlug,
  adminGetProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getDashboard,
};

