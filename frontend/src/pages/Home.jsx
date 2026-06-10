import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, Star, ArrowRight, Leaf, Heart, Award } from 'lucide-react';
import { useFeaturedProducts } from '../hooks/useProducts';
import { configApi } from '../lib/api';
import ProductGrid from '../components/products/ProductGrid';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import SEOHead from '../components/seo/SEOHead';
import { WHATSAPP_FALLBACK } from '../config';

// Recensioni demo
const REVIEWS = [
  { nome: 'Giulia M.', stelle: 5, testo: 'Bouquet meraviglioso, fiori freschissimi! Lo ricomprerei mille volte. Sandro è gentilissimo e molto professionale.' },
  { nome: 'Marco T.', stelle: 5, testo: 'Ho ordinato un bouquet sposa su misura. Il risultato ha superato ogni aspettativa. Altamente consigliato!' },
  { nome: 'Laura B.', stelle: 5, testo: 'I miei fiori preferiti in città. Sempre freschi, ottima qualità e prezzi onesti. Un negozio che consiglio a tutti.' },
];

const FEATURES = [
  { icon: Leaf,  title: 'Fiori Freschi',      desc: 'Selezionati ogni mattina dai migliori mercati floreali.' },
  { icon: Heart, title: 'Fatto a Mano',        desc: 'Ogni bouquet è unico, creato con passione e cura.' },
  { icon: Award, title: 'Qualità Garantita',   desc: 'Oltre 20 anni di esperienza nel settore floreale.' },
];

export default function Home() {
  const { products, loading } = useFeaturedProducts();
  const [whatsappNumber, setWhatsappNumber] = useState(WHATSAPP_FALLBACK);

  useEffect(() => {
    configApi.get()
      .then(({ data }) => { if (data?.data?.whatsappNumber) setWhatsappNumber(data.data.whatsappNumber); })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEOHead />

      {/* ── Hero ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=1400&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 hero-gradient" />
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-6">
            <Flower2 className="w-12 h-12 text-petal-400 drop-shadow-lg" />
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-bold leading-tight mb-6 drop-shadow-md">
            Fiori per ogni<br />
            <em className="text-petal-300 not-italic">momento speciale</em>
          </h1>
          <p className="text-brand-100 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
            Bouquet artigianali, composizioni eleganti e piante ornamentali. Ogni fiore racconta la tua storia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/catalogo" className="btn-primary text-base px-8 py-4">
              Scopri il Catalogo <ArrowRight className="w-5 h-5" />
            </Link>
            <WhatsAppButton whatsappNumber={whatsappNumber} size="lg" className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/40" />
          </div>
        </div>

        {/* Onda decorativa */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" className="w-full fill-cream" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ── Caratteristiche ──────────────────────────────── */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-card animate-slide-up">
                <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-brand-500" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Presentazione negozio ───────────────────────── */}
      <section className="py-20 bg-natural-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <span className="badge mb-4">La nostra storia</span>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800 font-bold leading-tight mb-6">
                Benvenuti da<br /><span className="text-brand-500">Fiori di Sandro</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Dal 2004 il nostro negozio è un punto di riferimento per chi cerca fiori freschi, composizioni artigianali e la consulenza di un florist esperto.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Sandro e il suo team selezionano personalmente ogni fiore, garantendo qualità, freschezza e un tocco unico in ogni bouquet.
              </p>
              <Link to="/chi-siamo" className="btn-outline">
                Scopri di più <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80"
                alt="Il negozio Fiori di Sandro"
                className="rounded-3xl shadow-soft-lg w-full object-cover aspect-[4/3]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card px-6 py-4">
                <p className="font-serif text-3xl font-bold text-brand-500">20+</p>
                <p className="text-sm text-gray-500">anni di esperienza</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prodotti in evidenza ────────────────────────── */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">I nostri prodotti in evidenza</h2>
          <p className="section-subtitle">Selezionati per te, creati con cura artigianale.</p>
          <ProductGrid products={products} loading={loading} whatsappNumber={whatsappNumber} />
          <div className="text-center mt-12">
            <Link to="/catalogo" className="btn-primary">
              Vedi tutto il catalogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recensioni ──────────────────────────────────── */}
      <section className="py-20 bg-natural-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">Cosa dicono i nostri clienti</h2>
          <p className="section-subtitle">Ogni giorno rendiamo speciali i momenti delle persone.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map(({ nome, stelle, testo }) => (
              <div key={nome} className="card p-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: stelle }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic mb-4">"{testo}"</p>
                <p className="font-medium text-brand-600 text-sm">— {nome}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA WhatsApp ─────────────────────────────────── */}
      <section className="py-20 bg-brand-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <Flower2 className="w-12 h-12 text-petal-300 mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Hai un'idea in mente?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Scrivici su WhatsApp e creeremo insieme il bouquet perfetto per te.
          </p>
          <WhatsAppButton whatsappNumber={whatsappNumber} label="Contattaci su WhatsApp" size="lg" />
        </div>
      </section>
    </>
  );
}
