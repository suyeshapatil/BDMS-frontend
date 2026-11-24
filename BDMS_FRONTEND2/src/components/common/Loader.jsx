export default function Loader({ fullScreen = false, label = 'Loading...' }) {
  const wrapperClass = fullScreen
    ? 'd-flex flex-column align-items-center justify-content-center vh-100'
    : 'd-flex flex-column align-items-center justify-content-center py-5';

  return (
    <div className={wrapperClass}>
      <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">{label}</span>
      </div>
      <p className="mt-3 text-muted">{label}</p>
    </div>
  );
}
