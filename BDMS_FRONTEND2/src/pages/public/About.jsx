export default function About() {
  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <h2 className="fw-bold text-danger mb-4">About BDMS</h2>
      <p>
        The Blood Donation Management System (BDMS) is a centralized platform designed to
        streamline blood donation management and emergency blood request handling. It connects
        donors, hospitals, and administrators to improve communication and reduce response time
        during emergencies.
      </p>
      <p>
        Donors can register, manage their availability, and respond to blood requests that match
        their blood group and location. Hospitals can create and track blood requests and search
        for suitable donors. Administrators oversee the platform - approving hospitals, managing
        user accounts, and monitoring system-wide activity through reports and dashboards.
      </p>
      <p className="mb-0">
        This project was built as a CDAC Final Year Major Project (Project Code PGCP-AC-027).
      </p>
    </div>
  );
}
