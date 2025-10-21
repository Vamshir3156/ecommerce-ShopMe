import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
const { hashSync } = bcrypt;
const DB_PATH = process.env.DB_PATH || "./ecom.db";
const db = new Database(DB_PATH);

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
      "Fitness Tracker",
      "Heart-rate, sleep, stress monitoring",
      "/images/tracker.jpg",
      49.99,
      "Wearables",
      60,
      4.1,
    ],

    [
      "p7",
      "Gaming Mouse RGB",
      "High-precision wired gaming mouse with RGB lighting and 7 programmable buttons.",
      "/images/gaming-mouse.jpg",
      79.99,
      "Peripherals",
      50,
      4.7,
    ],

    [
      "p8",
      "Mechanical Watch",
      "Automatic mechanical wristwatch with stainless steel case and leather strap.",
      "/images/mechanical-watch.jpg",
      349.99,
      "Wearables",
      12,
      4.6,
    ],

    [
      "p9",
      'MacBook Pro 16"',
      "M3 chip, Retina display, 16GB RAM, 512GB SSD",
      "/images/macbook.jpg",
      2499.99,
      "Computers",
      8,
      4.8,
    ],
    [
      "p10",
      "Wireless Mouse",
      "Ergonomic wireless mouse with adjustable DPI",
      "/images/mouse.jpg",
      49.99,
      "Peripherals",
      30,
      4.5,
    ],
    [
      "p11",
      "Smartphone X",
      '6.5" OLED, 128GB storage, 48MP camera, 5G',
      "/images/mobile.jpg",
      899.99,
      "Mobiles",
      20,
      4.6,
    ],

    [
      "p12",
      "Gaming Laptop RTX 4070",
      "High-performance gaming laptop with RTX 4070 GPU, 32GB RAM, and 1TB SSD.",
      "/images/gaming-laptop.jpg",
      2799.99,
      "Computers",
      10,
      4.9,
    ],
    [
      "p13",
      "Wireless Earbuds",
      "Noise-canceling Bluetooth earbuds with 24h battery and wireless charging case.",
      "/images/earbuds.jpg",
      149.99,
      "Audio",
      40,
      4.5,
    ],
    [
      "p14",
      "Smart TV 55” 4K UHD",
      "Crystal-clear 4K UHD display with HDR10 and voice assistant support.",
      "/images/smarttv.jpg",
      699.99,
      "Displays",
      15,
      4.6,
    ],
    [
      "p15",
      "Office Chair Ergonomic",
      "Adjustable ergonomic office chair with lumbar support and breathable mesh.",
      "/images/office-chair.jpg",
      229.99,
      "Furniture",
      25,
      4.4,
    ],
    [
      "p16",
      "Power Bank 20000mAh",
      "Fast-charging portable power bank with dual USB-C and LED display.",
      "/images/powerbank.jpg",
      49.99,
      "Accessories",
      60,
      4.3,
    ],
    [
      "p17",
      "Bluetooth Speaker",
      "Room-filling sound, 12h battery, IPX6",
      "/images/speaker.jpg",
      59.99,
      "Audio",
      50,
      4.2,
    ],

    [
      "p18",
      "Leather Jacket",
      "Premium leather with modern fit",
      "/images/jacket.jpg",
      229.0,
      "Apparel",
      8,
      4.6,
    ],
    [
      "p19",
      "Backpack Pro 25L",
      "Durable 25L travel backpack with laptop compartment and water-resistant fabric.",
      "/images/backpack.jpg",
      89.99,
      "Accessories",
      70,
      4.4,
    ],
    [
      "p20",
      "Desk Lamp LED",
      "Adjustable LED desk lamp with touch controls and wireless charging base.",
      "/images/desk-lamp.jpg",
      69.99,
      "Home & Office",
      35,
      4.5,
    ],
  ];
  for (const p of items) insertProduct.run(...p);
}

export default db;
