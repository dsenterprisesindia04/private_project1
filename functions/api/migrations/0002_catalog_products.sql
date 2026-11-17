CREATE TABLE IF NOT EXISTS catalog_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    details TEXT DEFAULT '',
    price REAL,
    stock INTEGER DEFAULT 0,
    gst_rate REAL DEFAULT 0,
    warranty TEXT DEFAULT '',
    image_url TEXT DEFAULT '',
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_catalog_products_active
ON catalog_products (is_active);
