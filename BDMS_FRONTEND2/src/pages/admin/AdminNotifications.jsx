import NotificationsList from "../../components/common/NotificationsList";
import Breadcrumb from "../../components/layout/Breadcrumb";

export default function AdminNotifications() {
  return (
    <div>
      <Breadcrumb
        items={[{ label: "Dashboard" }, { label: "Notifications" }]}
      />

      <h3 className="fw-bold mb-4">Admin Notifications</h3>

      <NotificationsList />
    </div>
  );
}
