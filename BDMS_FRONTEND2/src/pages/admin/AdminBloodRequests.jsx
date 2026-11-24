import { useEffect, useMemo, useState } from "react";
import {
  FiActivity,
  FiDroplet,
  FiRefreshCw,
  FiRotateCcw,
  FiTrash2,
} from "react-icons/fi";
import { toast } from "react-toastify";

import bloodRequestApi from "../../api/bloodRequestApi";

import Breadcrumb from "../../components/layout/Breadcrumb";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import SearchBar from "../../components/common/SearchBar";
import Pagination from "../../components/common/Pagination";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/common/StatusBadge";
import StatCard from "../../components/dashboard/StatCard";

import usePagination from "../../hooks/usePagination";

import { REQUEST_STATUSES, BLOOD_GROUPS } from "../../constants/enums";

import { formatDateTime } from "../../utils/formatters";

export default function AdminBloodRequests() {
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const [bloodGroupFilter, setBloodGroupFilter] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);

      const res = await bloodRequestApi.getAll();

      setRequests(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load blood requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const updateStatus = async (requestId, requestStatus) => {
    setBusyId(requestId);

    try {
      await bloodRequestApi.updateStatus(requestId, requestStatus);

      toast.success("Request status updated.");

      await loadRequests();
    } catch (err) {
      toast.error(err.message || "Unable to update request.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget);

    try {
      await bloodRequestApi.remove(deleteTarget);

      toast.success("Blood request deleted.");

      await loadRequests();
    } catch (err) {
      toast.error(err.message || "Unable to delete request.");
    } finally {
      setBusyId(null);

      setDeleteTarget(null);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const keyword = `${request.patientName}
         ${request.hospitalName}
         ${request.city}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        !statusFilter || request.requestStatus === statusFilter;

      const bloodMatch =
        !bloodGroupFilter || request.bloodGroup === bloodGroupFilter;

      return keyword && statusMatch && bloodMatch;
    });
  }, [requests, search, statusFilter, bloodGroupFilter]);

  const { pageItems, currentPage, totalPages, setCurrentPage } =
    usePagination(filteredRequests);

  const openRequests = requests.filter(
    (r) => r.requestStatus === "OPEN",
  ).length;

  const completedRequests = requests.filter(
    (r) => r.requestStatus === "COMPLETED",
  ).length;

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
            label: "Blood Requests",
          },
        ]}
      />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-1">Blood Requests</h3>

          <p className="text-muted mb-0">
            Monitor and manage every blood request in the system.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadRequests}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row mb-4">
        <StatCard
          title="Total Requests"
          value={requests.length}
          icon={FiDroplet}
          color="primary"
        />

        <StatCard
          title="Open Requests"
          value={openRequests}
          icon={FiActivity}
          color="warning"
        />

        <StatCard
          title="Completed"
          value={completedRequests}
          icon={FiDroplet}
          color="success"
        />
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-lg-4">
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder="Search patient or hospital..."
              />
            </div>

            <div className="col-lg-3">
              <select
                className="form-select"
                value={bloodGroupFilter}
                onChange={(e) => setBloodGroupFilter(e.target.value)}
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>

                {REQUEST_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2">
              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("");
                  setBloodGroupFilter("");
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
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={FiDroplet}
              message="No blood requests found matching your filters."
            />
          ) : (
            <>
              <DataTable
                keyField="requestId"
                rows={pageItems}
                emptyMessage="No blood requests found."
                columns={[
                  {
                    key: "hospitalName",
                    header: "Hospital",
                  },
                  {
                    key: "patientName",
                    header: "Patient",
                  },
                  {
                    key: "bloodGroup",
                    header: "Blood Group",
                    render: (request) => (
                      <span className="badge bg-danger">
                        {request.bloodGroup}
                      </span>
                    ),
                  },
                  {
                    key: "unitsRequired",
                    header: "Units",
                  },
                  {
                    key: "city",
                    header: "City",
                  },
                  {
                    key: "urgencyLevel",
                    header: "Urgency",
                    render: (request) => (
                      <StatusBadge status={request.urgencyLevel} />
                    ),
                  },
                  {
                    key: "requestStatus",
                    header: "Status",
                    render: (request) => (
                      <select
                        className="form-select form-select-sm"
                        style={{ minWidth: 150 }}
                        value={request.requestStatus}
                        disabled={busyId === request.requestId}
                        onChange={(e) =>
                          updateStatus(request.requestId, e.target.value)
                        }
                      >
                        {REQUEST_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    ),
                  },
                  {
                    key: "createdAt",
                    header: "Created",
                    render: (request) =>
                      request.createdAt
                        ? formatDateTime(request.createdAt)
                        : "-",
                  },
                  {
                    key: "actions",
                    header: "Actions",
                    render: (request) => (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        disabled={busyId === request.requestId}
                        title="Delete Request"
                        onClick={() => setDeleteTarget(request.requestId)}
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
        title="Delete Blood Request"
        message="Are you sure you want to permanently delete this blood request? This action cannot be undone."
        confirmLabel="Delete"
        loading={busyId === deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
