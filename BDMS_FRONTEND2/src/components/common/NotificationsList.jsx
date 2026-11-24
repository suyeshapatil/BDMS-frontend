import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  FiBell,
  FiCheck,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

import notificationApi from "../../api/notificationApi";

import Loader from "./Loader";
import EmptyState from "./EmptyState";
import ConfirmModal from "./ConfirmModal";

import { formatDateTime } from "../../utils/formatters";

export default function NotificationsList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [busyId, setBusyId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [search, setSearch] = useState("");

  const loadNotifications = async () => {
    try {
      const res = await notificationApi.getMine();

      const sorted = [...(res.data.data || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );

      setNotifications(sorted);
    } catch (err) {
      toast.error(err.message || "Failed to load notifications.");
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);

      await loadNotifications();

      setLoading(false);
    }

    load();
  }, []);

  const filteredNotifications = useMemo(() => {
    if (!search.trim()) return notifications;

    const keyword = search.toLowerCase();

    return notifications.filter(
      (n) =>
        n.title?.toLowerCase().includes(keyword) ||
        n.message?.toLowerCase().includes(keyword),
    );
  }, [notifications, search]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (notificationId) => {
    setBusyId(notificationId);

    try {
      await notificationApi.markAsRead(notificationId);

      toast.success("Notification marked as read.");

      await loadNotifications();
    } catch (err) {
      toast.error(err.message || "Unable to mark notification as read.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteNotification = async () => {
    if (!deleteTarget) return;

    setBusyId(deleteTarget);

    try {
      await notificationApi.remove(deleteTarget);

      toast.success("Notification deleted.");

      await loadNotifications();
    } catch (err) {
      toast.error(err.message || "Unable to delete notification.");
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div className="d-flex gap-4">
          <div>
            <div className="small text-muted">Total</div>

            <div className="fw-bold fs-5">{notifications.length}</div>
          </div>

          <div>
            <div className="small text-muted">Unread</div>

            <div className="fw-bold fs-5 text-danger">{unreadCount}</div>
          </div>
        </div>

        <button className="btn btn-outline-danger" onClick={loadNotifications}>
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="input-group mb-4">
        <span className="input-group-text">
          <FiSearch />
        </span>

        <input
          className="form-control"
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredNotifications.length === 0 ? (
        <EmptyState icon={FiBell} message="No notifications found." />
      ) : (
        <div className="d-flex flex-column gap-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.notificationId}
              className={`card shadow-sm border-0 ${
                !notification.isRead
                  ? "border-start border-4 border-danger"
                  : ""
              }`}
            >
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center flex-wrap gap-2">
                      <h6 className="fw-bold mb-0">{notification.title}</h6>

                      {!notification.isRead && (
                        <span className="badge bg-danger">New</span>
                      )}
                    </div>

                    <p className="text-muted mt-2 mb-2">
                      {notification.message}
                    </p>

                    <small className="text-secondary">
                      {formatDateTime(notification.createdAt)}
                    </small>
                  </div>

                  <div className="d-flex flex-column gap-2 ms-3">
                    {!notification.isRead && (
                      <button
                        className="btn btn-success btn-sm"
                        disabled={busyId === notification.notificationId}
                        onClick={() => markAsRead(notification.notificationId)}
                      >
                        <FiCheck className="me-1" />
                        Read
                      </button>
                    )}

                    <button
                      className="btn btn-outline-danger btn-sm"
                      disabled={busyId === notification.notificationId}
                      onClick={() =>
                        setDeleteTarget(notification.notificationId)
                      }
                    >
                      <FiTrash2 className="me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Notification"
        message="Are you sure you want to permanently delete this notification?"
        confirmLabel="Delete"
        loading={busyId === deleteTarget}
        onConfirm={deleteNotification}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
