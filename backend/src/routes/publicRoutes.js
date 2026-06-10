const { Router } = require('express');
const env = require('../config/env');
const {
  getProducts,
  getFeatured,
  getProductBySlug,
} = require('../controllers/productsController');
const { getCategories } = require('../controllers/categoriesController');

const router = Router();

// Prodotti pubblici
router.get('/products',          getProducts);
router.get('/products/featured', getFeatured);
router.get('/products/:slug',    getProductBySlug);

// Categorie pubbliche
router.get('/categories', getCategories);

// Configurazione WhatsApp (numero esposto al frontend senza segreti)
router.get('/config', (_req, res) => {
  res.json({
    success: true,
    data: {
      whatsappNumber: env.whatsappNumber,
      negozioNome:    'Fiori di Sandro',
    },
  });
});

module.exports = router;
