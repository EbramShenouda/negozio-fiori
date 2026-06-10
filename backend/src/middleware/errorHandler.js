const env = require('../config/env');

/**
 * Gestione centralizzata degli errori Express.
 * Restituisce sempre JSON con formato coerente.
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, _next) {
  // Log dell'errore in development
  if (!env.isProduction) {
    console.error('[Error]', err);
  }

  // Errori di Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: `File troppo grande. Dimensione massima: ${Math.round(env.maxFileSize / 1024 / 1024)} MB.`,
    });
  }

  if (err.message && err.message.includes('Formato file')) {
    return res.status(415).json({ success: false, message: err.message });
  }

  // Errori SQLite di unicità (UNIQUE constraint)
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    return res.status(409).json({ success: false, message: 'Valore duplicato: esiste già un record con questi dati.' });
  }

  // Errore generico
  const status = err.status || err.statusCode || 500;
  const message = env.isProduction ? 'Errore interno del server.' : (err.message || 'Errore interno del server.');

  return res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
