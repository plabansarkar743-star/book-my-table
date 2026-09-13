/**
 * Generate a unique ID
 */
export const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Format a date string (YYYY-MM-DD) to a readable form
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format time string (HH:mm) to 12-hour format
 */
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [hour, minute] = timeStr.split(':').map(Number);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h}:${minute.toString().padStart(2, '0')} ${ampm}`;
};

/**
 * Get today's date as YYYY-MM-DD string
 */
export const todayStr = () => new Date().toISOString().split('T')[0];

/**
 * Check if a table is available for a given date/time/duration
 * considering existing reservations (ignoring cancelled/completed)
 */
export const isTableAvailable = (tableId, date, time, duration = 90, reservations, ignoreId = null) => {
  const [rHour, rMin] = time.split(':').map(Number);
  const rStart = rHour * 60 + rMin;
  const rEnd = rStart + duration;

  return !reservations.some((res) => {
    if (res.id === ignoreId) return false;
    if (res.tableId !== tableId) return false;
    if (res.date !== date) return false;
    if (['cancelled', 'completed'].includes(res.status)) return false;

    const [eHour, eMin] = res.time.split(':').map(Number);
    const eStart = eHour * 60 + eMin;
    const eEnd = eStart + (res.duration || 90);

    // Check overlap
    return rStart < eEnd && rEnd > eStart;
  });
};

/**
 * Get available tables for given criteria
 */
export const getAvailableTables = (tables, reservations, date, time, partySize, duration = 90) => {
  return tables.filter((table) => {
    if (table.status === 'maintenance') return false;
    if (table.capacity < partySize) return false;
    return isTableAvailable(table.id, date, time, duration, reservations);
  });
};

/**
 * Status color mapping
 */
export const STATUS_COLORS = {
  available: { bg: '#10b981', text: '#fff', light: 'rgba(16,185,129,0.15)' },
  occupied: { bg: '#ef4444', text: '#fff', light: 'rgba(239,68,68,0.15)' },
  maintenance: { bg: '#f59e0b', text: '#fff', light: 'rgba(245,158,11,0.15)' },
  pending: { bg: '#8b5cf6', text: '#fff', light: 'rgba(139,92,246,0.15)' },
  confirmed: { bg: '#3b82f6', text: '#fff', light: 'rgba(59,130,246,0.15)' },
  seated: { bg: '#ef4444', text: '#fff', light: 'rgba(239,68,68,0.15)' },
  completed: { bg: '#6b7280', text: '#fff', light: 'rgba(107,114,128,0.15)' },
  cancelled: { bg: '#374151', text: '#9ca3af', light: 'rgba(55,65,81,0.15)' },
};

/**
 * Get reservations for today
 */
export const getTodayReservations = (reservations) => {
  const today = todayStr();
  return reservations.filter((r) => r.date === today && r.status !== 'cancelled');
};

/**
 * Calculate occupancy percentage
 */
export const getOccupancyPercent = (tables) => {
  const active = tables.filter((t) => t.status === 'occupied').length;
  return tables.length > 0 ? Math.round((active / tables.length) * 100) : 0;
};

/**
 * Generate time slots from opening to closing
 */
export const generateTimeSlots = (openingTime = '11:00', closingTime = '23:00', intervalMins = 30) => {
  const slots = [];
  const [openH, openM] = openingTime.split(':').map(Number);
  const [closeH, closeM] = closingTime.split(':').map(Number);
  let current = openH * 60 + openM;
  const end = closeH * 60 + closeM - 90; // Last booking 90min before close

  while (current <= end) {
    const h = Math.floor(current / 60);
    const m = current % 60;
    slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
    current += intervalMins;
  }
  return slots;
};
