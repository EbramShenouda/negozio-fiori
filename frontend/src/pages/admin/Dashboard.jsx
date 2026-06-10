import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Tags, TrendingUp, Eye, PlusCircle } from 'lucide-react';
import { productsApi } from '../../lib/api';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=200&q=60';

export default function Dashboard() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.adminGetAll()
      .then(({ data }) => {
        const products = data.data || [];
        const disponibili    = products.filter((p) => p.disponibile).length;
        const non_disponibili = products.filter((p) => !p.disponibile).length;
        setStats({
          totale:           products.length,
          disponibili,
          non_disponibili,
          recenti:          products.slice(0, 5),
        });
      })
      .catch(() => setStats({ totale: 0, disponibili: 0, non_disponibili: 0, recenti: [] }))
      .finally(() => setLoading(false));
  }, []);

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl shadow-card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{loading ? '–' : value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Panoramica del negozio</p>
        </div>
        <Link to="/admin/prodotti/nuovo" className="btn-primary text-sm">
          <PlusCircle className="w-4 h-4" /> Nuovo prodotto
        </Link>
      </div>

      {/* Statistiche */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard icon={Package}    label="Prodotti totali"     value={stats?.totale}           color="bg-brand-500" />
        <StatCard icon={Eye}        label="Disponibili"         value={stats?.disponibili}       color="bg-green-500" />
        <StatCard icon={TrendingUp} label="Non disponibili"     value={stats?.non_disponibili}   color="bg-amber-500" />
      </div>

      {/* Link rapidi */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
        {[
          { to: '/admin/prodotti',          icon: Package, label: 'Gestisci prodotti' },
          { to: '/admin/prodotti/nuovo',    icon: PlusCircle, label: 'Aggiungi prodotto' },
          { to: '/admin/categorie',         icon: Tags, label: 'Gestisci categorie' },
        ].map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl shadow-card p-5 flex flex-col items-center gap-3
                       text-center hover:shadow-soft-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-brand-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>

      {/* Prodotti recenti */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-natural-100 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-gray-800">Ultimi prodotti</h2>
          <Link to="/admin/prodotti" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            Vedi tutti →
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400">Caricamento…</div>
        ) : (
          <ul className="divide-y divide-natural-100">
            {stats?.recenti?.map((p) => (
              <li key={p.id} className="flex items-center gap-4 px-6 py-3 hover:bg-cream-100 transition-colors">
                <img
                  src={p.immagine_url || p.immagine || PLACEHOLDER}
                  alt={p.nome}
                  className="w-10 h-10 rounded-lg object-cover bg-natural-100"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.nome}</p>
                  <p className="text-xs text-gray-500">{p.categoria_nome || 'Senza categoria'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-brand-600">€{Number(p.prezzo).toFixed(2)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${p.disponibile ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {p.disponibile ? 'Disponibile' : 'N/D'}
                  </span>
                </div>
                <Link to={`/admin/prodotti/${p.id}/modifica`} className="text-gray-400 hover:text-brand-500 ml-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
