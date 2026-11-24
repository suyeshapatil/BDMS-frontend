import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import DonorDashboard from "./pages/donor/DonorDashboard";
import DonorProfile from "./pages/donor/DonorProfile";
import DonorBloodRequests from "./pages/donor/DonorBloodRequests";
import DonorDonationHistory from "./pages/donor/DonorDonationHistory";
import DonorNotifications from "./pages/donor/DonorNotifications";

import HospitalDashboard from "./pages/hospital/HospitalDashboard";
import HospitalProfile from "./pages/hospital/HospitalProfile";
import CreateBloodRequest from "./pages/hospital/CreateBloodRequest";
import HospitalDonationHistory from "./pages/hospital/HospitalDonationHistory";
import ManageBloodRequests from "./pages/hospital/ManageBloodRequests";
import SearchDonors from "./pages/hospital/SearchDonors";
import HospitalNotifications from "./pages/hospital/HospitalNotifications";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDonors from "./pages/admin/ManageDonors";
import ManageHospitals from "./pages/admin/ManageHospitals";
import ApproveHospitals from "./pages/admin/ApproveHospitals";
import AdminBloodRequests from "./pages/admin/AdminBloodRequests";
import AdminDonationHistory from "./pages/admin/AdminDonationHistory";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";

import NotFound from "./pages/errors/NotFound";
import Forbidden from "./pages/errors/Forbidden";
import ServerError from "./pages/errors/ServerError";

import { ROLES } from "./constants/roles";
import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    <>
      <Routes>
        {/* Public site */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          <Route path={ROUTES.FORBIDDEN} element={<Forbidden />} />
          <Route path={ROUTES.SERVER_ERROR} element={<ServerError />} />
        </Route>

        {/* Authenticated area */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* Donor-only */}
            <Route element={<RoleRoute allowedRoles={[ROLES.DONOR]} />}>
              <Route
                path={ROUTES.DONOR_DASHBOARD}
                element={<DonorDashboard />}
              />
              <Route path={ROUTES.DONOR_PROFILE} element={<DonorProfile />} />
              <Route
                path={ROUTES.DONOR_REQUESTS}
                element={<DonorBloodRequests />}
              />
              <Route
                path={ROUTES.DONOR_HISTORY}
                element={<DonorDonationHistory />}
              />
              <Route
                path={ROUTES.DONOR_NOTIFICATIONS}
                element={<DonorNotifications />}
              />
            </Route>

            {/* Hospital-only */}
            <Route element={<RoleRoute allowedRoles={[ROLES.HOSPITAL]} />}>
              <Route
                path={ROUTES.HOSPITAL_DASHBOARD}
                element={<HospitalDashboard />}
              />
              <Route
                path={ROUTES.HOSPITAL_PROFILE}
                element={<HospitalProfile />}
              />
              <Route
                path={ROUTES.HOSPITAL_CREATE_REQUEST}
                element={<CreateBloodRequest />}
              />
              <Route
                path={ROUTES.HOSPITAL_REQUESTS}
                element={<ManageBloodRequests />}
              />
              <Route
                path={ROUTES.HOSPITAL_DONATION_HISTORY}
                element={<HospitalDonationHistory />}
              />
              <Route
                path={ROUTES.HOSPITAL_SEARCH_DONORS}
                element={<SearchDonors />}
              />
              <Route
                path={ROUTES.HOSPITAL_NOTIFICATIONS}
                element={<HospitalNotifications />}
              />
            </Route>

            {/* Admin-only */}
            <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route
                path={ROUTES.ADMIN_DASHBOARD}
                element={<AdminDashboard />}
              />
              <Route path={ROUTES.ADMIN_USERS} element={<ManageUsers />} />
              <Route path={ROUTES.ADMIN_DONORS} element={<ManageDonors />} />
              <Route
                path={ROUTES.ADMIN_HOSPITALS}
                element={<ManageHospitals />}
              />
              <Route
                path={ROUTES.ADMIN_APPROVALS}
                element={<ApproveHospitals />}
              />
              <Route
                path={ROUTES.ADMIN_REQUESTS}
                element={<AdminBloodRequests />}
              />
              <Route
                path={ROUTES.ADMIN_DONATION_HISTORY}
                element={<AdminDonationHistory />}
              />
              <Route path={ROUTES.ADMIN_REPORTS} element={<AdminReports />} />
              <Route
                path={ROUTES.ADMIN_NOTIFICATIONS}
                element={<AdminNotifications />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3500} newestOnTop />
    </>
  );
}
