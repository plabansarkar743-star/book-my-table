import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, CalendarDays, Table2, TrendingUp, Clock, Users, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { restaurantInfo } from '../data/initialData';
import { todayStr, getTodayReservations, getOccupancyPercent, formatTime } from '../utils/helpers';
import StatusBadge from '../components/StatusBadge';
import './AdminPage.css';

export default function AdminPage() {
  const { state } = useApp();
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === restaurantInfo.adminPin) {
      setAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };

  if (!authenticated) {
    return (
      <div className="page admin-lock-page">
        <div className="admin-lock-card glass-card animate-scale-in">
          <div className="admin-lock-icon">
            <ShieldCheck size={32} />
          </div>
          <h2>Admin Access</h2>
          <p className="text-muted">Enter your admin PIN to access the management panel.</p>
          <form className="admin-pin-form" onSubmit={handlePinSubmit}>
            <input
              type="password"
              className="form-input admin-pin-input"
              placeholder="Enter PIN"
              value={pin}
              maxLength={6}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
            />
            {pinError && <span className="form-error">{pinError}</span>}
            <button type="submit" className="btn btn-primary w-full">
              Access Dashboard
            </button>
          </form>
          <p className="admin-pin-hint">Default PIN: <code>1234</code></p>
        </div>
      </div>
    );
  }

  // ── Dashboard ────────────────────────────────────────────────
  const todayRes = getTodayReservations(state.reservations);
  const pendingCount = state.reservations.filter((r) => r.status === 'pending').length;
  const seatedCount = state.tables.filter((t) => t.status === 'occupied').length;
  const occupancy = getOccupancyPercent(state.tables);
  const totalRevenue = state.reservations.filter((r) => r.status === 'completed').length * 2200; // avg estimate

  const kpis = [
    { icon: <CalendarDays size={22} />, value: todayRes.length, label: "Today's Reservations", color: 'rgba(59,130,246,0.15)', iconColor: '#3b82f6' },
    { icon: <Clock size={22} />, value: pendingCount, label: 'Pending Confirmations', color: 'rgba(139,92,246,0.15)', iconColor: '#8b5cf6' },
    { icon: <Users size={22} />, value: seatedCount, label: 'Currently Seated', color: 'rgba(239,68,68,0.15)', iconColor: '#ef4444' },
    { icon: <TrendingUp size={22} />, value: `${occupancy}%`, label: 'Occupancy Rate', color: 'rgba(201,169,110,0.15)', iconColor: 'var(--color-primary)' },
  ];

  const upcomingToday = todayRes
    .filter((r) => ['pending', 'confirmed'].includes(r.status))
    .sort((a, b) => a.time.localeCompare(b.time))
    .slice(0, 5);

  return (
    <div className="page admin-page">
      <div className="container">
        <div className="admin-header">
          <div>
            <span className="section-eyebrow">Management Panel</span>
            <h1 className="admin-title">Admin Dashboard</h1>
          </div>
          <div className="admin-header-actions">
            <Link to="/admin/tables" className="btn btn-secondary">
              <Table2 size={16} /> Manage Tables
            </Link>
            <Link to="/admin/reservations" className="btn btn-primary">
              <CalendarDays size={16} /> All Reservations
            </Link>
          </div>
        </div>

        {/* KPIs */}
        <div className="admin-kpis">
          {kpis.map((k, i) => (
            <div key={i} className="kpi-card" style={{ '--kpi-color': k.color }}>
              <div className="kpi-icon" style={{ background: k.color, color: k.iconColor }}>
                {k.icon}
              </div>
              <div>
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-label">{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="admin-grid">
          {/* Upcoming Reservations Today */}
          <div className="glass-card admin-upcoming">
            <div className="admin-section-header">
              <h2>Today&apos;s Upcoming</h2>
              <Link to="/admin/reservations" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            {upcomingToday.length === 0 ? (
              <div className="empty-state" style={{ padding: 'var(--space-10) 0' }}>
                <div className="empty-state-icon">📅</div>
                <p>No upcoming reservations today.</p>
              </div>
            ) : (
              <div className="admin-upcoming-list">
                {upcomingToday.map((r) => {
                  const table = state.tables.find((t) => t.id === r.tableId);
                  return (
                    <div key={r.id} className="admin-upcoming-item">
                      <div className="admin-upcoming-time">{formatTime(r.time)}</div>
                      <div className="admin-upcoming-info">
                        <div className="admin-upcoming-name">{r.customerName}</div>
                        <div className="admin-upcoming-meta">
                          {r.partySize} guests · Table {table?.number || '?'}
                        </div>
                      </div>
                      <StatusBadge status={r.status} size="xs" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Table Status Overview */}
          <div className="glass-card admin-table-overview">
            <div className="admin-section-header">
              <h2>Table Status</h2>
              <Link to="/admin/tables" className="btn btn-ghost btn-sm">Manage →</Link>
            </div>
            <div className="table-status-list">
              {state.tables.map((table) => (
                <div key={table.id} className="table-status-item">
                  <div className="table-status-num">T{table.number}</div>
                  <div className="table-status-info">
                    <span>{table.location}</span>
                    <span className="table-status-cap"><Users size={11} />{table.capacity}</span>
                  </div>
                  <StatusBadge status={table.status} size="xs" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="admin-quick-stats glass-card">
          <h2>Quick Stats</h2>
          <div className="quick-stats-grid">
            <div className="quick-stat">
              <span className="quick-stat-value">{state.tables.length}</span>
              <span className="quick-stat-label">Total Tables</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{state.tables.filter(t => t.status === 'available').length}</span>
              <span className="quick-stat-label">Available</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{state.reservations.filter(r => r.status === 'confirmed').length}</span>
              <span className="quick-stat-label">Confirmed</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{state.reservations.filter(r => r.status === 'completed').length}</span>
              <span className="quick-stat-label">Completed</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{state.reservations.filter(r => r.status === 'cancelled').length}</span>
              <span className="quick-stat-label">Cancelled</span>
            </div>
            <div className="quick-stat">
              <span className="quick-stat-value">{state.reservations.length}</span>
              <span className="quick-stat-label">Total Bookings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
