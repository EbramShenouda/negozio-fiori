import { Link } from 'react-router-dom';
import { MessageCircle, Euro } from 'lucide-react';
import { buildWhatsAppUrl, buildProductOrderMessage } from '../../lib/whatsapp';
import { WHATSAPP_FALLBACK } from '../../config';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=400&q=70';

export default function ProductCard({ product, whatsappNumber }) {
  const imageUrl = product.immagine_url || product.immagine || PLACEHOLDER;
  const phone    = whatsappNumber || WHATSAPP_FALLBACK;
  const waUrl    = buildWhatsAppUrl(phone, buildProductOrderMessage(product.nome, product.prezzo));

  return (
    <div className="card overflow-hidden group flex flex-col">
      {/* Immagine */}
      <Link to={`/prodotto/${product.slug}`} className="block relative overflow-hidden">
        <div className="aspect-[4/3] bg-natural-100">
          <img
            src={imageUrl}
            alt={product.nome}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => { e.target.src = PLACEHOLDER; }}
          />
        </div>
        {/* Badge disponibilità */}
        {!product.disponibile && (
          <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
            Non disponibile
          </span>
        )}
      </Link>

      {/* Contenuto */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Categoria */}
        {product.categoria_nome && (
          <span className="badge mb-2">{product.categoria_nome}</span>
        )}

        {/* Nome */}
        <Link to={`/prodotto/${product.slug}`}>
          <h3 className="font-serif text-lg font-semibold text-gray-800 leading-snug
                         hover:text-brand-600 transition-colors line-clamp-2 mb-1.5">
            {product.nome}
          </h3>
        </Link>

        {/* Descrizione */}
        {product.descrizione && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-3">
            {product.descrizione}
          </p>
        )}

        {/* Prezzo + CTA */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-natural-100">
          <div className="flex items-center gap-0.5 text-brand-600 font-semibold text-lg">
            <Euro className="w-4 h-4" />
            <span>{Number(product.prezzo).toFixed(2)}</span>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp text-xs px-4 py-2"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Ordina
          </a>
        </div>
      </div>
    </div>
  );
}
