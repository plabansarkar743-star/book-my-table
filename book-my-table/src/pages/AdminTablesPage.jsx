import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { useApp, ACTIONS } from '../context/AppContext';
import TableCard from '../components/TableCard';
import FloorPlan from '../components/FloorPlan';
import Modal from '../components/Modal';
import './AdminTablesPage.css';

const LOCATIONS = ['Window', 'Main Hall', 'Centre', 'Private', 'Banquet', 'Terrace', 'Bar'];
const EMPTY_TABLE = { number: '', capacity: 2, status: 'available', location: 'Main Hall' };

export default function AdminTablesPage() {
  const { state, dispatch, addToast } = useApp();
  const [view, setView] = useState('grid'); // 'grid' | 'floor'
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState(EMPTY_TABLE);
  const [tableToDelete, setTableToDelete] = useState(null);

  const openAdd = () => {
    const nextNum = Math.max(0, ...state.tables.map((t) => t.number)) + 1;
    setFormData({ ...EMPTY_TABLE, number: nextNum });
    setEditingTable(null);
    setModalOpen(true);
  };

  const openEdit = (table) => {
    setFormData({ number: table.number, capacity: table.capacity, status: table.status, location: table.location });
    setEditingTable(table);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.number || !formData.capacity) {
      addToast('Please fill in all required fields.', 'warning');
      return;
    }
    if (editingTable) {
      dispatch({ type: ACTIONS.UPDATE_TABLE, payload: { id: editingTable.id, ...formData } });
      addToast(`Table ${formData.number} updated.`, 'success');
    } else {
      dispatch({
        type: ACTIONS.ADD_TABLE,
        payload: { ...formData, posX: 10, posY: 10 },
      });
      addToast(`Table ${formData.number} added.`, 'success');
    }
    setModalOpen(false);
  };

  const confirmDelete = (table) => {
    setTableToDelete(table);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    dispatch({ type: ACTIONS.DELETE_TABLE, payload: tableToDelete.id });
    addToast(`Table ${tableToDelete.number} removed.`, 'info');
    setDeleteModalOpen(false);
    setTableToDelete(null);
  };

  const handleStatusChange = (id, status) => {
    dispatch({ type: ACTIONS.UPDATE_TABLE_STATUS, payload: { id, status } });
    addToast('Table status updated.', 'success');
  };

  const grouped = state.tables.reduce((acc, t) => {
    acc[t.location] = acc[t.location] || [];
    acc[t.location].push(t);
    return acc;
  }, {});

  return (
    <div className="page admin-tables-page">
      <div className="container">
        <div className="admin-tables-header">
          <div className="admin-tables-title-row">
            <Link to="/admin" className="btn btn-ghost btn-sm">
              <ArrowLeft size={15} /> Dashboard
            </Link>
            <div>
              <span className="section-eyebrow">Table Management</span>
              <h1>Floor & Tables</h1>
            </div>
          </div>
          <div className="admin-tables-actions">
            <div className="tab-bar">
              <button className={`tab-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grid View</button>
              <button className={`tab-btn ${view === 'floor' ? 'active' : ''}`} onClick={() => setView('floor')}>Floor Plan</button>
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} /> Add Table
            </button>
          </div>
        </div>

        {/* Summary Bar */}
        <div className="table-summary-bar glass-card">
          {['available', 'occupied', 'maintenance'].map((s) => {
            const count = state.tables.filter((t) => t.status === s).length;
            return (
              <div key={s} className="table-summary-item">
                <span className={`table-summary-dot dot-${s}`} />
                <span className="table-summary-count">{count}</span>
                <span className="table-summary-label">{s.charAt(0).toUpperCase() + s.slice(1)}</span>
              </div>
            );
          })}
          <div className="table-summary-divider" />
          <div className="table-summary-item">
            <span className="table-summary-count">{state.tables.length}</span>
            <span className="table-summary-label">Total Tables</span>
          </div>
          <div className="table-summary-item">
            <span className="table-summary-count">{state.tables.reduce((s, t) => s + t.capacity, 0)}</span>
            <span className="table-summary-label">Total Seats</span>
          </div>
        </div>

        {/* Grid View */}
        {view === 'grid' && (
          <div className="admin-tables-content">
            {Object.entries(grouped).map(([location, tables]) => (
              <div key={location} className="tables-location-group">
                <h2 className="tables-location-title">{location}</h2>
                <div className="admin-tables-grid">
                  {tables.map((table) => (
                    <div key={table.id} className="admin-table-wrap">
                      <TableCard table={table} showActions={true} onStatusChange={handleStatusChange} />
                      <div className="admin-table-btns">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(table)}>
                          <Edit2 size={13} /> Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(table)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floor View */}
        {view === 'floor' && (
          <div className="glass-card">
            <FloorPlan
              tables={state.tables}
              reservations={state.reservations}
              selectedDate={new Date().toISOString().split('T')[0]}
              selectedTime={null}
            />
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTable ? `Edit Table ${editingTable.number}` : 'Add New Table'}
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              <Save size={15} /> {editingTable ? 'Save Changes' : 'Add Table'}
            </button>
          </>
        }
      >
        <div className="table-form">
          <div className="form-group">
            <label className="form-label">Table Number *</label>
            <input type="number" className="form-input" value={formData.number} min={1}
              onChange={(e) => setFormData((p) => ({ ...p, number: Number(e.target.value) }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Seating Capacity *</label>
            <input type="number" className="form-input" value={formData.capacity} min={1} max={20}
              onChange={(e) => setFormData((p) => ({ ...p, capacity: Number(e.target.value) }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <select className="form-select" value={formData.location}
              onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}>
              {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={formData.status}
              onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}>
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Table"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setDeleteModalOpen(false)}>Cancel</button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <Trash2 size={15} /> Delete Table
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--color-text-muted)' }}>
          Are you sure you want to delete <strong style={{ color: 'var(--color-text)' }}>Table {tableToDelete?.number}</strong>?
          This action cannot be undone and will also affect associated reservations.
        </p>
      </Modal>
    </div>
  );
}
