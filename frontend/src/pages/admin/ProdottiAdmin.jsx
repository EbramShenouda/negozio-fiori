import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import { productsApi } from '../../lib/api';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1490750967868-88df5691cc63?w=200&q=60';

export default function ProdottiAdmin() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(() => {
    setLoading(true);
    productsApi.adminGetAll()
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => toast.error('Errore nel caricamento prodotti.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Eliminare "${nome}"? Questa azione è irreversibile.`)) return;
    setDeleting(id);
    try {
      await productsApi.delete(id);
      toast.success('Prodotto eliminato.');
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error('Errore durante l\'eliminazione.');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleDisponibile = async (product) => {
    try {
      const updated = await productsApi.update(product.id, { disponibile: !product.disponibile });
      setProducts((prev) => prev.map((p) => p.id === product.id ? updated.data.data : p));
      toast.success(`Prodotto ${!product.disponibile ? 'reso disponibile' : 'nascosto'}.`);
    } catch {
      toast.error('Errore aggiornamento disponibilità.');
    }
  };

  const filtered = products.filter((p) =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    (p.categoria_nome || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Prodotti</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} prodotti totali</p>
        </div>
        <Link to="/admin/prodotti/nuovo" className="btn-primary text-sm">
          <Plus className="w-4 h-4" /> Aggiungi
        </Link>
      </div>

      {/* Barra ricerca */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cerca per nome o categoria…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {/* Tabella */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Caricamento prodotti…</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {search ? 'Nessun prodotto trovato per questa ricerca.' : 'Nessun prodotto. Aggiungine uno!'}
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-natural-100 bg-cream-100">
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Prodotto</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-500">Categoria</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Prezzo</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-500">Stato</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-500">Azioni</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-natural-100">
                  {filtered.map((product) => (
                    <tr key={product.id} className="hover:bg-cream-100 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.immagine_url || product.immagine || PLACEHOLDER}
                            alt={product.nome}
                            className="w-10 h-10 rounded-lg object-cover bg-natural-100 shrink-0"
                            onError={(e) => { e.target.src = PLACEHOLDER; }}
                          />
                          <span className="font-medium text-gray-800 line-clamp-1">{product.nome}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{product.categoria_nome || '—'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-600">
                        €{Number(product.prezzo).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleDisponibile(product)}
                          title="Cambia disponibilità"
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors
                            ${product.disponibile
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                        >
                          {product.disponibile ? <><Eye className="w-3 h-3" />Visibile</> : <><EyeOff className="w-3 h-3" />Nascosto</>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/prodotti/${product.id}/modifica`}
                            className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Modifica"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, product.nome)}
                            disabled={deleting === product.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors
                                       disabled:opacity-40"
                            title="Elimina"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-natural-100">
              {filtered.map((product) => (
                <div key={product.id} className="p-4 flex items-start gap-3">
                  <img
                    src={product.immagine_url || product.immagine || PLACEHOLDER}
                    alt={product.nome}
                    className="w-14 h-14 rounded-xl object-cover bg-natural-100 shrink-0"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">{product.nome}</p>
                    <p className="text-xs text-gray-500">{product.categoria_nome || 'Senza categoria'}</p>
                    <p className="text-sm font-semibold text-brand-600 mt-0.5">€{Number(product.prezzo).toFixed(2)}</p>
                  </div>
                  <div className="flex gap-1">
                    <Link to={`/admin/prodotti/${product.id}/modifica`} className="p-2 text-gray-400 hover:text-brand-500">
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(product.id, product.nome)} className="p-2 text-gray-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
