import { generateId } from '../utils/helpers';

export const restaurantInfo = {
  name: 'Book My Table',
  tagline: 'An Exquisite Dining Experience',
  address: '42 Gourmet Lane, Culinary District, Mumbai 400001',
  phone: '+91 98765 43210',
  email: 'reservations@bookmytable.in',
  openingTime: '11:00',
  closingTime: '23:00',
  maxPartySize: 12,
  adminPin: '1234',
};

export const initialTables = [
  { id: 't1', number: 1, capacity: 2, status: 'available', location: 'Window', posX: 10, posY: 10 },
  { id: 't2', number: 2, capacity: 2, status: 'available', location: 'Window', posX: 20, posY: 10 },
  { id: 't3', number: 3, capacity: 4, status: 'available', location: 'Main Hall', posX: 35, posY: 10 },
  { id: 't4', number: 4, capacity: 4, status: 'available', location: 'Main Hall', posX: 50, posY: 10 },
  { id: 't5', number: 5, capacity: 4, status: 'available', location: 'Main Hall', posX: 65, posY: 10 },
  { id: 't6', number: 6, capacity: 6, status: 'available', location: 'Centre', posX: 10, posY: 40 },
  { id: 't7', number: 7, capacity: 6, status: 'available', location: 'Centre', posX: 30, posY: 40 },
  { id: 't8', number: 8, capacity: 6, status: 'maintenance', location: 'Centre', posX: 50, posY: 40 },
  { id: 't9', number: 9, capacity: 8, status: 'available', location: 'Private', posX: 70, posY: 40 },
  { id: 't10', number: 10, capacity: 8, status: 'available', location: 'Private', posX: 10, posY: 70 },
  { id: 't11', number: 11, capacity: 10, status: 'available', location: 'Banquet', posX: 35, posY: 70 },
  { id: 't12', number: 12, capacity: 12, status: 'available', location: 'Banquet', posX: 65, posY: 70 },
];

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
const dayAfter = new Date(today); dayAfter.setDate(today.getDate() + 2);

export const initialReservations = [
  {
    id: generateId(),
    tableId: 't3',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@email.com',
    customerPhone: '+91 98001 11111',
    partySize: 3,
    date: fmt(today),
    time: '19:00',
    duration: 90,
    status: 'confirmed',
    specialRequests: 'Window seat preferred, anniversary dinner',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    tableId: 't6',
    customerName: 'Rahul Verma',
    customerEmail: 'rahul.v@email.com',
    customerPhone: '+91 98002 22222',
    partySize: 5,
    date: fmt(today),
    time: '20:00',
    duration: 90,
    status: 'seated',
    specialRequests: 'Vegetarian menu only',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    tableId: 't9',
    customerName: 'Ananya Patel',
    customerEmail: 'ananya.p@email.com',
    customerPhone: '+91 98003 33333',
    partySize: 7,
    date: fmt(tomorrow),
    time: '13:00',
    duration: 120,
    status: 'pending',
    specialRequests: 'Birthday celebration, cake arranged',
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    tableId: 't11',
    customerName: 'Vikram Singh',
    customerEmail: 'vikram.s@email.com',
    customerPhone: '+91 98004 44444',
    partySize: 9,
    date: fmt(dayAfter),
    time: '19:30',
    duration: 150,
    status: 'confirmed',
    specialRequests: 'Corporate dinner, projector needed',
    createdAt: new Date().toISOString(),
  },
];

export const menuItems = [
  // Starters
  { id: 'm1', category: 'Starters', name: 'Truffle Arancini', description: 'Crispy risotto balls with black truffle and parmesan', price: 680, image: '🍱', veg: true },
  { id: 'm2', category: 'Starters', name: 'Seared Scallops', description: 'Pan-seared scallops with cauliflower purée and crispy pancetta', price: 950, image: '🦪', veg: false },
  { id: 'm3', category: 'Starters', name: 'Burrata Caprese', description: 'Fresh burrata with heirloom tomatoes and basil oil', price: 720, image: '🧀', veg: true },
  { id: 'm4', category: 'Starters', name: 'Duck Liver Pâté', description: 'Silky duck liver pâté with brioche toast and fig jam', price: 820, image: '🍞', veg: false },

  // Mains
  { id: 'm5', category: 'Mains', name: 'Wagyu Beef Tenderloin', description: 'A5 Wagyu with truffle jus, asparagus and potato gratin', price: 3200, image: '🥩', veg: false },
  { id: 'm6', category: 'Mains', name: 'Lobster Thermidor', description: 'Whole lobster in rich Cognac cream with gruyère crust', price: 2800, image: '🦞', veg: false },
  { id: 'm7', category: 'Mains', name: 'Mushroom Risotto', description: 'Wild mushroom risotto with aged parmesan and truffle oil', price: 1100, image: '🍄', veg: true },
  { id: 'm8', category: 'Mains', name: 'Pan-Roasted Duck Breast', description: 'Confit duck leg with cherry reduction and dauphinoise potatoes', price: 1850, image: '🍗', veg: false },
  { id: 'm9', category: 'Mains', name: 'Herb-Crusted Lamb Rack', description: 'New Zealand lamb with Dijon crust, mint jus and ratatouille', price: 2400, image: '🍖', veg: false },
  { id: 'm10', category: 'Mains', name: 'Mezze Platter (V)', description: 'Hummus, falafel, baba ganoush, pita and seasonal salads', price: 1400, image: '🥗', veg: true },

  // Desserts
  { id: 'm11', category: 'Desserts', name: 'Chocolate Fondant', description: 'Warm dark chocolate fondant with vanilla bean ice cream', price: 620, image: '🍫', veg: true },
  { id: 'm12', category: 'Desserts', name: 'Crème Brûlée', description: 'Classic vanilla crème brûlée with caramelised sugar crust', price: 540, image: '🍮', veg: true },
  { id: 'm13', category: 'Desserts', name: 'Mango Panna Cotta', description: 'Silky panna cotta with Alphonso mango coulis', price: 480, image: '🥭', veg: true },
  { id: 'm14', category: 'Desserts', name: 'Cheese Board', description: 'Selection of 5 artisan cheeses with accompaniments', price: 980, image: '🧀', veg: true },

  // Drinks
  { id: 'm15', category: 'Drinks', name: 'Signature Negroni', description: 'Gin, Campari, sweet vermouth with orange peel', price: 680, image: '🍸', veg: true },
  { id: 'm16', category: 'Drinks', name: 'Mocktail Garden', description: 'Fresh cucumber, mint, elderflower and sparkling water', price: 380, image: '🍹', veg: true },
  { id: 'm17', category: 'Drinks', name: 'Dom Pérignon', description: 'Vintage Champagne — per glass', price: 2400, image: '🍾', veg: true },
  { id: 'm18', category: 'Drinks', name: 'Single Malt Whisky', description: 'Glenfiddich 18 Year — neat or on the rocks', price: 1200, image: '🥃', veg: true },
];
