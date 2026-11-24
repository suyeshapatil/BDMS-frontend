import { Link, useNavigate } from "react-router-dom";
import { FiDroplet, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { ROUTES } from "../../constants/routes";

export default function Navbar({ onToggleSidebar, showSidebarToggle = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm sticky-top">
      <div className="container-fluid">
        {showSidebarToggle && (
          <button
            className="btn btn-outline-light me-2 d-lg-none"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <FiMenu />
          </button>
        )}
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold"
          to={ROUTES.HOME}
        >
          <FiDroplet size={22} /> BDMS
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.HOME}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.ABOUT}>
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={ROUTES.CONTACT}>
                Contact
              </Link>
            </li>
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={ROUTES.LOGIN}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="btn btn-light btn-sm text-danger fw-semibold ms-lg-2"
                    to={ROUTES.REGISTER}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
            {isAuthenticated && (
              <li className="nav-item dropdown">
                <button
                  className="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-1"
                  data-bs-toggle="dropdown"
                >
                  <FiUser /> {user.fullName?.split(" ")[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 className="dropdown-header">
                      {user.email} &middot; {user.role}
                    </h6>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      onClick={handleLogout}
                    >
                      <FiLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
