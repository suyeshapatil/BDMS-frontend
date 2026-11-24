import { useEffect, useMemo, useState } from "react";
import {
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { toast } from "react-toastify";

import hospitalApi from "../../api/hospitalApi";
import hospitalApprovalApi from "../../api/hospitalApprovalApi";

import Breadcrumb from "../../components/layout/Breadcrumb";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import DataTable from "../../components/tables/DataTable";
import StatCard from "../../components/dashboard/StatCard";

export default function ApproveHospitals() {
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);

  const [search, setSearch] = useState("");

  const loadHospitals = async () => {
    try {
      setLoading(true);

      const res = await hospitalApi.getAll();

      setHospitals(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Unable to load hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const decide = async (hospitalId, approvalStatus) => {
    setBusyId(hospitalId);

    try {
      await hospitalApprovalApi.process({
        hospitalId,
        approvalStatus,
      });

      toast.success(
        approvalStatus === "APPROVED"
          ? "Hospital approved successfully."
          : "Hospital rejected successfully.",
      );

      await loadHospitals();
    } catch (err) {
      toast.error(err.message || "Unable to process approval.");
    } finally {
      setBusyId(null);
    }
  };

  const pendingHospitals = useMemo(() => {
    return hospitals
      .filter((hospital) => !hospital.verified)
      .filter((hospital) =>
        `${hospital.hospitalName}
         ${hospital.email}
         ${hospital.city}
         ${hospital.registrationNo}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
  }, [hospitals, search]);

  const verifiedHospitals = useMemo(() => {
    return hospitals
      .filter((hospital) => hospital.verified)
      .filter((hospital) =>
        `${hospital.hospitalName}
         ${hospital.email}
         ${hospital.city}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      );
  }, [hospitals, search]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Breadcrumb
        items={[
          {
            label: "Dashboard",
          },
          {
            label: "Hospital Approvals",
          },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Hospital Approvals</h3>

          <p className="text-muted mb-0">
            Verify hospitals before they can create blood requests.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadHospitals}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Hospitals"
          value={hospitals.length}
          icon={FiHome}
          color="primary"
        />

        <StatCard
          title="Pending Approval"
          value={pendingHospitals.length}
          icon={FiClock}
          color="warning"
        />

        <StatCard
          title="Verified"
          value={verifiedHospitals.length}
          icon={FiCheckCircle}
          color="success"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="input-group">
            <span className="input-group-text">
              <FiSearch />
            </span>

            <input
              className="form-control"
              placeholder="Search hospital..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Pending Hospital Approvals</h5>
        </div>

        <div className="card-body">
          {pendingHospitals.length === 0 ? (
            <EmptyState
              icon={FiClock}
              message="No hospitals are awaiting approval."
            />
          ) : (
            <DataTable
              keyField="hospitalId"
              rows={pendingHospitals}
              emptyMessage="No pending hospitals."
              columns={[
                {
                  key: "hospitalName",
                  header: "Hospital",
                },
                {
                  key: "email",
                  header: "Email",
                },
                {
                  key: "registrationNo",
                  header: "Registration No.",
                },
                {
                  key: "city",
                  header: "City",
                },
                {
                  key: "actions",
                  header: "Decision",
                  render: (hospital) => (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        disabled={busyId === hospital.hospitalId}
                        onClick={() => decide(hospital.hospitalId, "APPROVED")}
                      >
                        <FiCheck className="me-1" />
                        Approve
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyId === hospital.hospitalId}
                        onClick={() => decide(hospital.hospitalId, "REJECTED")}
                      >
                        <FiX className="me-1" />
                        Reject
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white">
          <h5 className="mb-0">Verified Hospitals</h5>
        </div>

        <div className="card-body">
          {verifiedHospitals.length === 0 ? (
            <EmptyState
              icon={FiCheckCircle}
              message="No verified hospitals yet."
            />
          ) : (
            <DataTable
              keyField="hospitalId"
              rows={verifiedHospitals}
              emptyMessage="No verified hospitals."
              columns={[
                {
                  key: "hospitalName",
                  header: "Hospital",
                },
                {
                  key: "email",
                  header: "Email",
                },
                {
                  key: "registrationNo",
                  header: "Registration No.",
                },
                {
                  key: "city",
                  header: "City",
                },
                {
                  key: "verified",
                  header: "Status",
                  render: (hospital) => (
                    <StatusBadge status={hospital.verified} />
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
