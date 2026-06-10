/**
 * Utility di sanitizzazione input.
 * Previene XSS escapando caratteri HTML nei valori stringa.
 */

const HTML_ESCAPE_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Sanitizza una singola stringa.
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char] || char).trim();
}

/**
 * Sanitizza tutti i valori stringa in un oggetto (un livello).
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return {};
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = typeof value === 'string' ? sanitizeString(value) : value;
  }
  return result;
}

module.exports = { sanitizeString, sanitizeObject };
