import { Link, NavLink, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Flower2 } from 'lucide-react';

const NAV_LINKS = [
  { to: '/',          label: 'Home' },
  { to: '/catalogo',  label: 'Catalogo' },
  { to: '/chi-siamo', label: 'Chi Siamo' },
  { to: '/contatti',  label: 'Contatti' },
];

export default function Header() {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const { pathname } = useLocation();

  // Chiudi menu su cambio route
  useEffect(() => setMenuOpen(false), [pathname]);

  // Header trasparente → opaco allo scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300
        ${scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-soft'
          : 'bg-white/80 backdrop-blur-sm'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Flower2 className="w-7 h-7 text-brand-500 transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-serif text-xl font-semibold text-brand-700 leading-tight">
              Fiori di Sandro
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-150 relative
                  after:absolute after:bottom-[-4px] after:left-0 after:h-0.5 after:bg-brand-500
                  after:transition-all after:duration-300
                  ${isActive
                    ? 'text-brand-600 after:w-full'
                    : 'text-gray-600 hover:text-brand-600 after:w-0 hover:after:w-full'}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/catalogo" className="btn-primary text-sm px-5 py-2.5">
              Ordina ora
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-cream-200 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
          ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <nav className="px-4 pb-4 space-y-1 bg-white border-t border-natural-100">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-cream-200 hover:text-brand-600'}`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="pt-2">
            <Link to="/catalogo" className="btn-primary w-full text-sm justify-center">
              Ordina ora
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
