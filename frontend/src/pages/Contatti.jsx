import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import { CONTACT, WHATSAPP_FALLBACK } from '../config';

export default function Contatti() {
  const [form, setForm] = useState({ nome: '', email: '', messaggio: '' });
  const [sent, setSent] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // Il form costruisce un messaggio WhatsApp con i dati inseriti
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = `Buongiorno, sono ${form.nome} (${form.email}).\n\n${form.messaggio}`;
    const url  = `https://wa.me/${WHATSAPP_FALLBACK}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <>
      <SEOHead
        title="Contatti"
        description="Contatta Fiori di Sandro: telefono, email, indirizzo e WhatsApp. Siamo a Milano, in Via dei Fiori 12."
      />

      {/* Header */}
      <section className="bg-brand-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">Contattaci</h1>
          <p className="text-brand-200 text-lg">Siamo qui per te. Scrivi, chiama o vieni a trovarci.</p>
        </div>
      </section>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Colonna info */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-gray-800 mb-8">Informazioni</h2>

              <div className="space-y-6 mb-10">
                {[
                  { icon: MapPin, title: 'Indirizzo',   value: CONTACT.indirizzo,   href: null },
                  { icon: Phone,  title: 'Telefono',    value: CONTACT.telefono,    href: `tel:${CONTACT.telefono.replace(/\s/g,'')}` },
                  { icon: Mail,   title: 'Email',        value: CONTACT.email,       href: `mailto:${CONTACT.email}` },
                  { icon: Clock,  title: 'Orari',        value: CONTACT.orari,       href: null },
                ].map(({ icon: Icon, title, value, href }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{title}</p>
                      {href
                        ? <a href={href} className="text-gray-700 hover:text-brand-600 transition-colors">{value}</a>
                        : <p className="text-gray-700">{value}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-start gap-4">
                <MessageCircle className="w-8 h-8 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800 mb-1">Risposta rapida su WhatsApp</p>
                  <p className="text-sm text-gray-500 mb-3">Rispondiamo entro pochi minuti durante l'orario di apertura.</p>
                  <WhatsAppButton whatsappNumber={WHATSAPP_FALLBACK} size="sm" />
                </div>
              </div>

              {/* Mappa Google incorporata */}
              <div className="mt-8 rounded-2xl overflow-hidden shadow-card">
                <iframe
                  title="Mappa Fiori di Sandro"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2798.247123456789!2d9.18951!3d45.46427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDI3JzUxLjQiTiA5wrAxMScyMi4yIkU!5e0!3m2!1sit!2sit!4v1620000000000!5m2!1sit!2sit"
                  width="100%"
                  height="240"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            {/* Colonna form */}
            <div>
              <h2 className="font-serif text-2xl font-semibold text-gray-800 mb-8">Inviaci un messaggio</h2>

              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                  <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <p className="font-medium text-gray-800 text-lg mb-2">WhatsApp aperto!</p>
                  <p className="text-gray-500 text-sm">Il tuo messaggio è pronto da inviare su WhatsApp.</p>
                  <button onClick={() => setSent(false)} className="btn-outline mt-6 text-sm">
                    Invia un altro messaggio
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="label" htmlFor="nome">Nome *</label>
                    <input
                      id="nome" name="nome" type="text" required
                      value={form.nome} onChange={handleChange}
                      placeholder="Il tuo nome"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="email">Email</label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      placeholder="tua@email.it"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="messaggio">Messaggio *</label>
                    <textarea
                      id="messaggio" name="messaggio" required rows={5}
                      value={form.messaggio} onChange={handleChange}
                      placeholder="Come possiamo aiutarti?"
                      className="input-field resize-none"
                    />
                  </div>
                  <button type="submit" className="btn-whatsapp w-full justify-center">
                    <Send className="w-4 h-4" />
                    Invia tramite WhatsApp
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    Il messaggio verrà aperto su WhatsApp per l'invio diretto.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
