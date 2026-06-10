import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import SiteLayout from './components/layout/SiteLayout';
import AdminLayout from './components/layout/AdminLayout';

// Pagine pubbliche
import Home              from './pages/Home';
import Catalogo          from './pages/Catalogo';
import ProdottoDettaglio from './pages/ProdottoDettaglio';
import ChiSiamo          from './pages/ChiSiamo';
import Contatti          from './pages/Contatti';
import NotFound          from './pages/NotFound';

// Pagine admin
import Login         from './pages/admin/Login';
import Dashboard     from './pages/admin/Dashboard';
import ProdottiAdmin from './pages/admin/ProdottiAdmin';
import ProdottoForm  from './pages/admin/ProdottoForm';
import CategorieAdmin from './pages/admin/CategorieAdmin';

/** Protegge le rotte admin: redirect al login se non autenticato */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null; // aspetta verifica token
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Sito pubblico ──────────────────────────────── */}
        <Route element={<SiteLayout />}>
          <Route index             element={<Home />} />
          <Route path="catalogo"   element={<Catalogo />} />
          <Route path="prodotto/:slug" element={<ProdottoDettaglio />} />
          <Route path="chi-siamo"  element={<ChiSiamo />} />
          <Route path="contatti"   element={<Contatti />} />
        </Route>

        {/* ── Area admin ─────────────────────────────────── */}
        <Route path="admin/login" element={<Login />} />

        <Route
          path="admin"
          element={<PrivateRoute><AdminLayout /></PrivateRoute>}
        >
          <Route index                      element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard"           element={<Dashboard />} />
          <Route path="prodotti"            element={<ProdottiAdmin />} />
          <Route path="prodotti/nuovo"      element={<ProdottoForm />} />
          <Route path="prodotti/:id/modifica" element={<ProdottoForm />} />
          <Route path="categorie"           element={<CategorieAdmin />} />
        </Route>

        {/* ── 404 ────────────────────────────────────────── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
