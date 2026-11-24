import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiHome,
  FiMapPin,
  FiRefreshCw,
  FiRotateCcw,
  FiTrash2,
  FiXCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

import hospitalApi from "../../api/hospitalApi";

import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import Breadcrumb from "../../components/layout/Breadcrumb";
import StatCard from "../../components/dashboard/StatCard";

import usePagination from "../../hooks/usePagination";

import { formatDate } from "../../utils/formatters";

export default function ManageHospitals() {
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");

  const [cityFilter, setCityFilter] = useState("");

  const [verifiedFilter, setVerifiedFilter] = useState("");

  const loadHospitals = async () => {
    try {
      setLoading(true);

      const res = await hospitalApi.getAll();

      setHospitals(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load hospitals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHospitals();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget);

    try {
      await hospitalApi.remove(deleteTarget);

      toast.success("Hospital deleted successfully.");

      await loadHospitals();
    } catch (err) {
      toast.error(err.message || "Unable to delete hospital.");
    } finally {
      setBusyId(null);

      setDeleteTarget(null);
    }
  };

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const keyword =
        `${hospital.hospitalName} ${hospital.email} ${hospital.city}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const cityMatch =
        !cityFilter ||
        hospital.city?.toLowerCase().includes(cityFilter.toLowerCase());

      const verifiedMatch =
        !verifiedFilter || String(hospital.verified) === verifiedFilter;

      return keyword && cityMatch && verifiedMatch;
    });
  }, [hospitals, search, cityFilter, verifiedFilter]);

  const { pageItems, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredHospitals);

  const verifiedCount = hospitals.filter(
    (hospital) => hospital.verified,
  ).length;

  const pendingCount = hospitals.length - verifiedCount;

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Manage Hospitals" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Hospitals</h3>

          <p className="text-muted mb-0">
            View and manage all registered hospitals.
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
          title="Verified"
          value={verifiedCount}
          icon={FiCheckCircle}
          color="success"
        />

        <StatCard
          title="Pending"
          value={pendingCount}
          icon={FiXCircle}
          color="warning"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search hospital..."
              />
            </div>

            <div className="col-lg-3">
              <input
                className="form-control"
                placeholder="Filter by city"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value)}
              >
                <option value="">All</option>

                <option value="true">Verified</option>

                <option value="false">Pending</option>
              </select>
            </div>

            <div className="col-lg-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setCityFilter("");
                  setVerifiedFilter("");
                }}
              >
                <FiRotateCcw className="me-2" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          {filteredHospitals.length === 0 ? (
            <EmptyState
              icon={FiHome}
              message="No hospitals found matching your filters."
            />
          ) : (
            <>
              <DataTable
                keyField="hospitalId"
                rows={pageItems}
                emptyMessage="No hospitals found."
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
                    key: "contactNo",
                    header: "Contact",
                  },
                  {
                    key: "city",
                    header: "City",
                    render: (hospital) => (
                      <span>
                        <FiMapPin className="me-1 text-danger" />
                        {hospital.city}
                      </span>
                    ),
                  },
                  {
                    key: "verified",
                    header: "Verification",
                    render: (hospital) => (
                      <StatusBadge status={hospital.verified} />
                    ),
                  },
                  {
                    key: "createdAt",
                    header: "Registered",
                    render: (hospital) =>
                      hospital.createdAt ? formatDate(hospital.createdAt) : "-",
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (hospital) => (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyId === hospital.hospitalId}
                        title="Delete Hospital"
                        onClick={() => setDeleteTarget(hospital.hospitalId)}
                      >
                        <FiTrash2 />
                      </button>
                    ),
                  },
                ]}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Hospital"
        message="Are you sure you want to permanently delete this hospital? This action cannot be undone."
        confirmLabel="Delete"
        loading={busyId === deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
