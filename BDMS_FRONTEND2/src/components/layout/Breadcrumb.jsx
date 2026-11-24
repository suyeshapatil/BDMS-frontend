import { Link } from 'react-router-dom';

export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-4">
        {items.map((item, idx) => (
          <li
            key={item.label}
            className={`breadcrumb-item ${idx === items.length - 1 ? 'active' : ''}`}
            aria-current={idx === items.length - 1 ? 'page' : undefined}
          >
            {item.to && idx !== items.length - 1 ? <Link to={item.to}>{item.label}</Link> : item.label}
          </li>
        ))}
      </ol>
    </nav>
  );
}
