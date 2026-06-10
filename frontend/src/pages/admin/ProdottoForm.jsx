import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Image } from 'lucide-react';
import { productsApi, categoriesApi } from '../../lib/api';
import toast from 'react-hot-toast';

const INITIAL = { nome: '', descrizione: '', prezzo: '', categoria_id: '', disponibile: true };

export default function ProdottoForm() {
  const { id }     = useParams();           // presente solo in modifica
  const isEdit     = Boolean(id);
  const navigate   = useNavigate();

  const [form,        setForm]        = useState(INITIAL);
  const [categories,  setCategories]  = useState([]);
  const [imageFile,   setImageFile]   = useState(null);
  const [imagePreview,setImagePreview]= useState(null);
  const [currentImage,setCurrentImage]= useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [loading,     setLoading]     = useState(isEdit);

  // Carica categorie
  useEffect(() => {
    categoriesApi.getAll()
      .then(({ data }) => setCategories(data.data || []))
      .catch(() => {});
  }, []);

  // In modifica: carica il prodotto esistente
  useEffect(() => {
    if (!isEdit) return;
    productsApi.adminGetAll()
      .then(({ data }) => {
        const found = (data.data || []).find((p) => p.id === id);
        if (!found) { toast.error('Prodotto non trovato.'); navigate('/admin/prodotti'); return; }
        setForm({
          nome:         found.nome,
          descrizione:  found.descrizione || '',
          prezzo:       String(found.prezzo),
          categoria_id: found.categoria_id || '',
          disponibile:  found.disponibile,
        });
        setCurrentImage(found.immagine_url || found.immagine);
      })
      .catch(() => toast.error('Errore nel caricamento.'))
      .finally(() => setLoading(false));
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) { toast.error('Immagine troppo grande (max 5 MB).'); return; }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) { toast.error('Formato non supportato. Usa JPEG, PNG o WebP.'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.prezzo) { toast.error('Nome e prezzo sono obbligatori.'); return; }
    if (isNaN(Number(form.prezzo)) || Number(form.prezzo) < 0) { toast.error('Prezzo non valido.'); return; }

    setSubmitting(true);
    try {
      const payload = {
        nome:         form.nome.trim(),
        descrizione:  form.descrizione.trim(),
        prezzo:       Number(form.prezzo),
        categoria_id: form.categoria_id || null,
        disponibile:  form.disponibile,
      };

      let savedProduct;
      if (isEdit) {
        const { data } = await productsApi.update(id, payload);
        savedProduct = data.data;
      } else {
        const { data } = await productsApi.create(payload);
        savedProduct = data.data;
      }

      // Upload immagine se selezionata
      if (imageFile && savedProduct?.id) {
        const formData = new FormData();
        formData.append('immagine', imageFile);
        await productsApi.uploadImage(savedProduct.id, formData);
      }

      toast.success(isEdit ? 'Prodotto aggiornato!' : 'Prodotto creato!');
      navigate('/admin/prodotti');
    } catch (err) {
      const msg = err.response?.data?.message || 'Errore durante il salvataggio.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Caricamento…</div>;
  }

  const previewSrc = imagePreview || currentImage;

  return (
    <div className="max-w-2xl">
      {/* Intestazione */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/prodotti" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">
            {isEdit ? 'Modifica prodotto' : 'Nuovo prodotto'}
          </h1>
          <p className="text-gray-500 text-sm">{isEdit ? form.nome : 'Compila i campi per aggiungere un prodotto'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card principale */}
        <div className="bg-white rounded-2xl shadow-card p-6 space-y-5">
          <div>
            <label className="label" htmlFor="nome">Nome prodotto *</label>
            <input id="nome" name="nome" type="text" required
              value={form.nome} onChange={handleChange}
              className="input-field" placeholder="es. Bouquet di Rose Rosse" />
          </div>

          <div>
            <label className="label" htmlFor="descrizione">Descrizione</label>
            <textarea id="descrizione" name="descrizione" rows={4}
              value={form.descrizione} onChange={handleChange}
              className="input-field resize-none"
              placeholder="Descrizione del prodotto, materiali, occasione d'uso…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label" htmlFor="prezzo">Prezzo (€) *</label>
              <input id="prezzo" name="prezzo" type="number" step="0.01" min="0" required
                value={form.prezzo} onChange={handleChange}
                className="input-field" placeholder="0.00" />
            </div>
            <div>
              <label className="label" htmlFor="categoria_id">Categoria</label>
              <select id="categoria_id" name="categoria_id"
                value={form.categoria_id} onChange={handleChange}
                className="input-field">
                <option value="">Nessuna categoria</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input id="disponibile" name="disponibile" type="checkbox"
              checked={form.disponibile} onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-400" />
            <label htmlFor="disponibile" className="text-sm text-gray-700 cursor-pointer">
              Prodotto disponibile (visibile nel catalogo)
            </label>
          </div>
        </div>

        {/* Card immagine */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <p className="label mb-3">Immagine prodotto</p>

          {previewSrc ? (
            <div className="relative group">
              <img src={previewSrc} alt="Anteprima" className="w-full h-48 object-cover rounded-xl" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-white/90 hover:bg-white text-red-500 p-1.5 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-natural-200 rounded-xl cursor-pointer hover:border-brand-300 hover:bg-brand-50 transition-colors">
              <Image className="w-8 h-8 text-natural-400 mb-2" />
              <span className="text-sm text-gray-500">Clicca per caricare un'immagine</span>
              <span className="text-xs text-gray-400 mt-1">JPEG, PNG o WebP – max 5 MB</span>
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden" onChange={handleImageChange} />
            </label>
          )}

          {imageFile && (
            <label className="mt-3 flex items-center gap-2 text-sm text-brand-600 cursor-pointer hover:text-brand-700">
              <Upload className="w-4 h-4" /> Cambia immagine
              <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden" onChange={handleImageChange} />
            </label>
          )}
        </div>

        {/* Azioni */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Salvataggio…' : (isEdit ? 'Salva modifiche' : 'Crea prodotto')}
          </button>
          <Link to="/admin/prodotti" className="btn-outline px-6">Annulla</Link>
        </div>
      </form>
    </div>
  );
}
