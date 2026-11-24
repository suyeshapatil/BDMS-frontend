import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Contact() {
  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold text-danger mb-4">Contact Us</h2>
      <p className="text-muted mb-4">
        Have questions about BDMS? Reach out using any of the channels below.
      </p>
      <ul className="list-unstyled fs-5">
        <li className="mb-3 d-flex align-items-center gap-2"><FiMail className="text-danger" /> support@bdms.local</li>
        <li className="mb-3 d-flex align-items-center gap-2"><FiPhone className="text-danger" /> +91 98765 43210</li>
        <li className="mb-3 d-flex align-items-center gap-2"><FiMapPin className="text-danger" /> CDAC Campus, Pune, India</li>
      </ul>
    </div>
  );
}
