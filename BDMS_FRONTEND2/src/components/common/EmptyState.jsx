import { FiInbox } from 'react-icons/fi';

export default function EmptyState({ message = 'Nothing to show yet.', icon: Icon = FiInbox }) {
  return (
    <div className="text-center text-muted py-5">
      <Icon size={48} className="mb-3 opacity-50" />
      <p className="mb-0">{message}</p>
    </div>
  );
}
