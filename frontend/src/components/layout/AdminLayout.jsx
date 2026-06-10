import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Flower2, LayoutDashboard, Package, Tags, LogOut, Menu, X, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NAV = [
  { to: '/admin/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/prodotti',   icon: Package,         label: 'Prodotti' },
  { to: '/admin/categorie',  icon: Tags,            label: 'Categorie' },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logout effettuato.');
    navigate('/admin/login', { replace: true });
  };

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`flex flex-col h-full bg-brand-800 text-brand-100
        ${mobile ? 'w-64' : 'w-64 hidden lg:flex'}`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-brand-700">
        <Flower2 className="w-6 h-6 text-petal-400" />
        <div>
          <p className="font-serif text-white font-semibold text-sm leading-none">Fiori di Sandro</p>
          <p className="text-brand-300 text-xs mt-0.5">Area Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? 'bg-brand-700 text-white'
                : 'text-brand-200 hover:bg-brand-700/60 hover:text-white'}`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
            <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" />
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="px-4 py-4 border-t border-brand-700">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase">
              {admin?.username?.[0] || 'A'}
            </span>
          </div>
          <span className="text-sm text-brand-200 truncate">{admin?.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-brand-300
                     hover:text-white hover:bg-brand-700/60 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-cream-100">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-50">
            <Sidebar mobile />
          </div>
        </div>
      )}

      {/* Contenuto principale */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar mobile */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-natural-100">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-cream-200"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <Flower2 className="w-5 h-5 text-brand-500" />
            <span className="font-serif text-brand-700 font-semibold">Admin</span>
          </div>
          <button
            className="ml-auto p-2 rounded-lg text-gray-500 hover:bg-cream-200"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
