import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiEye, FiRefreshCw, FiTrash2 } from "react-icons/fi";

import hospitalApi from "../../api/hospitalApi";
import bloodRequestApi from "../../api/bloodRequestApi";
import donorResponseApi from "../../api/donorResponseApi";

import DataTable from "../../components/tables/DataTable";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmModal from "../../components/common/ConfirmModal";
import SearchBar from "../../components/common/SearchBar";
import Breadcrumb from "../../components/layout/Breadcrumb";
import EmptyState from "../../components/common/EmptyState";

import { REQUEST_STATUSES } from "../../constants/enums";

import { formatDateTime } from "../../utils/formatters";

export default function ManageBloodRequests() {
  const [hospitalId, setHospitalId] = useState(null);

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [responsesModal, setResponsesModal] = useState(false);

  const [responsesLoading, setResponsesLoading] = useState(false);

  const [responses, setResponses] = useState([]);

  const [search, setSearch] = useState("");

  const loadRequests = useCallback(async (id) => {
    try {
      const response = await bloodRequestApi.getByHospital(id);

      setRequests(response.data.data);
    } catch (err) {
      toast.error(err?.message ?? "Unable to load blood requests.");
    }
  }, []);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);

      const hospitalResponse = await hospitalApi.getMe();

      const id = hospitalResponse.data.data.hospitalId;

      setHospitalId(id);

      await loadRequests(id);
    } catch (err) {
      toast.error(err?.message ?? "Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }, [loadRequests]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const updateStatus = async (requestId, requestStatus) => {
    try {
      setBusyId(requestId);

      await bloodRequestApi.updateStatus(requestId, requestStatus);

      toast.success("Request status updated successfully.");

      await loadRequests(hospitalId);
    } catch (err) {
      toast.error(err?.message ?? "Unable to update request.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    try {
      setBusyId(deleteTarget);

      await bloodRequestApi.remove(deleteTarget);

      toast.success("Blood request deleted successfully.");

      await loadRequests(hospitalId);
    } catch (err) {
      toast.error(err?.message ?? "Unable to delete request.");
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  const viewResponses = async (requestId) => {
    try {
      setResponsesModal(true);
      setResponsesLoading(true);

      const response = await donorResponseApi.getByRequest(requestId);

      setResponses(response.data.data);
    } catch (err) {
      toast.error(err?.message ?? "Unable to load donor responses.");
    } finally {
      setResponsesLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    if (!search.trim()) {
      return requests;
    }

    const keyword = search.toLowerCase();

    return requests.filter((request) => {
      return (
        request.patientName?.toLowerCase().includes(keyword) ||
        request.city?.toLowerCase().includes(keyword) ||
        request.bloodGroup?.toLowerCase().includes(keyword) ||
        request.requestStatus?.toLowerCase().includes(keyword)
      );
    });
  }, [requests, search]);

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="container-fluid">
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Manage Blood Requests" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h2 className="fw-bold mb-1">Manage Blood Requests</h2>

          <p className="text-muted mb-0">
            View, update and manage all blood requests created by your hospital.
          </p>
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={() => loadRequests(hospitalId)}
        >
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-3">
          <h5 className="mb-0">Blood Requests</h5>

          <div style={{ minWidth: 280 }}>
            <SearchBar
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, city, blood group..."
            />
          </div>
        </div>

        <div className="card-body">
          {filteredRequests.length === 0 ? (
            <EmptyState message="No blood requests found." icon={FiEye} />
          ) : (
            <DataTable
              keyField="requestId"
              rows={filteredRequests}
              columns={[
                {
                  key: "patientName",
                  header: "Patient",
                },
                {
                  key: "bloodGroup",
                  header: "Blood Group",
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
                  render: (row) => <StatusBadge status={row.urgencyLevel} />,
                },
                {
                  key: "requestStatus",
                  header: "Status",
                  render: (row) => (
                    <select
                      className="form-select form-select-sm"
                      value={row.requestStatus}
                      disabled={busyId === row.requestId}
                      onChange={(e) =>
                        updateStatus(row.requestId, e.target.value)
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
                  render: (row) => formatDateTime(row.createdAt),
                },
                {
                  key: "actions",
                  header: "Actions",
                  render: (row) => (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title="View Donor Responses"
                        onClick={() => viewResponses(row.requestId)}
                      >
                        <FiEye />
                      </button>

                      <button
                        className="btn btn-sm btn-outline-danger"
                        title="Delete Request"
                        disabled={busyId === row.requestId}
                        onClick={() => setDeleteTarget(row.requestId)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          )}
        </div>
      </div>

      {responsesModal && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Donor Responses</h5>

                  <button
                    className="btn-close"
                    onClick={() => {
                      setResponsesModal(false);
                      setResponses([]);
                    }}
                  />
                </div>

                <div className="modal-body">
                  {responsesLoading ? (
                    <Loader />
                  ) : responses.length === 0 ? (
                    <EmptyState
                      message="No donor has responded yet."
                      icon={FiEye}
                    />
                  ) : (
                    <ul className="list-group">
                      {responses.map((response) => (
                        <li
                          key={response.responseId}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <div className="fw-semibold">
                              {response.donorName}
                            </div>

                            <small className="text-muted">
                              {formatDateTime(response.responseDate)}
                            </small>
                          </div>

                          <StatusBadge status={response.responseStatus} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop show" />
        </>
      )}

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Blood Request"
        message="Are you sure you want to delete this blood request? This action cannot be undone."
        confirmLabel="Delete"
        loading={busyId === deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
