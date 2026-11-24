import { useState } from "react";
import { FiBell, FiRefreshCw } from "react-icons/fi";

import Breadcrumb from "../../components/layout/Breadcrumb";
import NotificationsList from "../../components/common/NotificationsList";

export default function HospitalNotifications() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Notifications" }]}
      />

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <div>
          <h3 className="fw-bold mb-1 d-flex align-items-center">
            <FiBell className="me-2 text-danger" />
            Notifications
          </h3>

          <p className="text-muted mb-0">
            View notifications related to blood requests, donor responses and
            donation updates.
          </p>
        </div>

        <button
          className="btn btn-outline-danger"
          onClick={() => setRefreshKey((prev) => prev + 1)}
        >
          <FiRefreshCw className="me-2" />
          Refresh
        </button>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <NotificationsList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
