import { useCallback, useEffect, useState } from "react";
import {
  FiUsers,
  FiDroplet,
  FiHome,
  FiCheckSquare,
  FiActivity,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { toast } from "react-toastify";

import dashboardApi from "../../api/dashboardApi";

import StatCard from "../../components/dashboard/StatCard";
import AdminStatsChart from "../../components/charts/AdminStatsChart";
import Loader from "../../components/common/Loader";
import Breadcrumb from "../../components/layout/Breadcrumb";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await dashboardApi.getStats();

      setStats(response.data.data);
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
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>

          <p className="text-muted mb-0">
            Overview of the Blood Donation Management System
          </p>
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
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={FiUsers}
          color="primary"
        />

        <StatCard
          title="Total Donors"
          value={stats?.totalDonors ?? 0}
          icon={FiDroplet}
          color="danger"
        />

        <StatCard
          title="Total Hospitals"
          value={stats?.totalHospitals ?? 0}
          icon={FiHome}
          color="info"
        />

        <StatCard
          title="Verified Hospitals"
          value={stats?.verifiedHospitals ?? 0}
          icon={FiCheckSquare}
          color="success"
        />

        <StatCard
          title="Pending Approvals"
          value={stats?.pendingHospitalApprovals ?? 0}
          icon={FiClock}
          color="warning"
        />

        <StatCard
          title="Total Blood Requests"
          value={stats?.totalBloodRequests ?? 0}
          icon={FiDroplet}
          color="danger"
        />

        <StatCard
          title="Open Requests"
          value={stats?.openBloodRequests ?? 0}
          icon={FiActivity}
          color="warning"
        />

        <StatCard
          title="Completed Donations"
          value={stats?.totalDonationsRecorded ?? 0}
          icon={FiCheckSquare}
          color="success"
        />
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white">
              <h5 className="mb-0">System Statistics</h5>
            </div>

            <div className="card-body">
              <AdminStatsChart stats={stats} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
