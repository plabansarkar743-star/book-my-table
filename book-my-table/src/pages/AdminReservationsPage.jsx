import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Trash2 } from 'lucide-react';
import { useApp, ACTIONS } from '../context/AppContext';
import AdminReservationRow from '../components/AdminReservationRow';
import '../components/AdminReservationRow.css';
import './AdminReservationsPage.css';

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'seated', 'completed', 'cancelled'];

export default function AdminReservationsPage() {
  const { state, dispatch, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-asc');

  const filtered = useMemo(() => {
    let list = [...state.reservations];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        r.customerName.toLowerCase().includes(q) ||
        r.customerEmail.toLowerCase().includes(q) ||
        r.customerPhone.includes(q)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((r) => r.status === statusFilter);
    }

    // Date filter
    if (dateFilter) {
      list = list.filter((r) => r.date === dateFilter);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
      if (sortBy === 'name') return a.customerName.localeCompare(b.customerName);
      return 0;
    });

    return list;
  }, [state.reservations, search, statusFilter, dateFilter, sortBy]);

  const handleDeleteAll = () => {
    const cancelled = state.reservations.filter((r) => r.status === 'cancelled');
    cancelled.forEach((r) => dispatch({ type: ACTIONS.DELETE_RESERVATION, payload: r.id }));
    addToast(`Removed ${cancelled.length} cancelled reservation(s).`, 'info');
  };

  const statusCounts = STATUS_FILTERS.reduce((acc, s) => {
    acc[s] = s === 'all' ? state.reservations.length : state.reservations.filter((r) => r.status === s).length;
    return acc;
  }, {});

  return (
    <div className="page admin-res-page">
      <div className="container">
        {/* Header */}
        <div className="admin-res-page-header">
          <div className="admin-tables-title-row">
            <Link to="/admin" className="btn btn-ghost btn-sm">
              <ArrowLeft size={15} /> Dashboard
            </Link>
            <div>
              <span className="section-eyebrow">All Reservations</span>
              <h1>Reservation Management</h1>
            </div>
          </div>
          <button className="btn btn-danger btn-sm" onClick={handleDeleteAll}
            disabled={statusCounts.cancelled === 0}>
            <Trash2 size={14} /> Clear Cancelled
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card admin-res-filters">
          <div className="admin-res-search-row">
            <div className="admin-res-search-wrap">
              <Search size={16} className="search-icon" />
              <input type="text" className="form-input admin-res-search" placeholder="Search by name, email, phone..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <input type="date" className="form-input" style={{ width: 180 }} value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)} />
            <select className="form-select" style={{ width: 160 }} value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value="date-asc">Date ↑</option>
              <option value="date-desc">Date ↓</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>

          {/* Status Filter Tabs */}
          <div className="admin-status-tabs">
            {STATUS_FILTERS.map((s) => (
              <button key={s} className={`status-filter-btn ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="status-filter-count">{statusCounts[s]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="admin-res-results-header">
          <span>{filtered.length} reservation{filtered.length !== 1 ? 's' : ''} found</span>
          {(search || dateFilter || statusFilter !== 'all') && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setSearch(''); setDateFilter(''); setStatusFilter('all'); }}>
              Clear Filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state glass-card">
            <div className="empty-state-icon">📋</div>
            <h3>No Reservations Found</h3>
            <p>Adjust your filters or search terms.</p>
          </div>
        ) : (
          <div className="admin-res-list">
            {filtered.map((r) => {
              const table = state.tables.find((t) => t.id === r.tableId);
              return <AdminReservationRow key={r.id} reservation={r} table={table} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
