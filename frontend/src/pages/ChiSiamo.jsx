import { Link } from 'react-router-dom';
import { Flower2, Users, Target, MapPin, Phone, Mail } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { CONTACT, WHATSAPP_FALLBACK } from '../config';

export default function ChiSiamo() {
  return (
    <>
      <SEOHead
        title="Chi Siamo"
        description="Scopri la storia di Fiori di Sandro, il negozio di fiori artigianale con oltre 20 anni di esperienza. La nostra mission è rendere speciali i tuoi momenti."
      />

      {/* Header */}
      <section className="bg-brand-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Flower2 className="w-12 h-12 text-petal-400 mx-auto mb-4" />
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Chi Siamo</h1>
          <p className="text-brand-200 text-lg max-w-xl mx-auto">
            Una storia di passione, colori e profumi nata nel cuore della città.
          </p>
        </div>
      </section>

      {/* La nostra storia */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div className="animate-slide-up">
              <span className="badge mb-4">La nostra storia</span>
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800 font-bold leading-tight mb-6">
                Vent'anni di fiori<br />e passione
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Fiori di Sandro nasce nel 2004 da un sogno: portare la bellezza della natura nelle case delle persone, in ogni giorno speciale e in quelli ordinari.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Sandro ha imparato l'arte floreale dai maestri più rinomati d'Italia, unendo la tecnica classica a uno stile contemporaneo e personale.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Oggi il nostro team di florist esperti lavora ogni giorno per selezionare i fiori più freschi, creare composizioni su misura e rendere ogni evento indimenticabile.
              </p>
              <Link to="/contatti" className="btn-primary">
                Vieni a trovarci
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80"
                alt="Fiori in negozio"
                className="rounded-2xl shadow-card w-full aspect-square object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=400&q=80"
                alt="Composizioni floreali"
                className="rounded-2xl shadow-card w-full aspect-square object-cover mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-natural-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title">La nostra missione</h2>
          <p className="section-subtitle">Rendiamo speciali i momenti della tua vita con fiori scelti con cura.</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="card p-8">
              <Target className="w-10 h-10 text-brand-500 mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-3">La nostra mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Offrire prodotti floreali di alta qualità, realizzati con professionalità e creatività, per celebrare ogni momento della vita: un compleanno, un anniversario, una cerimonia o semplicemente un "voglio bene".
              </p>
            </div>
            <div className="card p-8">
              <Users className="w-10 h-10 text-brand-500 mb-4" />
              <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-3">Il nostro approccio</h3>
              <p className="text-gray-600 leading-relaxed">
                Ogni cliente è unico. Ascoltiamo le tue idee e le trasformiamo in composizioni floreali su misura. Il nostro obiettivo è sempre superare le tue aspettative, con un sorriso.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valori numerici */}
      <section className="py-16 bg-brand-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { numero: '20+', label: 'Anni di esperienza' },
              { numero: '5000+', label: 'Clienti soddisfatti' },
              { numero: '365', label: 'Giorni all\'anno' },
              { numero: '100%', label: 'Fiori freschi' },
            ].map(({ numero, label }) => (
              <div key={label}>
                <p className="font-serif text-4xl md:text-5xl font-bold text-petal-300 mb-2">{numero}</p>
                <p className="text-brand-100 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contatti rapidi */}
      <section className="py-20 bg-cream">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl font-bold text-gray-800 mb-8">Vieni a trovarci</h2>
          <div className="space-y-4 mb-10">
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <MapPin className="w-5 h-5 text-brand-500" /> {CONTACT.indirizzo}
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <Phone className="w-5 h-5 text-brand-500" />
              <a href={`tel:${CONTACT.telefono.replace(/\s/g,'')}`} className="hover:text-brand-600">{CONTACT.telefono}</a>
            </div>
            <div className="flex items-center justify-center gap-3 text-gray-600">
              <Mail className="w-5 h-5 text-brand-500" />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-brand-600">{CONTACT.email}</a>
            </div>
          </div>
          <WhatsAppButton whatsappNumber={WHATSAPP_FALLBACK} size="lg" />
        </div>
      </section>
    </>
  );
}
