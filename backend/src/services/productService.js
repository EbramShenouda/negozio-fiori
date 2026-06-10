const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');

const ProductService = {
  /**
   * Prodotti visibili al pubblico (solo disponibili).
   */
  getPublicProducts(options = {}) {
    return ProductModel.findAll({ ...options, disponibile: true });
  },

  /**
   * I 4 prodotti più recenti per la homepage.
   */
  getFeatured() {
    return ProductModel.findAll({ disponibile: true, limit: 4, orderBy: 'data_creazione', order: 'DESC' });
  },

  /**
   * Dettaglio prodotto pubblico per slug.
   */
  getBySlug(slug) {
    const product = ProductModel.findBySlug(slug);
    if (!product || !product.disponibile) return null;
    return product;
  },

  /**
   * Dettaglio prodotto per admin (include non disponibili).
   */
  getByIdAdmin(id) {
    return ProductModel.findById(id);
  },

  /**
   * Tutti i prodotti per la dashboard admin.
   */
  getAllAdmin(options = {}) {
    return ProductModel.findAll(options);
  },

  create(data) {
    return ProductModel.create(data);
  },

  update(id, data) {
    return ProductModel.update(id, data);
  },

  delete(id) {
    return ProductModel.delete(id);
  },

  updateImage(id, imagePath) {
    return ProductModel.updateImage(id, imagePath);
  },

  /**
   * Statistiche per la dashboard admin.
   */
  getDashboardStats() {
    const totale = ProductModel.count();
    const disponibili = ProductModel.count({ disponibile: true });
    const non_disponibili = ProductModel.count({ disponibile: false });
    const categorie = CategoryModel.count();
    const recenti = ProductModel.findAll({ limit: 5, orderBy: 'data_creazione', order: 'DESC' });

    return { totale, disponibili, non_disponibili, categorie, recenti };
  },
};

module.exports = ProductService;
