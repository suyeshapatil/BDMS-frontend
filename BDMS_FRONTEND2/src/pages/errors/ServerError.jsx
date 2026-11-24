import { Link } from 'react-router-dom';
import { FiServer } from 'react-icons/fi';
import { ROUTES } from '../../constants/routes';

export default function ServerError() {
  return (
    <div className="container py-5 text-center">
      <FiServer size={64} className="text-secondary mb-3" />
      <h1 className="display-4 fw-bold">500</h1>
      <p className="lead text-muted">Something went wrong on our end. Please try again later.</p>
      <Link to={ROUTES.HOME} className="btn btn-danger mt-3">Go Home</Link>
    </div>
  );
}
