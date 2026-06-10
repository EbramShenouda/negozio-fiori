import { Link } from 'react-router-dom';
import { Flower2, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { CONTACT, WHATSAPP_FALLBACK } from '../../config';
import { buildWhatsAppUrl, buildContactMessage } from '../../lib/whatsapp';

export default function Footer() {
  const year = new Date().getFullYear();
  const waUrl = buildWhatsAppUrl(WHATSAPP_FALLBACK, buildContactMessage());

  return (
    <footer className="bg-brand-800 text-brand-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Flower2 className="w-6 h-6 text-petal-400" />
              <span className="font-serif text-xl font-semibold text-white">Fiori di Sandro</span>
            </div>
            <p className="text-sm text-brand-200 leading-relaxed">
              Bouquet freschi, composizioni artigianali e piante ornamentali. Ogni fiore racconta una storia.
            </p>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-5 bg-green-500 hover:bg-green-400 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Scrivici su WhatsApp
            </a>
          </div>

          {/* Link rapidi */}
          <div>
            <h3 className="font-serif text-white font-semibold mb-4">Navigazione</h3>
            <ul className="space-y-2 text-sm text-brand-200">
              {[
                { to: '/',          label: 'Home' },
                { to: '/catalogo',  label: 'Catalogo' },
                { to: '/chi-siamo', label: 'Chi Siamo' },
                { to: '/contatti',  label: 'Contatti' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div>
            <h3 className="font-serif text-white font-semibold mb-4">Contatti</h3>
            <ul className="space-y-3 text-sm text-brand-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 text-petal-400 shrink-0" />
                <span>{CONTACT.indirizzo}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-petal-400 shrink-0" />
                <a href={`tel:${CONTACT.telefono.replace(/\s/g,'')}`} className="hover:text-white transition-colors">
                  {CONTACT.telefono}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-petal-400 shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors">
                  {CONTACT.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Orari */}
          <div>
            <h3 className="font-serif text-white font-semibold mb-4">Orari</h3>
            <div className="flex items-start gap-2.5">
              <Clock className="w-4 h-4 mt-0.5 text-petal-400 shrink-0" />
              <p className="text-sm text-brand-200 leading-relaxed">{CONTACT.orari}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-700 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-brand-300">
          <p>© {year} Fiori di Sandro. Tutti i diritti riservati.</p>
          <p>Realizzato con ❤️ artigianale</p>
        </div>
      </div>
    </footer>
  );
}
