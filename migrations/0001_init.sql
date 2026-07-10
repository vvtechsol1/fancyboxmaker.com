-- Cloudflare D1 schema for FancyBoxMaker live data storage.
-- Only runtime writes (customer orders + quote requests) need a database;
-- the product catalogue stays bundled as read-only data.

CREATE TABLE IF NOT EXISTS orders (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ref        TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  data       TEXT NOT NULL   -- full JSON payload (items, shipping, totals…)
);

CREATE TABLE IF NOT EXISTS quotes (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ref        TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL,
  name       TEXT,
  email      TEXT,
  phone      TEXT,
  data       TEXT NOT NULL   -- full JSON payload (box specs, requirements…)
);

CREATE INDEX IF NOT EXISTS idx_orders_created ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_created ON quotes (created_at DESC);
