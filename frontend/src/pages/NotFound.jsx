import { Link } from 'react-router-dom';
import { Flower2, Home } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';

export default function NotFound() {
  return (
    <>
      <SEOHead title="Pagina non trovata" />
      <div className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <Flower2 className="w-16 h-16 text-brand-300 mx-auto mb-6 animate-pulse-soft" />
          <h1 className="font-serif text-8xl font-bold text-brand-200 mb-4">404</h1>
          <h2 className="font-serif text-2xl text-gray-700 mb-4">Pagina non trovata</h2>
          <p className="text-gray-500 mb-8">
            Sembra che questa pagina sia sfiorita. Torna alla homepage per trovare quello che cerchi.
          </p>
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Torna alla Homepage
          </Link>
        </div>
      </div>
    </>
  );
}
