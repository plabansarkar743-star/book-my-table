import { Calendar, Clock, Users, Phone, Mail, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatTime } from '../utils/helpers';
import { ACTIONS, useApp } from '../context/AppContext';

export default function AdminReservationRow({ reservation, table }) {
  const { dispatch, addToast } = useApp();

  const handleAction = (newStatus) => {
    dispatch({ type: ACTIONS.UPDATE_RESERVATION, payload: { id: reservation.id, status: newStatus } });
    const labels = { confirmed: 'Confirmed', seated: 'Guest Seated', completed: 'Marked Complete', cancelled: 'Cancelled' };
    addToast(`Reservation ${labels[newStatus] || 'updated'}.`, newStatus === 'cancelled' ? 'error' : 'success');
  };

  const actionButtons = {
    pending: [
      { label: 'Confirm', status: 'confirmed', cls: 'btn-success' },
      { label: 'Cancel', status: 'cancelled', cls: 'btn-danger' },
    ],
    confirmed: [
      { label: 'Seat Guest', status: 'seated', cls: 'btn-primary' },
      { label: 'Cancel', status: 'cancelled', cls: 'btn-danger' },
    ],
    seated: [
      { label: 'Complete', status: 'completed', cls: 'btn-success' },
    ],
    completed: [],
    cancelled: [],
  };

  const buttons = actionButtons[reservation.status] || [];

  return (
    <div className="admin-res-row">
      <div className="admin-res-main">
        <div className="admin-res-customer">
          <div className="admin-res-name">{reservation.customerName}</div>
          <div className="admin-res-contact">
            <span><Phone size={11} />{reservation.customerPhone}</span>
            <span><Mail size={11} />{reservation.customerEmail}</span>
          </div>
        </div>

        <div className="admin-res-details">
          <span><Calendar size={12} />{formatDate(reservation.date)}</span>
          <span><Clock size={12} />{formatTime(reservation.time)}</span>
          <span><Users size={12} />{reservation.partySize} guests</span>
          {table && <span>🪑 Table {table.number}</span>}
        </div>

        <StatusBadge status={reservation.status} />
      </div>

      {reservation.specialRequests && (
        <div className="admin-res-special">
          💬 {reservation.specialRequests}
        </div>
      )}

      {buttons.length > 0 && (
        <div className="admin-res-actions">
          {buttons.map((b) => (
            <button key={b.status} className={`btn btn-sm ${b.cls}`} onClick={() => handleAction(b.status)}>
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
