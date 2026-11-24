import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export default function Forbidden() {
  return (
    <div className="container py-5 text-center">
      <FiLock size={64} className="text-danger mb-3" />
      <h1 className="display-4 fw-bold">403</h1>
      <p className="lead text-muted">You don't have permission to access this page.</p>
      <Link to={ROUTES.HOME} className="btn btn-danger mt-3">Go Home</Link>
    </div>
  );
}
