import ProductCard from './ProductCard';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ProductGrid({ products, loading, error, emptyMessage, whatsappNumber }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg mb-2">Ops, qualcosa è andato storto.</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg">{emptyMessage || 'Nessun prodotto trovato.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} whatsappNumber={whatsappNumber} />
      ))}
    </div>
  );
}
