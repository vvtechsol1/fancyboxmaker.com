-- Cloudflare D1 — admin-editable taxonomy (categories). Single row, key='categories'.
CREATE TABLE IF NOT EXISTS taxonomy (
  key  TEXT PRIMARY KEY,
  data TEXT NOT NULL
);
