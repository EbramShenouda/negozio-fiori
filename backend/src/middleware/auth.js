const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Middleware di autenticazione JWT.
 * Verifica il token nell'header Authorization: Bearer <token>
 * e inietta req.admin con i dati dell'utente autenticato.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Accesso non autorizzato.' });
  }

  const token = authHeader.slice(7); // rimuove "Bearer "

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.admin = { id: payload.id, username: payload.username };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Sessione scaduta. Effettua di nuovo il login.' });
    }
    return res.status(401).json({ success: false, message: 'Token non valido.' });
  }
}

module.exports = authMiddleware;
