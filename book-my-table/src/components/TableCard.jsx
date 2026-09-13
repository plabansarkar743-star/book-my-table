import { Users, MapPin, Wrench } from 'lucide-react';
import StatusBadge from './StatusBadge';
import './TableCard.css';

export default function TableCard({ table, onSelect, selected, isAvailable, showActions, onStatusChange }) {
  const statusClass = table.status === 'maintenance'
    ? 'table-card-maintenance'
    : isAvailable === false
    ? 'table-card-unavailable'
    : selected
    ? 'table-card-selected'
    : '';

  return (
    <div
      className={`table-card ${statusClass} ${onSelect && isAvailable ? 'table-card-clickable' : ''}`}
      onClick={() => onSelect && isAvailable && onSelect(table)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect && isAvailable ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && onSelect && isAvailable && onSelect(table)}
    >
      {/* Table Visual */}
      <div className="table-visual">
        <div className="table-shape" data-capacity={table.capacity}>
          {table.capacity <= 4 ? '⬜' : table.capacity <= 6 ? '⬛' : '🟫'}
          <span className="table-number">T{table.number}</span>
        </div>
        {/* Seat indicators */}
        <div className="seat-indicators">
          {Array.from({ length: Math.min(table.capacity, 8) }).map((_, i) => (
            <div key={i} className="seat-dot" />
          ))}
          {table.capacity > 8 && <span className="seat-more">+{table.capacity - 8}</span>}
        </div>
      </div>

      <div className="table-card-info">
        <div className="table-card-header">
          <span className="table-card-name">Table {table.number}</span>
          <StatusBadge status={table.status === 'maintenance' ? 'maintenance' : isAvailable === false ? 'occupied' : isAvailable === true ? 'available' : table.status} size="xs" />
        </div>
        <div className="table-card-meta">
          <span className="table-meta-item">
            <Users size={13} />
            {table.capacity} seats
          </span>
          <span className="table-meta-item">
            <MapPin size={13} />
            {table.location}
          </span>
        </div>
        {selected && (
          <div className="table-card-selected-badge">✓ Selected</div>
        )}
      </div>

      {showActions && onStatusChange && (
        <div className="table-card-actions">
          {['available', 'occupied', 'maintenance'].map((s) => (
            <button
              key={s}
              className={`btn btn-sm ${table.status === s ? 'btn-primary' : 'btn-ghost'}`}
              onClick={(e) => { e.stopPropagation(); onStatusChange(table.id, s); }}
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
