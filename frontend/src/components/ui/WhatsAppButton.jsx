import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl, buildProductOrderMessage, buildContactMessage } from '../../lib/whatsapp';

/**
 * Pulsante WhatsApp riutilizzabile.
 * In modalità "product": genera messaggio con nome e prezzo.
 * In modalità "contact": messaggio generico.
 */
export default function WhatsAppButton({
  whatsappNumber,
  product = null,
  label,
  size = 'md',
  className = '',
}) {
  const message = product
    ? buildProductOrderMessage(product.nome, product.prezzo)
    : buildContactMessage();

  const url = buildWhatsAppUrl(whatsappNumber, message);

  const sizeMap = {
    sm:  'text-xs px-4 py-2',
    md:  'text-sm px-6 py-3',
    lg:  'text-base px-8 py-4',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`btn-whatsapp ${sizeMap[size] || sizeMap.md} ${className}`}
    >
      <MessageCircle className="w-4 h-4 shrink-0" />
      {label || (product ? 'Ordina su WhatsApp' : 'Contattaci su WhatsApp')}
    </a>
  );
}
