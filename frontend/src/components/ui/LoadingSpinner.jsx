export default function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeMap = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div
      className={`${sizeMap[size] || sizeMap.md} ${className}
        animate-spin rounded-full
        border-2 border-natural-200 border-t-brand-500`}
      role="status"
      aria-label="Caricamento..."
    />
  );
}
