import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]       = useState(null);
  const [loading, setLoading]   = useState(true);

  // Verifica il token salvato all'avvio
useEffect(() => {
  const init = async () => {
    const token = localStorage.getItem('admin_token');

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await authApi.me();

      if (data.success) {
        setAdmin(data.admin);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      } else {
        throw new Error();
      }
    } catch {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  };

  init();
}, []);

  const login = useCallback(async (username, password) => {
    const { data } = await authApi.login({ username, password });
    if (data.success) {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
      setAdmin(data.admin);
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi.logout(); } catch { /* ignora errori di rete */ }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  }, []);

  const isAuthenticated = Boolean(admin);

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve essere usato dentro AuthProvider');
  return ctx;
}
