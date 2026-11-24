import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity,
  FiBell,
  FiClock,
  FiDroplet,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

import donorApi from "../../api/donorApi";
import bloodRequestApi from "../../api/bloodRequestApi";
import notificationApi from "../../api/notificationApi";

import StatCard from "../../components/dashboard/StatCard";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import Breadcrumb from "../../components/layout/Breadcrumb";

import { ROUTES } from "../../constants/routes";

export default function DonorDashboard() {
  const [donor, setDonor] = useState(null);
  const [matchingRequests, setMatchingRequests] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const [donorRes, requestsRes, notificationsRes] = await Promise.all([
        donorApi.getMe(),
        bloodRequestApi.getMatchingMe(),
        notificationApi.getMineUnread(),
      ]);

      setDonor(donorRes.data.data);
      setMatchingRequests(requestsRes.data.data);
      setUnreadNotifications(notificationsRes.data.data);
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

  return (
    <div className="container-fluid">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            Welcome back, {donor?.fullName?.split(" ")[0]} 👋
          </h2>

          <p className="text-muted mb-0">Thank you for helping save lives.</p>
        </div>

        <button
          className="btn btn-outline-danger d-flex align-items-center gap-2"
          onClick={loadDashboard}
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      <div className="row g-3">
        <StatCard
          title="Blood Group"
          value={donor?.bloodGroup ?? "-"}
          icon={FiDroplet}
          color="danger"
        />

        <StatCard
          title="Total Donations"
          value={donor?.totalDonations ?? 0}
          icon={FiActivity}
          color="success"
        />

        <StatCard
          title="Matching Requests"
          value={matchingRequests.length}
          icon={FiDroplet}
          color="warning"
        />

        <StatCard
          title="Unread Notifications"
          value={unreadNotifications.length}
          icon={FiBell}
          color="info"
        />
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Matching Blood Requests</h5>

              <Link
                to={ROUTES.DONOR_REQUESTS}
                className="small text-decoration-none"
              >
                View All
              </Link>
            </div>

            <div className="card-body">
              {matchingRequests.length === 0 ? (
                <EmptyState
                  icon={FiDroplet}
                  message="No matching blood requests available."
                />
              ) : (
                <ul className="list-group list-group-flush">
                  {matchingRequests.slice(0, 5).map((request) => (
                    <li
                      key={request.requestId}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <div className="fw-semibold">
                          {request.hospitalName}
                        </div>

                        <small className="text-muted">
                          {request.city} • {request.unitsRequired} Unit(s)
                        </small>
                      </div>

                      <StatusBadge status={request.urgencyLevel} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notifications</h5>

              <Link
                to={ROUTES.DONOR_NOTIFICATIONS}
                className="small text-decoration-none"
              >
                View All
              </Link>
            </div>

            <div className="card-body">
              {unreadNotifications.length === 0 ? (
                <EmptyState icon={FiBell} message="You're all caught up." />
              ) : (
                <ul className="list-group list-group-flush">
                  {unreadNotifications.slice(0, 5).map((notification) => (
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
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted">Availability Status</h6>

                <h5 className="mb-0">
                  {donor?.availability ? "Available" : "Unavailable"}
                </h5>
              </div>

              {donor?.availability ? (
                <FiCheckCircle size={34} className="text-success" />
              ) : (
                <FiXCircle size={34} className="text-danger" />
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm border-0">
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h6 className="text-muted">Last Donation</h6>

                <h5 className="mb-0">
                  {donor?.lastDonationDate
                    ? new Date(donor.lastDonationDate).toLocaleDateString()
                    : "No donations yet"}
                </h5>
              </div>

              <FiClock size={34} className="text-danger" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
