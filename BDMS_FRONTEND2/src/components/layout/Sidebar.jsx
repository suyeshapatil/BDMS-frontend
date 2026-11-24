import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiUser,
  FiClock,
  FiBell,
  FiDroplet,
  FiSearch,
  FiPlusCircle,
  FiUsers,
  FiCheckSquare,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import { ROLES } from "../../constants/roles";
import { ROUTES } from "../../constants/routes";

const LINKS = {
  [ROLES.DONOR]: [
    { to: ROUTES.DONOR_DASHBOARD, label: "Dashboard", icon: FiGrid },
    { to: ROUTES.DONOR_PROFILE, label: "My Profile", icon: FiUser },
    { to: ROUTES.DONOR_REQUESTS, label: "Blood Requests", icon: FiDroplet },
    { to: ROUTES.DONOR_HISTORY, label: "Donation History", icon: FiClock },
    { to: ROUTES.DONOR_NOTIFICATIONS, label: "Notifications", icon: FiBell },
  ],
  [ROLES.HOSPITAL]: [
    { to: ROUTES.HOSPITAL_DASHBOARD, label: "Dashboard", icon: FiGrid },
    { to: ROUTES.HOSPITAL_PROFILE, label: "Hospital Profile", icon: FiUser },
    {
      to: ROUTES.HOSPITAL_CREATE_REQUEST,
      label: "Create Request",
      icon: FiPlusCircle,
    },
    { to: ROUTES.HOSPITAL_REQUESTS, label: "Manage Requests", icon: FiDroplet },
    {
      to: ROUTES.HOSPITAL_DONATION_HISTORY,
      label: "Donation History",
      icon: FiClock,
    },
    {
      to: ROUTES.HOSPITAL_SEARCH_DONORS,
      label: "Search Donors",
      icon: FiSearch,
    },
    { to: ROUTES.HOSPITAL_NOTIFICATIONS, label: "Notifications", icon: FiBell },
  ],
  [ROLES.ADMIN]: [
    { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard", icon: FiGrid },
    { to: ROUTES.ADMIN_USERS, label: "Manage Users", icon: FiUsers },
    { to: ROUTES.ADMIN_DONORS, label: "Manage Donors", icon: FiDroplet },
    { to: ROUTES.ADMIN_HOSPITALS, label: "Manage Hospitals", icon: FiUser },
    {
      to: ROUTES.ADMIN_APPROVALS,
      label: "Hospital Approvals",
      icon: FiCheckSquare,
    },
    { to: ROUTES.ADMIN_REQUESTS, label: "Blood Requests", icon: FiDroplet },
    {
      to: ROUTES.ADMIN_DONATION_HISTORY,
      label: "Donation History",
      icon: FiClock,
    },
    { to: ROUTES.ADMIN_REPORTS, label: "Reports", icon: FiFileText },
    { to: ROUTES.ADMIN_NOTIFICATIONS, label: "Notifications", icon: FiBell },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  const links = LINKS[user?.role] || [];

  return (
    <>
      <aside
        className={`bdms-sidebar bg-white border-end ${isOpen ? "bdms-sidebar-open" : ""}`}
      >
        <div className="p-3 border-bottom d-lg-none d-flex justify-content-between align-items-center">
          <span className="fw-semibold text-danger d-flex align-items-center gap-2">
            <FiBarChart2 /> Menu
          </span>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Close menu"
          />
        </div>
        <div className="p-3 border-bottom">
          <h5 className="text-danger fw-bold">BDMS</h5>

          <small className="text-muted">{user?.fullName}</small>
        </div>
        <nav className="nav flex-column p-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 rounded mb-1 ${isActive ? "active bg-danger text-white" : "text-dark"}`
              }
            >
              <Icon /> {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {isOpen && (
        <div className="bdms-sidebar-backdrop d-lg-none" onClick={onClose} />
      )}
    </>
  );
}
