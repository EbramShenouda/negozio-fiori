const _slugify = require('slugify');

/**
 * Genera uno slug URL-friendly da un testo italiano.
 * es: "Bouquet di Rose Rosse" → "bouquet-di-rose-rosse"
 */
function slugify(text) {
  return _slugify(String(text), {
    lower: true,
    strict: true,       // rimuove caratteri speciali
    locale: 'it',
    replacement: '-',
    trim: true,
  });
}

/**
 * Genera uno slug univoco aggiungendo un suffisso corto basato su UUID.
 * es: "bouquet-di-rose-rosse-a1b2c3"
 */
function uniqueSlug(text, uuidSuffix) {
  const base = slugify(text);
  const suffix = uuidSuffix.split('-')[0]; // prime 8 cifre dell'UUID
  return `${base}-${suffix}`;
}

module.exports = { slugify, uniqueSlug };
