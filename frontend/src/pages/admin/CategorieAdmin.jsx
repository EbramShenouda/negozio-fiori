import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { categoriesApi } from '../../lib/api';
import toast from 'react-hot-toast';

export default function CategorieAdmin() {
  const [categories, setCategories]   = useState([]);
  const [loading,    setLoading]      = useState(true);
  const [editingId,  setEditingId]    = useState(null);
  const [editForm,   setEditForm]     = useState({ nome: '', descrizione: '' });
  const [newForm,    setNewForm]      = useState({ nome: '', descrizione: '' });
  const [showNew,    setShowNew]      = useState(false);
  const [saving,     setSaving]       = useState(false);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    categoriesApi.getAll()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => toast.error('Errore caricamento categorie.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newForm.nome.trim()) { toast.error('Il nome è obbligatorio.'); return; }
    setSaving(true);
    try {
      await categoriesApi.create(newForm);
      toast.success('Categoria creata!');
      setNewForm({ nome: '', descrizione: '' });
      setShowNew(false);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Errore durante la creazione.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditForm({ nome: cat.nome, descrizione: cat.descrizione || '' });
  };

  const handleUpdate = async (id) => {
    if (!editForm.nome.trim()) { toast.error('Il nome è obbligatorio.'); return; }
    setSaving(true);
    try {
      await categoriesApi.update(id, editForm);
      toast.success('Categoria aggiornata!');
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Errore durante l\'aggiornamento.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, nome) => {
    if (!window.confirm(`Eliminare la categoria "${nome}"? I prodotti collegati perderanno la categoria.`)) return;
    try {
      await categoriesApi.delete(id);
      toast.success('Categoria eliminata.');
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast.error('Errore durante l\'eliminazione.');
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Categorie</h1>
          <p className="text-gray-500 text-sm mt-1">{categories.length} categorie</p>
        </div>
        <button
          onClick={() => setShowNew((v) => !v)}
          className="btn-primary text-sm"
        >
          <Plus className="w-4 h-4" /> Nuova categoria
        </button>
      </div>

      {/* Form nuova categoria */}
      {showNew && (
        <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
          <h2 className="font-medium text-gray-700 mb-4">Nuova categoria</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              type="text" placeholder="Nome categoria *" required
              value={newForm.nome}
              onChange={(e) => setNewForm((f) => ({ ...f, nome: e.target.value }))}
              className="input-field"
            />
            <input
              type="text" placeholder="Descrizione (opzionale)"
              value={newForm.descrizione}
              onChange={(e) => setNewForm((f) => ({ ...f, descrizione: e.target.value }))}
              className="input-field"
            />
            <div className="flex gap-2 pt-1">
              <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-60">
                {saving ? 'Salvataggio…' : 'Crea categoria'}
              </button>
              <button type="button" onClick={() => setShowNew(false)} className="btn-outline text-sm">
                Annulla
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista categorie */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-400">Caricamento…</div>
        ) : categories.length === 0 ? (
          <div className="p-10 text-center text-gray-400">Nessuna categoria. Aggiungine una!</div>
        ) : (
          <ul className="divide-y divide-natural-100">
            {categories.map((cat) => (
              <li key={cat.id} className="px-5 py-4">
                {editingId === cat.id ? (
                  // Riga di modifica inline
                  <div className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text" placeholder="Nome *"
                        value={editForm.nome}
                        onChange={(e) => setEditForm((f) => ({ ...f, nome: e.target.value }))}
                        className="input-field text-sm"
                      />
                      <input
                        type="text" placeholder="Descrizione"
                        value={editForm.descrizione}
                        onChange={(e) => setEditForm((f) => ({ ...f, descrizione: e.target.value }))}
                        className="input-field text-sm"
                      />
                    </div>
                    <div className="flex gap-1 mt-0.5">
                      <button
                        onClick={() => handleUpdate(cat.id)}
                        disabled={saving}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Salva"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                        title="Annulla"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  // Riga visualizzazione
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm">{cat.nome}</p>
                      {cat.descrizione && (
                        <p className="text-xs text-gray-500 mt-0.5">{cat.descrizione}</p>
                      )}
                      <p className="text-xs text-natural-400 mt-0.5">{cat.prodotti_count} prodotti</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(cat)}
                        className="p-2 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors"
                        title="Modifica"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.nome)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Elimina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
