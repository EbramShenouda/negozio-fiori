import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../lib/api';

// Re-export useProduct so ProdottoDettaglio can import from either file
export { useProduct } from './useProduct';

/**
 * Hook per il caricamento dei prodotti pubblici.
 */
export function useProducts(params = {}) {
  const [products,  setProducts]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await productsApi.getAll(params);
      setProducts(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Errore nel caricamento prodotti.');
    } finally {
      setLoading(false);
    }
  // Stringify params to avoid infinite loop with object reference
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

/**
 * Hook per i prodotti in evidenza (homepage).
 */
export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    productsApi
      .getFeatured()
      .then(({ data }) => setProducts(data.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}
