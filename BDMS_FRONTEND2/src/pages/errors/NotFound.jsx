import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export default function NotFound() {
  return (
    <div className="container py-5 text-center">
      <FiAlertTriangle size={64} className="text-warning mb-3" />
      <h1 className="display-4 fw-bold">404</h1>
      <p className="lead text-muted">The page you're looking for doesn't exist.</p>
      <Link to={ROUTES.HOME} className="btn btn-danger mt-3">Go Home</Link>
    </div>
  );
}
