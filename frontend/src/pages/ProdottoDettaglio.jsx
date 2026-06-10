import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Euro, Tag, CheckCircle, XCircle } from 'lucide-react';
import { useProduct } from '../hooks/useProduct';
import { configApi } from '../lib/api';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEOHead from '../components/seo/SEOHead';
import { WHATSAPP_FALLBACK } from '../config';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=800&q=80';

export default function ProdottoDettaglio() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(slug);
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_FALLBACK);

  useEffect(() => {
    configApi.get()
      .then(({ data }) => { if (data?.data?.whatsappNumber) setWhatsappNumber(data.data.whatsappNumber); })
      .catch(() => {});
  }, []);

  // Reindirizza al 404 se prodotto non trovato
  useEffect(() => {
    if (!loading && error) navigate('/404', { replace: true });
  }, [loading, error, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!product) return null;

  const imageUrl = product.immagine_url || product.immagine || PLACEHOLDER;

  return (
    <>
      <SEOHead
        title={product.nome}
        description={product.descrizione || `Ordina ${product.nome} da Fiori di Sandro.`}
        image={imageUrl}
      />

      <div className="bg-cream min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link to="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/catalogo" className="hover:text-brand-600 transition-colors">Catalogo</Link>
            <span>/</span>
            <span className="text-gray-800">{product.nome}</span>
          </nav>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Immagine */}
            <div className="relative rounded-3xl overflow-hidden shadow-soft-lg aspect-[4/3] bg-natural-100">
              <img
                src={imageUrl}
                alt={product.nome}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }}
              />
            </div>

            {/* Info */}
            <div className="animate-slide-up">
              {/* Categoria */}
              {product.categoria_nome && (
                <div className="flex items-center gap-1.5 mb-3">
                  <Tag className="w-4 h-4 text-brand-500" />
                  <span className="badge">{product.categoria_nome}</span>
                </div>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl text-gray-800 font-bold leading-tight mb-4">
                {product.nome}
              </h1>

              {/* Prezzo */}
              <div className="flex items-center gap-1 text-3xl font-bold text-brand-600 mb-6">
                <Euro className="w-6 h-6" />
                <span>{Number(product.prezzo).toFixed(2)}</span>
              </div>

              {/* Disponibilità */}
              <div className={`flex items-center gap-2 text-sm font-medium mb-6
                ${product.disponibile ? 'text-green-600' : 'text-red-500'}`}>
                {product.disponibile
                  ? <><CheckCircle className="w-5 h-5" /> Disponibile</>
                  : <><XCircle    className="w-5 h-5" /> Non disponibile</>}
              </div>

              {/* Descrizione */}
              {product.descrizione && (
                <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
                  <h2 className="font-serif font-semibold text-gray-700 mb-3">Descrizione</h2>
                  <p className="text-gray-600 leading-relaxed">{product.descrizione}</p>
                </div>
              )}

              {/* CTA */}
              <div className="space-y-3">
                <WhatsAppButton
                  whatsappNumber={whatsappNumber}
                  product={product}
                  size="lg"
                  className="w-full justify-center"
                />
                <Link
                  to="/catalogo"
                  className="flex items-center justify-center gap-2 btn-outline w-full"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Torna al catalogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
