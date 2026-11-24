const STATUS_COLORS = {
  OPEN: 'primary',
  PENDING: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'secondary',
  ACCEPTED: 'success',
  REJECTED: 'danger',
  APPROVED: 'success',
  LOW: 'secondary',
  MEDIUM: 'info',
  HIGH: 'warning',
  CRITICAL: 'danger',
  true: 'success',
  false: 'secondary',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] ?? 'secondary';
  return <span className={`badge text-bg-${color}`}>{String(status)}</span>;
}
