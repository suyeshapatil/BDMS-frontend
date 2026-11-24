import { useEffect, useMemo, useState } from "react";
import {
  FiDroplet,
  FiMapPin,
  FiRefreshCw,
  FiRotateCcw,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";

import donorApi from "../../api/donorApi";

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

import { BLOOD_GROUPS } from "../../constants/enums";

import { formatDate } from "../../utils/formatters";

export default function ManageDonors() {
  const [donors, setDonors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");

  const [bloodGroup, setBloodGroup] = useState("");

  const [availability, setAvailability] = useState("");

  const loadDonors = async () => {
    try {
      setLoading(true);

      const res = await donorApi.getAll();

      setDonors(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load donors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonors();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget);

    try {
      await donorApi.remove(deleteTarget);

      toast.success("Donor deleted successfully.");

      await loadDonors();
    } catch (err) {
      toast.error(err.message || "Unable to delete donor.");
    } finally {
      setBusyId(null);

      setDeleteTarget(null);
    }
  };

  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      const keyword = `${donor.fullName} ${donor.email} ${donor.city}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const bloodMatch = !bloodGroup || donor.bloodGroup === bloodGroup;

      const availabilityMatch =
        !availability || String(donor.availability) === availability;

      return keyword && bloodMatch && availabilityMatch;
    });
  }, [donors, search, bloodGroup, availability]);

  const { pageItems, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredDonors);

  const availableCount = donors.filter((d) => d.availability).length;

  const totalDonations = donors.reduce(
    (sum, donor) => sum + (donor.totalDonations || 0),
    0,
  );

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
            label: "Manage Donors",
          },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Manage Donors</h3>

          <p className="text-muted mb-0">
            View and manage all registered blood donors.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadDonors}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Donors"
          value={donors.length}
          icon={FiUsers}
          color="primary"
        />

        <StatCard
          title="Available"
          value={availableCount}
          icon={FiDroplet}
          color="success"
        />

        <StatCard
          title="Total Donations"
          value={totalDonations}
          icon={FiDroplet}
          color="danger"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search donor..."
              />
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">All Blood Groups</option>

                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="">All</option>

                <option value="true">Available</option>

                <option value="false">Unavailable</option>
              </select>
            </div>

            <div className="col-lg-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setBloodGroup("");
                  setAvailability("");
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
          {filteredDonors.length === 0 ? (
            <EmptyState
              icon={FiUsers}
              message="No donors found matching your filters."
            />
          ) : (
            <>
              <DataTable
                keyField="donorId"
                rows={pageItems}
                emptyMessage="No donors found."
                columns={[
                  {
                    key: "fullName",
                    header: "Name",
                  },
                  {
                    key: "email",
                    header: "Email",
                  },
                  {
                    key: "bloodGroup",
                    header: "Blood Group",
                    render: (donor) => (
                      <span className="badge bg-danger">
                        {donor.bloodGroup}
                      </span>
                    ),
                  },
                  {
                    key: "city",
                    header: "City",
                    render: (donor) => (
                      <span>
                        <FiMapPin className="me-1 text-danger" />
                        {donor.city}
                      </span>
                    ),
                  },
                  {
                    key: "mobile",
                    header: "Mobile",
                  },
                  {
                    key: "availability",
                    header: "Availability",
                    render: (donor) => (
                      <StatusBadge status={donor.availability} />
                    ),
                  },
                  {
                    key: "totalDonations",
                    header: "Donations",
                    render: (donor) => (
                      <span className="badge bg-primary">
                        {donor.totalDonations ?? 0}
                      </span>
                    ),
                  },
                  {
                    key: "lastDonationDate",
                    header: "Last Donation",
                    render: (donor) =>
                      donor.lastDonationDate
                        ? formatDate(donor.lastDonationDate)
                        : "-",
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (donor) => (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyId === donor.donorId}
                        title="Delete Donor"
                        onClick={() => setDeleteTarget(donor.donorId)}
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
        title="Delete Donor"
        message="Are you sure you want to permanently delete this donor? This action cannot be undone."
        confirmLabel="Delete"
        loading={busyId === deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
