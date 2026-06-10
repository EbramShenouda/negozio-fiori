/**
 * Configurazione centralizzata del frontend.
 * Modifica VITE_API_URL nel file .env per la produzione.
 */

// URL base delle API: in dev Vite proxia /api verso Express
export const API_URL = import.meta.env.VITE_API_URL || '';

// Numero WhatsApp del negozio (caricato dall'API /config al primo render)
// Valore di fallback usato prima del caricamento
export const WHATSAPP_FALLBACK = '393451234567';

export const SITE_NAME = 'Fiori di Sandro';

export const CONTACT = {
  telefono: '+39 345 123 4567',
  email:    'info@fioridisandro.it',
  indirizzo: 'Via dei Fiori 12, 20100 Milano (MI)',
  orari:    'Lun–Sab: 08:00–19:30 | Dom: 09:00–13:00',
};
