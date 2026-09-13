import { useState } from 'react';
import { Search, Calendar, Users, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ACTIONS } from '../context/AppContext';
import {
  getAvailableTables, generateTimeSlots, todayStr, formatDate, formatTime,
} from '../utils/helpers';
import { restaurantInfo } from '../data/initialData';
import TableCard from '../components/TableCard';
import ReservationCard from '../components/ReservationCard';
import './ReservationsPage.css';
import '../components/ReservationCard.css';

const STEPS = ['Search', 'Select Table', 'Your Details', 'Confirmed'];

export default function ReservationsPage() {
  const { state, dispatch, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('book'); // 'book' | 'mybookings'
  const [step, setStep] = useState(0);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupResult, setLookupResult] = useState(null);
  const [confirmedId, setConfirmedId] = useState(null);

  // Search criteria
  const [criteria, setCriteria] = useState({
    date: todayStr(),
    time: '19:00',
    partySize: 2,
    duration: 90,
  });

  // Selected table
  const [selectedTable, setSelectedTable] = useState(null);

  // Customer form
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const timeSlots = generateTimeSlots(restaurantInfo.openingTime, restaurantInfo.closingTime);
  const availableTables = getAvailableTables(
    state.tables, state.reservations,
    criteria.date, criteria.time, criteria.partySize, criteria.duration
  );

  const handleSearch = () => {
    if (!criteria.date || !criteria.time) {
      addToast('Please select date and time.', 'warning');
      return;
    }
    setStep(1);
  };

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setStep(2);
  };

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.customerEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.customerEmail = 'Valid email required';
    if (!form.customerPhone.trim()) errs.customerPhone = 'Phone is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const payload = { ...form, ...criteria, tableId: selectedTable.id };
      dispatch({ type: ACTIONS.ADD_RESERVATION, payload });
      // Get the id of the just-added reservation
      const newId = state.reservations.length; // we'll use a different approach
      setConfirmedId(form.customerEmail);
      setStep(3);
      setIsSubmitting(false);
      addToast('Reservation submitted! We will confirm shortly.', 'success');
    }, 800);
  };

  const handleLookup = (e) => {
    e.preventDefault();
    const results = state.reservations.filter(
      (r) => r.customerEmail.toLowerCase() === lookupEmail.toLowerCase()
    );
    setLookupResult(results);
  };

  const handleCancel = (id) => {
    dispatch({ type: ACTIONS.CANCEL_RESERVATION, payload: id });
    addToast('Reservation cancelled.', 'info');
    // Refresh lookup
    setLookupResult((prev) => prev.map((r) => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const resetFlow = () => {
    setStep(0);
    setSelectedTable(null);
    setForm({ customerName: '', customerEmail: '', customerPhone: '', specialRequests: '' });
    setConfirmedId(null);
    setCriteria({ date: todayStr(), time: '19:00', partySize: 2, duration: 90 });
  };

  return (
    <div className="page res-page">
      <div className="container">
        <div className="res-page-header">
          <span className="section-eyebrow">Book Your Experience</span>
          <h1 className="res-page-title">Restaurant Reservations</h1>
          <p className="text-muted">Select your date, time, and party size to find the perfect table.</p>
        </div>

        {/* Tab Bar */}
        <div className="tab-bar-wrap">
          <div className="tab-bar">
            <button className={`tab-btn ${activeTab === 'book' ? 'active' : ''}`} onClick={() => { setActiveTab('book'); resetFlow(); }}>
              Make a Reservation
            </button>
            <button className={`tab-btn ${activeTab === 'mybookings' ? 'active' : ''}`} onClick={() => setActiveTab('mybookings')}>
              My Bookings
            </button>
          </div>
        </div>

        {activeTab === 'book' && (
          <div className="res-flow">
            {/* Step Indicator */}
            {step < 3 && (
              <div className="step-indicator">
                {STEPS.slice(0, 3).map((s, i) => (
                  <div key={i} className={`step-item ${i <= step ? 'step-active' : ''} ${i < step ? 'step-done' : ''}`}>
                    <div className="step-circle">
                      {i < step ? <CheckCircle size={16} /> : <span>{i + 1}</span>}
                    </div>
                    <span className="step-label">{s}</span>
                    {i < 2 && <div className="step-line" />}
                  </div>
                ))}
              </div>
            )}

            {/* Step 0: Search */}
            {step === 0 && (
              <div className="glass-card res-search animate-fade-in">
                <h2 className="res-search-title">Find Your Table</h2>
                <div className="res-search-grid">
                  <div className="form-group">
                    <label className="form-label"><Calendar size={13} /> Date</label>
                    <input type="date" className="form-input" min={todayStr()} value={criteria.date}
                      onChange={(e) => setCriteria((p) => ({ ...p, date: e.target.value }))} />
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Clock size={13} /> Time</label>
                    <select className="form-select" value={criteria.time}
                      onChange={(e) => setCriteria((p) => ({ ...p, time: e.target.value }))}>
                      {timeSlots.map((t) => (
                        <option key={t} value={t}>{formatTime(t)}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Users size={13} /> Party Size</label>
                    <select className="form-select" value={criteria.partySize}
                      onChange={(e) => setCriteria((p) => ({ ...p, partySize: Number(e.target.value) }))}>
                      {Array.from({ length: restaurantInfo.maxPartySize }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label"><Clock size={13} /> Duration</label>
                    <select className="form-select" value={criteria.duration}
                      onChange={(e) => setCriteria((p) => ({ ...p, duration: Number(e.target.value) }))}>
                      {[60, 90, 120, 150, 180].map((d) => (
                        <option key={d} value={d}>{d} minutes</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button className="btn btn-primary btn-lg res-search-btn" onClick={handleSearch}>
                  <Search size={18} /> Check Availability
                </button>
              </div>
            )}

            {/* Step 1: Table Selection */}
            {step === 1 && (
              <div className="animate-fade-in">
                <div className="res-step-header">
                  <div>
                    <h2>Select a Table</h2>
                    <p className="text-muted">
                      {formatDate(criteria.date)} · {formatTime(criteria.time)} · {criteria.partySize} guests
                    </p>
                  </div>
                  <button className="btn btn-ghost" onClick={() => setStep(0)}>← Change Search</button>
                </div>

                {availableTables.length === 0 ? (
                  <div className="empty-state glass-card">
                    <div className="empty-state-icon">🪑</div>
                    <h3>No Tables Available</h3>
                    <p>No tables match your criteria. Try a different time or party size.</p>
                    <button className="btn btn-secondary mt-4" onClick={() => setStep(0)}>Adjust Search</button>
                  </div>
                ) : (
                  <>
                    <p className="res-available-count">{availableTables.length} table{availableTables.length !== 1 ? 's' : ''} available</p>
                    <div className="res-tables-grid">
                      {availableTables.map((t) => (
                        <TableCard key={t.id} table={t} isAvailable={true} onSelect={handleTableSelect} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Customer Details */}
            {step === 2 && selectedTable && (
              <div className="animate-fade-in res-form-layout">
                <div>
                  <div className="res-step-header">
                    <div>
                      <h2>Your Details</h2>
                      <p className="text-muted">Almost there! Fill in your contact info.</p>
                    </div>
                    <button className="btn btn-ghost" onClick={() => setStep(1)}>← Change Table</button>
                  </div>

                  <form className="res-customer-form glass-card" onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className={`form-input ${errors.customerName ? 'input-error' : ''}`}
                        placeholder="Priya Sharma" value={form.customerName}
                        onChange={(e) => setForm((p) => ({ ...p, customerName: e.target.value }))} />
                      {errors.customerName && <span className="form-error">{errors.customerName}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input type="email" className={`form-input ${errors.customerEmail ? 'input-error' : ''}`}
                        placeholder="priya@email.com" value={form.customerEmail}
                        onChange={(e) => setForm((p) => ({ ...p, customerEmail: e.target.value }))} />
                      {errors.customerEmail && <span className="form-error">{errors.customerEmail}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input type="tel" className={`form-input ${errors.customerPhone ? 'input-error' : ''}`}
                        placeholder="+91 98765 43210" value={form.customerPhone}
                        onChange={(e) => setForm((p) => ({ ...p, customerPhone: e.target.value }))} />
                      {errors.customerPhone && <span className="form-error">{errors.customerPhone}</span>}
                    </div>
                    <div className="form-group">
                      <label className="form-label">Special Requests (Optional)</label>
                      <textarea className="form-textarea"
                        placeholder="Dietary restrictions, seating preferences, celebrations..."
                        value={form.specialRequests}
                        onChange={(e) => setForm((p) => ({ ...p, specialRequests: e.target.value }))} />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? <><div className="spinner" /> Submitting...</> : <>Confirm Reservation <ChevronRight size={16} /></>}
                    </button>
                  </form>
                </div>

                {/* Summary */}
                <div className="res-booking-summary glass-card">
                  <h3>Booking Summary</h3>
                  <div className="summary-items">
                    <div className="summary-item"><span>Date</span><strong>{formatDate(criteria.date)}</strong></div>
                    <div className="summary-item"><span>Time</span><strong>{formatTime(criteria.time)}</strong></div>
                    <div className="summary-item"><span>Duration</span><strong>{criteria.duration} min</strong></div>
                    <div className="summary-item"><span>Guests</span><strong>{criteria.partySize}</strong></div>
                    <div className="summary-item"><span>Table</span><strong>Table {selectedTable.number}</strong></div>
                    <div className="summary-item"><span>Location</span><strong>{selectedTable.location}</strong></div>
                    <div className="summary-item"><span>Capacity</span><strong>{selectedTable.capacity} seats</strong></div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="res-confirmed glass-card animate-scale-in">
                <div className="confirmed-icon">🎉</div>
                <h2>Reservation Submitted!</h2>
                <p>Thank you! Your reservation request has been received. We&apos;ll confirm via email shortly.</p>
                <div className="confirmed-details">
                  <div className="summary-item"><span>Date</span><strong>{formatDate(criteria.date)}</strong></div>
                  <div className="summary-item"><span>Time</span><strong>{formatTime(criteria.time)}</strong></div>
                  <div className="summary-item"><span>Table</span><strong>Table {selectedTable?.number}</strong></div>
                  <div className="summary-item"><span>Guests</span><strong>{criteria.partySize}</strong></div>
                </div>
                <div className="confirmed-actions">
                  <button className="btn btn-primary" onClick={resetFlow}>Make Another Reservation</button>
                  <button className="btn btn-secondary" onClick={() => { setActiveTab('mybookings'); setLookupEmail(form.customerEmail); }}>
                    View My Bookings
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'mybookings' && (
          <div className="res-flow animate-fade-in">
            <div className="glass-card res-lookup">
              <h2>Find Your Bookings</h2>
              <p className="text-muted">Enter your email address to view your reservations.</p>
              <form className="res-lookup-form" onSubmit={handleLookup}>
                <input type="email" className="form-input" placeholder="your@email.com"
                  value={lookupEmail} onChange={(e) => setLookupEmail(e.target.value)} required />
                <button type="submit" className="btn btn-primary"><Search size={16} /> Look Up</button>
              </form>
            </div>

            {lookupResult !== null && (
              <div className="res-lookup-results animate-fade-in">
                {lookupResult.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h3>No Reservations Found</h3>
                    <p>No reservations found for this email address.</p>
                  </div>
                ) : (
                  <>
                    <h3>{lookupResult.length} Reservation{lookupResult.length !== 1 ? 's' : ''} Found</h3>
                    <div className="res-results-grid">
                      {lookupResult.map((r) => {
                        const table = state.tables.find((t) => t.id === r.tableId);
                        return (
                          <ReservationCard key={r.id} reservation={r} table={table}
                            onCancel={handleCancel} isCustomerView={true} />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
