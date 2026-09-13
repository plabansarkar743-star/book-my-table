# 🍽️ Book My Table

> A premium **Restaurant Reservation & Table Management System** built with React 18 + Vite.

![Book My Table](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=flat&logo=reactrouter)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## ✨ Features

### 👥 Customer Features
| Feature | Description |
|---------|-------------|
| 📅 **Smart Availability Search** | Filter tables by date, time, party size, and duration |
| 🪑 **Interactive Table Selection** | Browse available tables with visual seat indicators |
| 📝 **Multi-Step Reservation Form** | Step-by-step booking with validation |
| 🔍 **Booking Lookup** | Find your reservations by email address |
| ❌ **Cancel Reservations** | Self-cancel pending or confirmed bookings |
| 🍽️ **Menu Showcase** | Browse the full menu with category filters and veg toggle |

### 🔧 Admin Features
| Feature | Description |
|---------|-------------|
| 🔒 **PIN-Protected Access** | Secure admin panel (default PIN: `1234`) |
| 📊 **Dashboard KPIs** | Real-time stats: today's bookings, pending, seated, occupancy |
| 🗺️ **Visual Floor Plan** | Color-coded table layout with live occupancy |
| ➕ **Table Management** | Add, edit, delete tables; toggle status (available/occupied/maintenance) |
| 📋 **Reservation Management** | View all reservations with search, filter by status/date, sort |
| ✅ **Workflow Actions** | Confirm → Seat → Complete reservation lifecycle |
| 🗑️ **Cleanup** | Bulk-delete cancelled reservations |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

```bash
# 1. Navigate to the project
cd book-my-table

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
book-my-table/
├── public/
│   └── favicon.svg
├── src/
│   ├── context/
│   │   └── AppContext.jsx       # Global state (useReducer + Context API)
│   ├── data/
│   │   └── initialData.js       # Seed data: tables, reservations, menu, restaurant info
│   ├── hooks/
│   │   └── useLocalStorage.js   # localStorage persistence hook
│   ├── utils/
│   │   └── helpers.js           # Date/time helpers, availability checker, status colors
│   ├── components/
│   │   ├── Navbar.jsx / .css    # Responsive navbar with mobile drawer
│   │   ├── Modal.jsx            # Reusable modal with backdrop
│   │   ├── Toast.jsx            # Toast notification system
│   │   ├── StatusBadge.jsx      # Color-coded status pill
│   │   ├── TableCard.jsx / .css # Table card with selection and status controls
│   │   ├── ReservationCard.jsx / .css     # Customer-facing booking card
│   │   ├── AdminReservationRow.jsx / .css # Admin reservation row with actions
│   │   └── FloorPlan.jsx / .css # Visual floor plan grouped by location
│   ├── pages/
│   │   ├── LandingPage.jsx / .css          # Hero, features, CTA
│   │   ├── ReservationsPage.jsx / .css     # Multi-step reservation flow + lookup
│   │   ├── MenuPage.jsx / .css             # Menu with category filter + veg toggle
│   │   ├── AdminPage.jsx / .css            # PIN auth + dashboard
│   │   ├── AdminTablesPage.jsx / .css      # Table CRUD + floor plan
│   │   └── AdminReservationsPage.jsx / .css # All reservations with filters
│   ├── App.jsx                  # Router + layout
│   ├── App.css                  # App-level styles (toasts, modals)
│   ├── index.css                # Global design system (CSS custom properties)
│   └── main.jsx                 # React entry point
├── index.html                   # HTML shell with SEO meta
├── package.json
├── vite.config.js
└── README.md
```

---

## 🏗️ Architecture

### State Management
- **Context API + useReducer** for global state
- **localStorage** persistence — all data survives page refresh
- No backend required — runs entirely in the browser

### State Shape
```js
{
  tables: Table[],           // All restaurant tables
  reservations: Reservation[] // All bookings
}
```

### Reservation Lifecycle
```
pending → confirmed → seated → completed
       ↘                             
         cancelled (at any stage)
```

### Data Flow
```
AppContext (useReducer)
    ↓ dispatch(ACTION)
  appReducer → new state
    ↓
  useEffect → localStorage
    ↓
  Components re-render
```

---

## 🎨 Design System

Built with a custom **dark glassmorphism** theme:

| Token | Value |
|-------|-------|
| Primary color | `#c9a96e` (warm gold) |
| Background | `#080b14` (deep navy) |
| Surface | `#0f1420` |
| Glass blur | `blur(20px)` |
| Font | Inter + Playfair Display |
| Border radius | `6px` – `28px` |
| Animations | fade-in, float, pulse-glow, shimmer |

---

## 🛣️ Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Landing | Hero, features, stats |
| `/reservations` | Reservations | Book a table / lookup |
| `/menu` | Menu | Full menu with filters |
| `/admin` | Admin Dashboard | PIN auth + KPIs |
| `/admin/tables` | Table Manager | CRUD + floor plan |
| `/admin/reservations` | Booking Manager | All reservations |

---

## 🔐 Admin Access

Default PIN: **`1234`**

Navigate to `/admin` and enter the PIN to access the management panel.

> **Note**: The PIN is stored in `src/data/initialData.js` and can be changed by modifying `restaurantInfo.adminPin`.

---

## 📦 Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.x | UI framework |
| `react-dom` | 18.x | DOM rendering |
| `react-router-dom` | 6.x | Client-side routing |
| `lucide-react` | latest | Icon library |
| `date-fns` | latest | Date utilities |
| `vite` | 5.x | Build tool + dev server |

---

## 🧪 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

---

## 📸 Pages Overview

### 🏠 Landing Page
- Animated gradient hero with floating orbs
- Live restaurant stats (tables, capacity, availability)
- Feature highlights with hover animations
- Call-to-action section

### 📅 Reservations Page
- **Step 1**: Date, time, party size, duration picker
- **Step 2**: Available table cards with seat indicators
- **Step 3**: Customer form with validation
- **Step 4**: Booking confirmation screen
- **My Bookings tab**: Email lookup for existing reservations

### 🍽️ Menu Page
- Category filters (All / Starters / Mains / Desserts / Drinks)
- Vegetarian-only toggle
- Animated menu cards with emoji, description, and price

### 🔒 Admin Dashboard
- PIN-protected access
- 4 KPI cards with live data
- Today's upcoming reservations
- Table status overview (all 12 tables)
- Quick stats summary

### 🗺️ Table Management
- Grid view: all tables grouped by location with status controls
- Floor plan view: color-coded visual layout
- Add/Edit/Delete table modals

### 📋 Reservation Management
- Full list with search (name/email/phone)
- Filter by status (pending/confirmed/seated/completed/cancelled)
- Date filter + sort options
- Inline action buttons per reservation lifecycle stage
- Bulk-delete cancelled reservations

---

## 🌟 Data Persistence

All data is stored in **browser localStorage**:
- `bmt_tables` — table definitions and statuses
- `bmt_reservations` — all reservation records

The app ships with **seed data**: 12 pre-configured tables (2–12 person capacity) and 4 sample reservations across today, tomorrow, and the day after.

To reset to seed data, clear localStorage:
```js
localStorage.removeItem('bmt_tables');
localStorage.removeItem('bmt_reservations');
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with ❤️ using React 18 + Vite
</p>
