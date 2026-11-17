CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT NOT NULL UNIQUE,
  product TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending approval',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_lookup
ON orders(order_id, phone);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  price REAL,
  active INTEGER NOT NULL DEFAULT 1
);

INSERT OR IGNORE INTO products(name,description,price) VALUES
('Inverter Battery','इन्वर्टर बैटरी',NULL),
('Battery Charger','बैटरी चार्जर',NULL),
('Voltage / Servo Stabilizer','वोल्टेज और सर्वो स्टेबलाइजर',NULL),
('Control Transformer','कंट्रोल ट्रांसफॉर्मर',NULL),
('RO Water Purifier','RO वाटर प्यूरीफायर',NULL),
('Water Cooler','वॉटर कूलर',NULL),
('Welding Machine','वेल्डिंग मशीन',NULL);
