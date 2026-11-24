export default function StatCard({ title, value, icon: Icon, color = 'danger' }) {
  return (
    <div className="col-6 col-md-4 col-xl-3 mb-3">
      <div className="card shadow-sm h-100 border-0">
        <div className="card-body d-flex align-items-center gap-3">
          <div className={`rounded-circle bg-${color}-subtle text-${color} d-flex align-items-center justify-content-center`} style={{ width: 48, height: 48 }}>
            <Icon size={22} />
          </div>
          <div>
            <div className="text-muted small text-uppercase">{title}</div>
            <div className="fs-4 fw-bold">{value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
