import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiBell,
  FiCheckCircle,
  FiDroplet,
  FiRefreshCw,
  FiUsers,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

import hospitalApi from "../../api/hospitalApi";
import donorApi from "../../api/donorApi";
import bloodRequestApi from "../../api/bloodRequestApi";
import donationHistoryApi from "../../api/donationHistoryApi";
import notificationApi from "../../api/notificationApi";

import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import Breadcrumb from "../../components/layout/Breadcrumb";

import { ROUTES } from "../../constants/routes";

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState(null);
  const [requests, setRequests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [availableDonors, setAvailableDonors] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const hospitalRes = await hospitalApi.getMe();
      const hospitalData = hospitalRes.data.data;

      const [requestsRes, donationsRes, donorsRes, notificationsRes] =
        await Promise.all([
          bloodRequestApi.getByHospital(hospitalData.hospitalId),
          donationHistoryApi.getByHospital(hospitalData.hospitalId),
          donorApi.getAll({ city: hospitalData.city }),
          notificationApi.getMineUnread(),
        ]);

      setHospital(hospitalData);
      setRequests(requestsRes.data.data);
      setDonations(donationsRes.data.data);

      setAvailableDonors(
        donorsRes.data.data.filter((d) => d.availability).length,
      );

      setNotifications(notificationsRes.data.data);
    } catch (err) {
      toast.error(err?.message ?? "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return <Loader />;
  }

  const openRequests = requests.filter(
    (r) => r.requestStatus === "OPEN" || r.requestStatus === "PENDING",
  );

  return (
    <div className="container-fluid">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">{hospital?.hospitalName}</h2>

          <p className="text-muted mb-0">Hospital Dashboard</p>
        </div>

        <button
          className="btn btn-outline-danger d-flex align-items-center gap-2"
          onClick={loadDashboard}
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      {!hospital?.verified && (
        <div className="alert alert-warning mb-4">
          <strong>Pending Verification</strong>
          <br />
          Your hospital account is awaiting administrator approval. You cannot
          create blood requests until approval.
        </div>
      )}

      <div className="row g-3">
        <StatCard
          title="Open Requests"
          value={openRequests.length}
          icon={FiDroplet}
          color="danger"
        />

        <StatCard
          title="Nearby Donors"
          value={availableDonors}
          icon={FiUsers}
          color="success"
        />

        <StatCard
          title="Completed Donations"
          // value={donations.length}
          value={
            requests.filter(r => r.requestStatus === "COMPLETED").length
          }
          icon={FiCheckCircle}
          color="primary"
        />

        <StatCard
          title="Unread Notifications"
          value={notifications.length}
          icon={FiBell}
          color="info"
        />
      </div>

      <div className="row mt-4">
        <div className="col-lg-7 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Blood Requests</h5>

              <Link
                to={ROUTES.HOSPITAL_REQUESTS}
                className="small text-decoration-none"
              >
                Manage All
              </Link>
            </div>

            <div className="card-body">
              {requests.length === 0 ? (
                <EmptyState
                  icon={FiDroplet}
                  message="No blood requests created yet."
                />
              ) : (
                <ul className="list-group list-group-flush">
                  {requests.slice(0, 5).map((request) => (
                    <li
                      key={request.requestId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">{request.patientName}</div>

                        <small className="text-muted">
                          {request.bloodGroup} • {request.unitsRequired} Unit(s)
                        </small>
                      </div>

                      <StatusBadge status={request.requestStatus} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notifications</h5>

              <Link
                to={ROUTES.HOSPITAL_NOTIFICATIONS}
                className="small text-decoration-none"
              >
                View All
              </Link>
            </div>

            <div className="card-body">
              {notifications.length === 0 ? (
                <EmptyState icon={FiBell} message="You're all caught up." />
              ) : (
                <ul className="list-group list-group-flush">
                  {notifications.slice(0, 5).map((notification) => (
                    <li
                      key={notification.notificationId}
                      className="list-group-item"
                    >
                      <div className="fw-semibold">{notification.title}</div>

                      <small className="text-muted">
                        {notification.message}
                      </small>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted">Verification Status</h6>

                <h5 className="mb-0">
                  {hospital?.verified ? "Verified" : "Pending"}
                </h5>
              </div>

              {hospital?.verified ? (
                <FiCheckCircle size={34} className="text-success" />
              ) : (
                <FiXCircle size={34} className="text-warning" />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted mb-2">Donation Records</h6>

              {/* <h3 className="mb-0">{donations.length}</h3> */}
              <h3 className="mb-0">
                {requests.filter(
                    request => request.requestStatus === "COMPLETED"
                ).length}
              </h3>

              <small className="text-muted">Total donations recorded</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
