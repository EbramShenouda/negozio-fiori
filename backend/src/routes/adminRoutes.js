const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const { validateLogin, validateProduct, validateCategory } = require('../middleware/validate');
const { login, me, logout } = require('../controllers/authController');
const {
  adminGetProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getDashboard,
} = require('../controllers/productsController');
const { createCategory, updateCategory, deleteCategory } = require('../controllers/categoriesController');
const { upload } = require('../config/storage');

const router = Router();

// ── Auth ────────────────────────────────────────────────────
router.post('/auth/login',  validateLogin, login);
router.post('/auth/logout', authMiddleware, logout);
router.get('/auth/me',      authMiddleware, me);

// ── Dashboard ───────────────────────────────────────────────
router.get('/dashboard', authMiddleware, getDashboard);

// ── Prodotti (admin) ────────────────────────────────────────
router.get   ('/products',              authMiddleware, adminGetProducts);
router.post  ('/products',              authMiddleware, validateProduct, createProduct);
router.put   ('/products/:id',          authMiddleware, validateProduct, updateProduct);
router.delete('/products/:id',          authMiddleware, deleteProduct);
router.post  ('/products/:id/image',    authMiddleware, upload.single('immagine'), uploadProductImage);

// ── Categorie (admin) ───────────────────────────────────────
router.post  ('/categories',      authMiddleware, validateCategory, createCategory);
router.put   ('/categories/:id',  authMiddleware, validateCategory, updateCategory);
router.delete('/categories/:id',  authMiddleware, deleteCategory);

module.exports = router;
