const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const env = require('./env');

// Crea la directory del database se non esiste
const dbDir = path.dirname(path.resolve(env.dbPath));
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Inizializza il database SQLite
const db = new Database(path.resolve(env.dbPath));

// Modalità WAL per migliori performance in lettura
db.pragma('journal_mode = WAL');
// Abilita chiavi esterne
db.pragma('foreign_keys = ON');

/**
 * Crea le tabelle necessarie se non esistono già.
 * Eseguito a ogni avvio dell'applicazione.
 */
const initDatabase = () => {
  db.exec(`
    -- Categorie prodotti
    CREATE TABLE IF NOT EXISTS categories (
      id          TEXT PRIMARY KEY,
      nome        TEXT NOT NULL UNIQUE,
      descrizione TEXT NOT NULL DEFAULT '',
      slug        TEXT NOT NULL UNIQUE,
      data_creazione TEXT NOT NULL
    );

    -- Prodotti del negozio
    CREATE TABLE IF NOT EXISTS products (
      id             TEXT PRIMARY KEY,
      nome           TEXT NOT NULL,
      descrizione    TEXT NOT NULL DEFAULT '',
      prezzo         REAL NOT NULL CHECK(prezzo >= 0),
      categoria_id   TEXT,
      immagine       TEXT DEFAULT NULL,
      disponibile    INTEGER NOT NULL DEFAULT 1 CHECK(disponibile IN (0, 1)),
      slug           TEXT NOT NULL UNIQUE,
      data_creazione TEXT NOT NULL,
      FOREIGN KEY (categoria_id) REFERENCES categories(id) ON DELETE SET NULL
    );

    -- Utenti amministratori
    CREATE TABLE IF NOT EXISTS admins (
      id             TEXT PRIMARY KEY,
      username       TEXT NOT NULL UNIQUE,
      password_hash  TEXT NOT NULL,
      data_creazione TEXT NOT NULL
    );
  `);

  console.log('✅ Database inizializzato correttamente.');
};

initDatabase();

module.exports = db;
