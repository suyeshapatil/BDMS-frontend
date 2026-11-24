export default function ProfileCard({ title, fields, actions }) {
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">{title}</h5>
      </div>
      <div className="card-body">
        <dl className="row mb-0">
          {fields.map(({ label, value }) => (
            <div className="col-sm-6 mb-3" key={label}>
              <dt className="text-muted small text-uppercase">{label}</dt>
              <dd className="mb-0 fs-6">{value ?? '-'}</dd>
            </div>
          ))}
        </dl>
        {actions && <div className="mt-2">{actions}</div>}
      </div>
    </div>
  );
}
