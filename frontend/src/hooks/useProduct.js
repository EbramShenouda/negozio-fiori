import { useState, useEffect } from 'react';
import { productsApi } from '../lib/api';

/**
 * Hook per il caricamento di un singolo prodotto per slug.
 */
export function useProduct(slug) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    productsApi
      .getBySlug(slug)
      .then(({ data }) => setProduct(data.data))
      .catch((err) => setError(err.response?.data?.message || 'Prodotto non trovato.'))
      .finally(() => setLoading(false));
  }, [slug]);

  return { product, loading, error };
}
