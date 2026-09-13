import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { initialTables, initialReservations } from '../data/initialData';
import { generateId } from '../utils/helpers';

// ─── Storage Keys ────────────────────────────────────────────────────────────
const STORAGE_KEY_TABLES = 'bmt_tables';
const STORAGE_KEY_RESERVATIONS = 'bmt_reservations';

const loadFromStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
};

// ─── Actions ─────────────────────────────────────────────────────────────────
export const ACTIONS = {
  ADD_RESERVATION: 'ADD_RESERVATION',
  UPDATE_RESERVATION: 'UPDATE_RESERVATION',
  CANCEL_RESERVATION: 'CANCEL_RESERVATION',
  DELETE_RESERVATION: 'DELETE_RESERVATION',
  ADD_TABLE: 'ADD_TABLE',
  UPDATE_TABLE: 'UPDATE_TABLE',
  DELETE_TABLE: 'DELETE_TABLE',
  UPDATE_TABLE_STATUS: 'UPDATE_TABLE_STATUS',
};

// ─── Reducer ─────────────────────────────────────────────────────────────────
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_RESERVATION: {
      const reservation = {
        ...action.payload,
        id: generateId(),
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      return { ...state, reservations: [...state.reservations, reservation] };
    }
    case ACTIONS.UPDATE_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.id === action.payload.id ? { ...r, ...action.payload } : r
        ),
      };
    case ACTIONS.CANCEL_RESERVATION:
      return {
        ...state,
        reservations: state.reservations.map((r) =>
          r.id === action.payload ? { ...r, status: 'cancelled' } : r
        ),
      };
    case ACTIONS.DELETE_RESERVATION:
      return { ...state, reservations: state.reservations.filter((r) => r.id !== action.payload) };
    case ACTIONS.ADD_TABLE: {
      const table = { ...action.payload, id: generateId() };
      return { ...state, tables: [...state.tables, table] };
    }
    case ACTIONS.UPDATE_TABLE:
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.id ? { ...t, ...action.payload } : t
        ),
      };
    case ACTIONS.DELETE_TABLE:
      return { ...state, tables: state.tables.filter((t) => t.id !== action.payload) };
    case ACTIONS.UPDATE_TABLE_STATUS:
      return {
        ...state,
        tables: state.tables.map((t) =>
          t.id === action.payload.id ? { ...t, status: action.payload.status } : t
        ),
      };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, () => ({
    tables: loadFromStorage(STORAGE_KEY_TABLES, initialTables),
    reservations: loadFromStorage(STORAGE_KEY_RESERVATIONS, initialReservations),
  }));

  const [toasts, setToasts] = useState([]);

  // Persist to localStorage
  useEffect(() => { saveToStorage(STORAGE_KEY_TABLES, state.tables); }, [state.tables]);
  useEffect(() => { saveToStorage(STORAGE_KEY_RESERVATIONS, state.reservations); }, [state.reservations]);

  const addToast = useCallback((message, type = 'success') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, toasts, addToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
