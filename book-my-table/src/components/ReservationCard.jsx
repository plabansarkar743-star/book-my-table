import { Calendar, Clock, Users, Phone, Mail, MessageSquare } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate, formatTime } from '../utils/helpers';

export default function ReservationCard({ reservation, table, onCancel, isCustomerView = true }) {
  const canCancel = ['pending', 'confirmed'].includes(reservation.status);

  return (
    <div className="res-card">
      <div className="res-card-header">
        <div>
          <div className="res-card-name">{reservation.customerName}</div>
          <div className="res-card-id">#{reservation.id.slice(0, 8).toUpperCase()}</div>
        </div>
        <StatusBadge status={reservation.status} />
      </div>

      <div className="res-card-details">
        <div className="res-detail">
          <Calendar size={14} />
          <span>{formatDate(reservation.date)}</span>
        </div>
        <div className="res-detail">
          <Clock size={14} />
          <span>{formatTime(reservation.time)} ({reservation.duration || 90} min)</span>
        </div>
        <div className="res-detail">
          <Users size={14} />
          <span>{reservation.partySize} guests</span>
        </div>
        {table && (
          <div className="res-detail">
            <span>🪑</span>
            <span>Table {table.number} · {table.location}</span>
          </div>
        )}
        {!isCustomerView && (
          <>
            <div className="res-detail">
              <Phone size={14} />
              <span>{reservation.customerPhone}</span>
            </div>
            <div className="res-detail">
              <Mail size={14} />
              <span>{reservation.customerEmail}</span>
            </div>
          </>
        )}
        {reservation.specialRequests && (
          <div className="res-detail res-detail-full">
            <MessageSquare size={14} />
            <span className="res-special">{reservation.specialRequests}</span>
          </div>
        )}
      </div>

      {canCancel && onCancel && (
        <button className="btn btn-danger btn-sm" onClick={() => onCancel(reservation.id)}>
          Cancel Reservation
        </button>
      )}
    </div>
  );
}
