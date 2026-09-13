import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import LandingPage from './pages/LandingPage';
import ReservationsPage from './pages/ReservationsPage';
import MenuPage from './pages/MenuPage';
import AdminPage from './pages/AdminPage';
import AdminTablesPage from './pages/AdminTablesPage';
import AdminReservationsPage from './pages/AdminReservationsPage';
import './App.css';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/tables" element={<AdminTablesPage />} />
              <Route path="/admin/reservations" element={<AdminReservationsPage />} />
              {/* 404 fallback */}
              <Route path="*" element={
                <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', minHeight: '100vh' }}>
                  <h1 style={{ fontSize: '4rem' }}>404</h1>
                  <p>Page not found.</p>
                  <a href="/" className="btn btn-primary">Go Home</a>
                </div>
              } />
            </Routes>
          </main>
          <ToastContainer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
