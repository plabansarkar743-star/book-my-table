import { Users, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';
import './FloorPlan.css';

export default function FloorPlan({ tables, reservations, selectedDate, selectedTime, onTableClick }) {
  const getTableStatus = (table) => {
    if (table.status === 'maintenance') return 'maintenance';
    const isOccupied = reservations.some((r) => {
      if (r.tableId !== table.id) return false;
      if (r.date !== selectedDate) return false;
      if (['cancelled', 'completed'].includes(r.status)) return false;
      if (!selectedTime) return ['seated'].includes(r.status);
      const [rH, rM] = selectedTime.split(':').map(Number);
      const rStart = rH * 60 + rM;
      const rEnd = rStart + 90;
      const [eH, eM] = r.time.split(':').map(Number);
      const eStart = eH * 60 + eM;
      const eEnd = eStart + (r.duration || 90);
      return rStart < eEnd && rEnd > eStart;
    });
    return isOccupied ? 'occupied' : 'available';
  };

  const grouped = tables.reduce((acc, t) => {
    acc[t.location] = acc[t.location] || [];
    acc[t.location].push(t);
    return acc;
  }, {});

  return (
    <div className="floor-plan">
      <div className="floor-plan-legend">
        {['available', 'occupied', 'maintenance'].map((s) => (
          <div key={s} className="legend-item">
            <div className={`legend-dot legend-${s}`} />
            <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
          </div>
        ))}
      </div>

      {Object.entries(grouped).map(([location, locationTables]) => (
        <div key={location} className="floor-section">
          <div className="floor-section-label">
            <MapPin size={13} /> {location}
          </div>
          <div className="floor-tables-grid">
            {locationTables.map((table) => {
              const status = getTableStatus(table);
              return (
                <div
                  key={table.id}
                  className={`floor-table floor-table-${status} ${onTableClick ? 'floor-table-clickable' : ''}`}
                  onClick={() => onTableClick && status === 'available' && onTableClick(table)}
                  title={`Table ${table.number} — ${table.capacity} seats — ${status}`}
                >
                  <div className="floor-table-num">T{table.number}</div>
                  <div className="floor-table-cap">
                    <Users size={10} />
                    {table.capacity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
