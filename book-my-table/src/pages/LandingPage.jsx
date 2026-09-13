import { Link } from 'react-router-dom';
import { UtensilsCrossed, Star, Clock, MapPin, ArrowRight, Award, ChefHat, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { restaurantInfo } from '../data/initialData';
import './LandingPage.css';

const features = [
  { icon: <Clock size={24} />, title: 'Instant Booking', desc: 'Reserve your table in seconds, any time of day.' },
  { icon: <Star size={24} />, title: 'Premium Experience', desc: 'Every detail curated for an unforgettable evening.' },
  { icon: <ChefHat size={24} />, title: 'World-Class Cuisine', desc: 'Michelin-inspired dishes crafted with seasonal ingredients.' },
  { icon: <Award size={24} />, title: 'Award Winning', desc: 'Recognized as the finest dining experience in the city.' },
];

export default function LandingPage() {
  const { state } = useApp();
  const totalCapacity = state.tables.reduce((s, t) => s + t.capacity, 0);
  const availableTables = state.tables.filter((t) => t.status === 'available').length;

  return (
    <div className="landing-page">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-orb hero-orb-1" />
          <div className="hero-orb hero-orb-2" />
          <div className="hero-orb hero-orb-3" />
        </div>
        <div className="container hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={14} />
            <span>Premium Dining Experience</span>
          </div>
          <h1 className="hero-title">
            Where Every Meal Becomes
            <br />
            <span className="gradient-text">a Cherished Memory</span>
          </h1>
          <p className="hero-subtitle">
            Exceptional cuisine, impeccable service, and an atmosphere that transforms dining into an art form. Reserve your table today.
          </p>
          <div className="hero-actions">
            <Link to="/reservations" className="btn btn-primary btn-lg">
              Reserve a Table <ArrowRight size={18} />
            </Link>
            <Link to="/menu" className="btn btn-secondary btn-lg">
              Explore Menu
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">{state.tables.length}</div>
              <div className="hero-stat-label">Tables</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">{totalCapacity}</div>
              <div className="hero-stat-label">Capacity</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">{availableTables}</div>
              <div className="hero-stat-label">Available Now</div>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <div className="hero-stat-value">4.9★</div>
              <div className="hero-stat-label">Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Info Banner ─────────────────────────────────────────── */}
      <section className="info-banner">
        <div className="container info-banner-inner">
          <div className="info-item">
            <Clock size={16} />
            <span>Open {restaurantInfo.openingTime} – {restaurantInfo.closingTime}</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <MapPin size={16} />
            <span>{restaurantInfo.address}</span>
          </div>
          <div className="info-divider" />
          <div className="info-item">
            <UtensilsCrossed size={16} />
            <span>{restaurantInfo.phone}</span>
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-eyebrow">Why Choose Us</span>
            <h2 className="section-title">An Experience Unlike Any Other</h2>
            <p className="section-subtitle">
              From the moment you walk in, you&apos;ll be enveloped in warmth, elegance, and culinary excellence.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ─────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-orb" />
            <div className="cta-content">
              <span className="section-eyebrow">Ready to Dine?</span>
              <h2 className="cta-title">Reserve Your Table Tonight</h2>
              <p className="cta-subtitle">
                Join thousands of guests who have made unforgettable memories with us.
                Booking takes less than 2 minutes.
              </p>
              <Link to="/reservations" className="btn btn-primary btn-lg">
                Book Now <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <div className="navbar-logo-icon" style={{ width: 32, height: 32 }}>
              <UtensilsCrossed size={16} />
            </div>
            <span className="footer-brand-name">Book My Table</span>
          </div>
          <p className="footer-text">© 2025 Book My Table. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/reservations">Reserve</Link>
            <Link to="/menu">Menu</Link>
            <Link to="/admin">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
