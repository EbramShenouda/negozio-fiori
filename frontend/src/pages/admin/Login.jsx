import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flower2, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form,       setForm]       = useState({ username: '', password: '' });
  const [showPass,   setShowPass]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, isAuthenticated }  = useAuth();
  const navigate = useNavigate();

  // Redirect se già autenticato
  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error('Inserisci username e password.');
      return;
    }
    setSubmitting(true);
    try {
      const result = await login(form.username, form.password);
      if (result.success) {
        toast.success(`Benvenuto, ${result.admin.username}!`);
        navigate('/admin/dashboard', { replace: true });
      } else {
        toast.error(result.message || 'Credenziali non valide.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Errore di connessione. Riprova.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1487530811015-780c92f4b4a7?w=1200&q=60')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-brand-900/70" />

      <div className="relative z-10 w-full max-w-sm">
        {/* Card login */}
        <div className="bg-white rounded-3xl shadow-soft-lg p-8">
          {/* Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center mb-3">
              <Flower2 className="w-7 h-7 text-brand-500" />
            </div>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Fiori di Sandro</h1>
            <p className="text-sm text-gray-500 mt-1">Accedi all'area amministrativa</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                className="input-field"
                placeholder="admin"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              {submitting ? 'Accesso in corso…' : 'Accedi'}
            </button>
          </form>
        </div>

        <p className="text-center text-brand-200 text-xs mt-4">
          Accesso riservato agli amministratori
        </p>
      </div>
    </div>
  );
}
