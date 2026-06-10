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


// ──────────────────────────────────────────────────────────
// Endpoint pubblici
// ──────────────────────────────────────────────────────────

/**
 * GET /api/products
 * Ritorna tutti i prodotti disponibili. Filtro opzionale: ?categoria_id=...
 */
function getProducts(req, res, next) {
  try {
    const { categoria_id } = req.query;
    const products = ProductService.getPublicProducts({ categoria_id });
    const enriched = products.map((p) => enrichProduct(req, p));
    return res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/featured
 * Ritorna i 4 prodotti più recenti per la homepage.
 */
function getFeatured(req, res, next) {
  try {
    const products = ProductService.getFeatured();
    const enriched = products.map((p) => enrichProduct(req, p));
    return res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:slug
 * Dettaglio singolo prodotto per slug.
 */
function getProductBySlug(req, res, next) {
  try {
    const product = ProductService.getBySlug(req.params.slug);
    if (!product) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, data: enrichProduct(req, product) });
  } catch (err) {
    next(err);
  }
}

// ──────────────────────────────────────────────────────────
// Endpoint admin (protetti da middleware auth)
// ──────────────────────────────────────────────────────────

/**
 * GET /api/admin/products
 * Tutti i prodotti (inclusi non disponibili) per la dashboard.
 */
function adminGetProducts(req, res, next) {
  try {
    const { categoria_id, disponibile } = req.query;
    const opts = { categoria_id };
    if (disponibile !== undefined) opts.disponibile = disponibile === 'true';
    const products = ProductService.getAllAdmin(opts);
    const enriched = products.map((p) => enrichProduct(req, p));
    return res.json({ success: true, data: enriched });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/products
 * Crea un nuovo prodotto.
 */
function createProduct(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    const product = ProductService.create({
      nome:         safe.nome,
      descrizione:  safe.descrizione,
      prezzo:       parseFloat(safe.prezzo),
      categoria_id: safe.categoria_id || null,
      disponibile:  safe.disponibile !== 'false' && safe.disponibile !== false,
    });
    return res.status(201).json({ success: true, data: enrichProduct(req, product) });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/products/:id
 * Aggiorna un prodotto esistente.
 */
function updateProduct(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    const data = {};
    if (safe.nome        !== undefined) data.nome        = safe.nome;
    if (safe.descrizione !== undefined) data.descrizione = safe.descrizione;
    if (safe.prezzo      !== undefined) data.prezzo      = parseFloat(safe.prezzo);
    if (safe.categoria_id !== undefined) data.categoria_id = safe.categoria_id || null;
    if (safe.disponibile !== undefined) data.disponibile  = safe.disponibile !== 'false' && safe.disponibile !== false;

    const product = ProductService.update(req.params.id, data);
    if (!product) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, data: enrichProduct(req, product) });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/products/:id
 * Elimina un prodotto.
 */
function deleteProduct(req, res, next) {
  try {
    const deleted = ProductService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, message: 'Prodotto eliminato.' });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/products/:id/image
 * Carica un'immagine per il prodotto.
 */
function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nessun file caricato.' });
    }
    const product = ProductService.updateImage(req.params.id, req.file.path);
    if (!product) return res.status(404).json({ success: false, message: 'Prodotto non trovato.' });
    return res.json({ success: true, data: enrichProduct(req, product) });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/dashboard
 * Statistiche per la dashboard.
 */
function getDashboard(req, res, next) {
  try {
    const stats = ProductService.getDashboardStats();
    stats.recenti = stats.recenti.map((p) => enrichProduct(req, p));
    return res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// ──────────────────────────────────────────────────────────
// Helper: arricchisce il prodotto con l'URL immagine assoluto
// ──────────────────────────────────────────────────────────

function enrichProduct(req, product) {
  return {
    ...product,
    immagine_url: getImageUrl(req, product.immagine),
    disponibile: product.disponibile === 1 || product.disponibile === true,
  };
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
