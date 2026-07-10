-- Cloudflare D1 — site settings (CMS). Single row, key = 'site', data = JSON blob.
CREATE TABLE IF NOT EXISTS settings (
  key  TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
