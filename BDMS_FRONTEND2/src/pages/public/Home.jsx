import { Link } from 'react-router-dom';
import { FiDroplet, FiUsers, FiActivity, FiHeart } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const FEATURES = [
  { icon: FiUsers, title: 'Donor Network', text: 'Register as a donor and get matched to nearby blood requests by blood group and city.' },
  { icon: FiActivity, title: 'Emergency Requests', text: 'Hospitals can raise urgent blood requests and reach eligible donors instantly.' },
  { icon: FiHeart, title: 'Donation Tracking', text: 'Every donation is recorded, so donors can track their history and impact over time.' },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="bg-danger text-white py-5">
        <div className="container py-5 text-center">
          <FiDroplet size={56} className="mb-3" />
          <h1 className="display-5 fw-bold">Every Drop Counts</h1>
          <p className="lead col-lg-8 mx-auto">
            BDMS connects blood donors, hospitals, and administrators on a single platform to
            make emergency blood requests faster and donor coordination effortless.
          </p>
          {!isAuthenticated && (
            <div className="mt-4 d-flex justify-content-center gap-3 flex-wrap">
              <Link to={ROUTES.REGISTER} className="btn btn-light btn-lg text-danger fw-semibold">
                Become a Donor
              </Link>
              <Link to={ROUTES.LOGIN} className="btn btn-outline-light btn-lg">
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div className="col-md-4" key={title}>
              <div className="card h-100 border-0 shadow-sm text-center p-4">
                <Icon size={36} className="text-danger mx-auto mb-3" />
                <h5>{title}</h5>
                <p className="text-muted mb-0">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
