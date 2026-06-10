import { WHATSAPP_FALLBACK } from '../config';

/**
 * Genera l'URL WhatsApp con messaggio precompilato.
 *
 * @param {string} number - Numero in formato internazionale (es. 393451234567)
 * @param {string} message - Testo del messaggio
 * @returns {string} URL wa.me completo
 */
export function buildWhatsAppUrl(number, message) {
  const phone = (number || WHATSAPP_FALLBACK).replace(/\D/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}

/**
 * Messaggio precompilato per ordine prodotto.
 */
export function buildProductOrderMessage(nomeProdotto, prezzo) {
  const prezzoStr = typeof prezzo === 'number' ? prezzo.toFixed(2) : prezzo;
  return `Buongiorno, vorrei ordinare il prodotto: ${nomeProdotto} – Prezzo: €${prezzoStr}. Siete disponibili?`;
}

/**
 * Messaggio di contatto generico.
 */
export function buildContactMessage() {
  return 'Buongiorno, vorrei ricevere informazioni sui vostri prodotti.';
}
