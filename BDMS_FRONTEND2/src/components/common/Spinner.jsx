export default function Spinner({ size = 'sm', className = '' }) {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : '';
  return (
    <span className={`spinner-border ${sizeClass} ${className}`} role="status" aria-hidden="true" />
  );
}
