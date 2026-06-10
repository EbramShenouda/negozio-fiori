const ProductModel = require('../models/productModel');
const CategoryModel = require('../models/categoryModel');

const ProductService = {

  async getPublicProducts(options = {}) {
    return ProductModel.findAll({ ...options, disponibile: true });
  },

  async getFeatured() {
    return ProductModel.findAll({ disponibile: true, limit: 4, orderBy: 'data_creazione', order: 'DESC' });
  },

  async getBySlug(slug) {
    const product = await ProductModel.findBySlug(slug);
    if (!product || !product.disponibile) return null;
    return product;
  },

  async getByIdAdmin(id) {
    return ProductModel.findById(id);
  },

  async getAllAdmin(options = {}) {
    return ProductModel.findAll(options);
  },

  async create(data) {
    return ProductModel.create(data);
  },

  async update(id, data) {
    return ProductModel.update(id, data);
  },

  async delete(id) {
    return ProductModel.delete(id);
  },

  async updateImage(id, imageUrl) {
    return ProductModel.updateImage(id, imageUrl);
  },

  async getDashboardStats() {
    const [totale, disponibili, non_disponibili, categorie, recenti] = await Promise.all([
      ProductModel.count(),
      ProductModel.count({ disponibile: true }),
      ProductModel.count({ disponibile: false }),
      CategoryModel.count(),
      ProductModel.findAll({ limit: 5, orderBy: 'data_creazione', order: 'DESC' }),
    ]);
    return { totale, disponibili, non_disponibili, categorie, recenti };
  },
};

module.exports = ProductService;
