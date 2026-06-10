import axios from 'axios';
import { API_URL } from '../config';

// Istanza Axios condivisa
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Inietta il JWT nelle richieste admin se presente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestione risposta: redirect al login se 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      // Redirect solo se siamo in una pagina admin
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── API helpers ──────────────────────────────────────────

export const productsApi = {
  getAll:      (params) => api.get('/products', { params }),
  getFeatured: ()       => api.get('/products/featured'),
  getBySlug:   (slug)   => api.get(`/products/${slug}`),

  // Admin
  adminGetAll:   (params)       => api.get('/admin/products', { params }),
  create:        (data)         => api.post('/admin/products', data),
  update:        (id, data)     => api.put(`/admin/products/${id}`, data),
  delete:        (id)           => api.delete(`/admin/products/${id}`),
  uploadImage:   (id, formData) => api.post(`/admin/products/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const categoriesApi = {
  getAll: () => api.get('/categories'),

  // Admin
  create: (data)     => api.post('/admin/categories', data),
  update: (id, data) => api.put(`/admin/categories/${id}`, data),
  delete: (id)       => api.delete(`/admin/categories/${id}`),
};

export const authApi = {
  login:  (credentials) => api.post('/admin/auth/login', credentials),
  logout: ()            => api.post('/admin/auth/logout'),
  me:     ()            => api.get('/admin/auth/me'),
};

export const configApi = {
  get: () => api.get('/config'),
};

export default api;
