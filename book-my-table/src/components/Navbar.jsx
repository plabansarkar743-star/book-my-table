import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { UtensilsCrossed, Menu, X, ShieldCheck } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/reservations', label: 'Reserve' },
    { to: '/menu', label: 'Menu' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="navbar-logo-icon">
            <UtensilsCrossed size={18} />
          </div>
          <span className="navbar-logo-text">Book My Table</span>
        </Link>

        {/* Desktop Nav */}
        <ul className="navbar-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="navbar-actions">
          <Link to="/admin" className="btn btn-secondary btn-sm">
            <ShieldCheck size={15} /> Admin
          </Link>
          <Link to="/reservations" className="btn btn-primary btn-sm">
            Book a Table
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button className="navbar-hamburger" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`navbar-drawer ${open ? 'open' : ''}`}>
        <ul className="navbar-drawer-links">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `navbar-drawer-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/admin" className="navbar-drawer-link" onClick={() => setOpen(false)}>
              Admin Panel
            </Link>
          </li>
          <li>
            <Link to="/reservations" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} onClick={() => setOpen(false)}>
              Book a Table
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
