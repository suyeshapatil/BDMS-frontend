import { FiDroplet } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
        <span className="d-flex align-items-center gap-2 fw-semibold">
          <FiDroplet /> Blood Donation Management System
        </span>
        <small className="text-secondary">&copy; {new Date().getFullYear()} BDMS &middot; Blood Donation Management System
         Connecting Donors. Saving Lives.</small>
      </div>
    </footer>
  );
}
