const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const env = require('../config/env');

/**
 * POST /api/auth/login
 * Autentica l'admin e restituisce un JWT.
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username e password obbligatori.' });
    }

    // Ricerca admin nel DB
    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username.trim());

    // Risposta generica per evitare user enumeration
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Credenziali non valide.' });
    }

    const passwordValid = await bcrypt.compare(password, admin.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ success: false, message: 'Credenziali non valide.' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    return res.json({
      success: true,
      token,
      admin: { id: admin.id, username: admin.username },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Restituisce i dati dell'admin autenticato (richiede JWT).
 */
function me(req, res) {
  return res.json({
    success: true,
    admin: { id: req.admin.id, username: req.admin.username },
  });
}

/**
 * POST /api/auth/logout
 * Il client deve eliminare il token. Questo endpoint è puramente semantico.
 */
function logout(_req, res) {
  return res.json({ success: true, message: 'Logout effettuato.' });
}

module.exports = { login, me, logout };
