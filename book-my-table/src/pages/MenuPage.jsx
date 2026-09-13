import { useState } from 'react';
import { menuItems } from '../data/initialData';
import './MenuPage.css';

const categories = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [vegOnly, setVegOnly] = useState(false);

  const filtered = menuItems.filter((item) => {
    const catMatch = activeCategory === 'All' || item.category === activeCategory;
    const vegMatch = !vegOnly || item.veg;
    return catMatch && vegMatch;
  });

  const grouped = filtered.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="page menu-page">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">Our Offerings</span>
          <h1 className="menu-title">
            Culinary <span className="gradient-text">Artistry</span>
          </h1>
          <p className="section-subtitle">
            Each dish is a canvas painted with the finest seasonal ingredients, inspired by world cuisines.
          </p>
        </div>

        {/* Filters */}
        <div className="menu-filters">
          <div className="tab-bar">
            {categories.map((c) => (
              <button key={c} className={`tab-btn ${activeCategory === c ? 'active' : ''}`}
                onClick={() => setActiveCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <label className="veg-toggle">
            <input type="checkbox" checked={vegOnly} onChange={(e) => setVegOnly(e.target.checked)} />
            <span className="veg-toggle-track" />
            <span className="veg-label">🌱 Veg Only</span>
          </label>
        </div>

        {/* Menu Sections */}
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="menu-section">
            <h2 className="menu-section-title">{category}</h2>
            <div className="menu-grid">
              {items.map((item, i) => (
                <div key={item.id} className="menu-card" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="menu-card-emoji">{item.image}</div>
                  <div className="menu-card-body">
                    <div className="menu-card-header">
                      <h3 className="menu-card-name">{item.name}</h3>
                      {item.veg && <span className="veg-dot" title="Vegetarian">🟢</span>}
                    </div>
                    <p className="menu-card-desc">{item.description}</p>
                    <div className="menu-card-footer">
                      <span className="menu-card-price">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="menu-card-category">{item.category}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3>No items found</h3>
            <p>Try adjusting your filters.</p>
          </div>
        )}

        {/* Price note */}
        <p className="menu-note">All prices are exclusive of taxes (18% GST applicable). Menu is subject to seasonal availability.</p>
      </div>
    </div>
  );
}
