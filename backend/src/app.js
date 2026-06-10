const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const env = require('./config/env');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Sicurezza ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }, // permette il caricamento immagini da frontend
  })
);

// ── CORS ─────────────────────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => {
    const allowed = [env.frontendUrl, 'http://localhost:5173', 'http://localhost:4173'];
    // Permetti richieste senza origin (es. Postman, mobile)
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origine non consentita: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// ── Rate limiting ─────────────────────────────────────────
// Limite globale: 200 req/15min per IP
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Troppe richieste. Riprova tra qualche minuto.' },
  })
);

// Limite più stretto per il login: 10 tentativi/15min
app.use(
  '/api/admin/auth/login',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, message: 'Troppi tentativi di login. Riprova tra 15 minuti.' },
  })
);

// ── Body parsing ─────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── File statici: immagini caricate ──────────────────────
app.use('/uploads', express.static(path.resolve(env.uploadPath)));

// ── API Routes ────────────────────────────────────────────
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);

// ── Health check ─────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

// ── 404 per rotte non trovate ─────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Rotta non trovata.' }));

// ── Gestione errori centralizzata ─────────────────────────
app.use(errorHandler);

module.exports = app;
