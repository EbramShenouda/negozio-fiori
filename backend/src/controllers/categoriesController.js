const CategoryModel = require('../models/categoryModel');
const { sanitizeObject } = require('../utils/sanitize');

async function getCategories(_req, res, next) {
  try {
    const categories = await CategoryModel.findAll();
    return res.json({ success: true, data: categories });
  } catch (err) { next(err); }
}

async function createCategory(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    if (!safe.nome) {
      return res.status(400).json({ success: false, message: 'Il nome è obbligatorio.' });
    }
    if (await CategoryModel.findByNome(safe.nome)) {
      return res.status(409).json({ success: false, message: 'Categoria già esistente.' });
    }
    const cat = await CategoryModel.create({ nome: safe.nome, descrizione: safe.descrizione });
    return res.status(201).json({ success: true, data: cat });
  } catch (err) { next(err); }
}

async function updateCategory(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    const cat  = await CategoryModel.update(req.params.id, {
      nome:        safe.nome,
      descrizione: safe.descrizione,
    });
    if (!cat) return res.status(404).json({ success: false, message: 'Categoria non trovata.' });
    return res.json({ success: true, data: cat });
  } catch (err) { next(err); }
}

async function deleteCategory(req, res, next) {
  try {
    await CategoryModel.delete(req.params.id);
    return res.json({ success: true, message: 'Categoria eliminata.' });
  } catch (err) { next(err); }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };


/**
 * GET /api/categories
 * Elenco categorie pubblico (con conteggio prodotti).
 */
function getCategories(_req, res, next) {
  try {
    const categories = CategoryModel.findAll();
    return res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/categories
 */
function createCategory(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    if (!safe.nome) {
      return res.status(400).json({ success: false, message: 'Il nome è obbligatorio.' });
    }
    // Verifica unicità
    if (CategoryModel.findByNome(safe.nome)) {
      return res.status(409).json({ success: false, message: 'Categoria già esistente.' });
    }
    const cat = CategoryModel.create({ nome: safe.nome, descrizione: safe.descrizione });
    return res.status(201).json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/admin/categories/:id
 */
function updateCategory(req, res, next) {
  try {
    const safe = sanitizeObject(req.body);
    const cat = CategoryModel.update(req.params.id, {
      nome:        safe.nome,
      descrizione: safe.descrizione,
    });
    if (!cat) return res.status(404).json({ success: false, message: 'Categoria non trovata.' });
    return res.json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/admin/categories/:id
 */
function deleteCategory(req, res, next) {
  try {
    const deleted = CategoryModel.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Categoria non trovata.' });
    return res.json({ success: true, message: 'Categoria eliminata.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
