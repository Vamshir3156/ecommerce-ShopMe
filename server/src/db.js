import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
const { hashSync } = bcrypt;

const db = new Database("ecom.db");

db.exec(`
PRAGMA journal_mode = WAL;
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  price REAL NOT NULL,
  category TEXT,
  stock INTEGER DEFAULT 10,
  rating REAL DEFAULT 4.5,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  items_json TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

const userCount = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
if (userCount === 0) {
  const insertUser = db.prepare(
    "INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)"
  );
  insertUser.run(
    "u_admin",
    "Admin",
    "admin@shop.dev",
    hashSync("Admin@123", 10),
    "admin"
  );
  insertUser.run(
    "u_demo",
    "Demo User",
    "demo@shop.dev",
    hashSync("Demo@123", 10),
    "user"
  );
}

const productCount = db.prepare("SELECT COUNT(*) as c FROM products").get().c;
if (productCount === 0) {
  const insertProduct = db.prepare(
    "INSERT INTO products (id, title, description, image, price, category, stock, rating) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
  );
  const items = [
    [
      "p1",
      "Noise-Canceling Headphones",
      "Immersive sound with ANC and 30h battery",
      "/images/headphones.jpg",
      199.99,
      "Audio",
      25,
      4.7,
    ],
    [
      "p2",
      "Mechanical Keyboard",
      "Hot-swappable switches, RGB, compact 75%",
      "/images/keyboard.jpg",
      129.0,
      "Peripherals",
      18,
      4.6,
    ],
    [
      "p3",
      '4K Monitor 27"',
      "IPS, HDR400, 144Hz for pro work and play",
      "/images/monitor.jpg",
      349.0,
      "Displays",
      12,
      4.5,
    ],
    [
      "p4",
      "Smart Watch",
      "GPS, SpO2, 7-day battery, swim-proof",
      "/images/watch.jpg",
      179.0,
      "Wearables",
      32,
      4.4,
    ],
    [
      "p5",
      "Running Shoes",
      "Breathable knit upper, responsive foam",
      "/images/shoes.jpg",
      89.5,
      "Apparel",
      40,
      4.3,
    ],
    [
      "p6",
      "Bluetooth Speaker",
      "Room-filling sound, 12h battery, IPX6",
      "/images/speaker.jpg",
      59.99,
      "Audio",
      50,
      4.2,
    ],
    [
      "p7",
      "Fitness Tracker",
      "Heart-rate, sleep, stress monitoring",
      "/images/tracker.jpg",
      49.99,
      "Wearables",
      60,
      4.1,
    ],
    [
      "p8",
      "Leather Jacket",
      "Premium leather with modern fit",
      "/images/jacket.jpg",
      229.0,
      "Apparel",
      8,
      4.6,
    ],
  ];
  for (const p of items) insertProduct.run(...p);
}

export default db;
