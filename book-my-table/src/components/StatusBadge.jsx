import { STATUS_COLORS } from '../utils/helpers';

const STATUS_LABELS = {
  available: 'Available',
  occupied: 'Occupied',
  maintenance: 'Maintenance',
  pending: 'Pending',
  confirmed: 'Confirmed',
  seated: 'Seated',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function StatusBadge({ status, size = 'sm' }) {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span
      className="badge"
      style={{
        background: colors.light,
        color: colors.bg,
        border: `1px solid ${colors.bg}40`,
        fontSize: size === 'xs' ? '0.7rem' : '0.75rem',
        padding: size === 'xs' ? '2px 8px' : '3px 10px',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: colors.bg,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {STATUS_LABELS[status] || status}
    </span>
  );
}
