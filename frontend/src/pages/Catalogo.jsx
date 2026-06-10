import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { categoriesApi, configApi } from '../lib/api';
import ProductGrid from '../components/products/ProductGrid';
import SEOHead from '../components/seo/SEOHead';
import { WHATSAPP_FALLBACK } from '../config';

export default function Catalogo() {
  const [categories,    setCategories]    = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_FALLBACK);

  const params = activeCategory ? { categoria_id: activeCategory } : {};
  const { products, loading, error } = useProducts(params);

  useEffect(() => {
    categoriesApi.getAll().then(({ data }) => setCategories(data.data || [])).catch(() => {});
    configApi.get().then(({ data }) => { if (data?.data?.whatsappNumber) setWhatsappNumber(data.data.whatsappNumber); }).catch(() => {});
  }, []);

  return (
    <>
      <SEOHead
        title="Catalogo Prodotti"
        description="Sfoglia il nostro catalogo di bouquet freschi, composizioni floreali e piante ornamentali. Ordina direttamente su WhatsApp."
      />

      {/* Header pagina */}
      <section className="bg-brand-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Il Nostro Catalogo</h1>
          <p className="text-brand-200 text-lg max-w-xl mx-auto">
            Bouquet freschi, composizioni artigianali e molto altro. Ordina su WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filtri categoria */}
          {categories.length > 0 && (
            <div className="flex items-center gap-3 flex-wrap mb-8">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 mr-2">
                <Filter className="w-4 h-4" /> Filtra:
              </div>
              <button
                onClick={() => setActiveCategory('')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${!activeCategory
                    ? 'bg-brand-500 text-white shadow-soft'
                    : 'bg-white text-gray-600 border border-natural-200 hover:border-brand-300 hover:text-brand-600'}`}
              >
                Tutti
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${activeCategory === cat.id
                      ? 'bg-brand-500 text-white shadow-soft'
                      : 'bg-white text-gray-600 border border-natural-200 hover:border-brand-300 hover:text-brand-600'}`}
                >
                  {cat.nome}
                  {cat.prodotti_count > 0 && (
                    <span className="ml-1.5 text-xs opacity-70">({cat.prodotti_count})</span>
                  )}
                </button>
              ))}
            </div>
          )}

          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            whatsappNumber={whatsappNumber}
            emptyMessage="Nessun prodotto disponibile in questa categoria."
          />
        </div>
      </section>
    </>
  );
}
