import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiCheck, FiX, FiRefreshCw, FiDroplet } from "react-icons/fi";

import bloodRequestApi from "../../api/bloodRequestApi";
import donorResponseApi from "../../api/donorResponseApi";

import DataTable from "../../components/tables/DataTable";
import Loader from "../../components/common/Loader";
import StatusBadge from "../../components/common/StatusBadge";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";
import Breadcrumb from "../../components/layout/Breadcrumb";
import SearchBar from "../../components/common/SearchBar";

import { formatDateTime } from "../../utils/formatters";

export default function DonorBloodRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const [search, setSearch] = useState("");

  const [acceptRequest, setAcceptRequest] = useState(null);
  const [rejectRequest, setRejectRequest] = useState(null);

  const [respondedIds, setRespondedIds] = useState([]);

  const loadRequests = async () => {
    try {
      const res = await bloodRequestApi.getMatchingMe();
      setRequests(res.data.data || []);
    } catch (err) {
      toast.error(err.message || "Failed to load blood requests");
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      await loadRequests();
      setLoading(false);
    }

    load();
  }, []);

  const filteredRequests = useMemo(() => {
    if (!search.trim()) return requests;

    const keyword = search.toLowerCase();

    return requests.filter(
      (r) =>
        r.hospitalName?.toLowerCase().includes(keyword) ||
        r.patientName?.toLowerCase().includes(keyword) ||
        r.city?.toLowerCase().includes(keyword) ||
        r.bloodGroup?.toLowerCase().includes(keyword),
    );
  }, [requests, search]);

  const acceptBloodRequest = async () => {
    if (!acceptRequest) return;

    setRespondingId(acceptRequest.requestId);

    try {
      await donorResponseApi.accept(acceptRequest.requestId);

      toast.success("Blood request accepted successfully.");

      setRespondedIds((prev) => [...prev, acceptRequest.requestId]);

      await loadRequests();
    } catch (err) {
      toast.error(err.message || "Unable to accept request.");
    } finally {
      setRespondingId(null);
      setAcceptRequest(null);
    }
  };

  const rejectBloodRequest = async () => {
    if (!rejectRequest) return;

    setRespondingId(rejectRequest.requestId);

    try {
      await donorResponseApi.reject(rejectRequest.requestId);

      toast.info("Blood request rejected.");

      setRespondedIds((prev) => [...prev, rejectRequest.requestId]);

      await loadRequests();
    } catch (err) {
      toast.error(err.message || "Unable to reject request.");
    } finally {
      setRespondingId(null);
      setRejectRequest(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Blood Requests" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1">Matching Blood Requests</h3>

          <p className="text-muted mb-0">
            These requests match your blood group.
          </p>
        </div>

        <button className="btn btn-outline-danger" onClick={loadRequests}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="alert alert-info border-0 shadow-sm">
        <div className="d-flex align-items-start">
          <FiDroplet size={22} className="me-3 mt-1 text-danger" />

          <div>
            <strong>Blood Donation Reminder</strong>

            <div className="small mt-1">
              Accept a request only if you are available and medically eligible
              to donate blood.
              <br />
              Your response will immediately be sent to the hospital.
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-lg-5">
              <SearchBar
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search hospital, patient, city..."
              />
            </div>

            <div className="col-lg-7 d-flex justify-content-end align-items-center">
              <span className="text-muted">
                {filteredRequests.length} matching request(s)
              </span>
            </div>
          </div>
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={FiDroplet}
              message="No matching blood requests found."
            />
          ) : (
            <DataTable
              keyField="requestId"
              rows={filteredRequests}
              emptyMessage="No blood requests available."
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
                  render: (row) => <StatusBadge status={row.requestStatus} />,
                },
                {
                  key: "createdAt",
                  header: "Created",
                  render: (row) => formatDateTime(row.createdAt),
                },
                {
                  key: "actions",
                  header: "Response",
                  render: (row) => {
                    const alreadyResponded = respondedIds.includes(
                      row.requestId,
                    );

                    if (alreadyResponded) {
                      return (
                        <span className="badge bg-success">
                          Response Submitted
                        </span>
                      );
                    }

                    return (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-success btn-sm"
                          disabled={respondingId === row.requestId}
                          onClick={() => setAcceptRequest(row)}
                        >
                          <FiCheck className="me-1" />
                          Accept
                        </button>

                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={respondingId === row.requestId}
                          onClick={() => setRejectRequest(row)}
                        >
                          <FiX className="me-1" />
                          Reject
                        </button>
                      </div>
                    );
                  },
                },
              ]}
            />
          )}
        </div>
      </div>

      <ConfirmModal
        show={Boolean(acceptRequest)}
        title="Accept Blood Request"
        message={
          acceptRequest
            ? `Are you sure you want to accept the blood request from ${acceptRequest.hospitalName} for ${acceptRequest.bloodGroup} blood?`
            : ""
        }
        confirmLabel="Accept"
        loading={respondingId === acceptRequest?.requestId}
        onConfirm={acceptBloodRequest}
        onCancel={() => setAcceptRequest(null)}
      />

      <ConfirmModal
        show={Boolean(rejectRequest)}
        title="Reject Blood Request"
        message={
          rejectRequest
            ? `Are you sure you want to reject the blood request from ${rejectRequest.hospitalName}?`
            : ""
        }
        confirmLabel="Reject"
        loading={respondingId === rejectRequest?.requestId}
        onConfirm={rejectBloodRequest}
        onCancel={() => setRejectRequest(null)}
      />
    </div>
  );
}
