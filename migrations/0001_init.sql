-- 0001_init.sql
-- Shelter Cove Beach House Reservation App — initial schema

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  -- NOTE: interim plaintext password for the mock login screen only.
  -- This is a temporary stand-in until Cloudflare Access replaces app-level
  -- login entirely. Do not build on top of this as a long-term auth pattern.
  password TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  avatar TEXT,
  family TEXT NOT NULL CHECK (family IN ('Pierce', 'Thomas')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  check_in TEXT NOT NULL,       -- ISO date, e.g. 2026-05-13
  check_out TEXT NOT NULL,
  guests_json TEXT NOT NULL DEFAULT '[]',  -- JSON array of guest name strings
  guest_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE reservation_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id),
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'deny')),
  voted_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (reservation_id, user_id)
);

CREATE TABLE priority_periods (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  family TEXT NOT NULL CHECK (family IN ('Pierce', 'Thomas')),
  start_date TEXT NOT NULL,     -- ISO date, inclusive
  end_date TEXT NOT NULL,       -- ISO date, inclusive
  label TEXT
);

CREATE TABLE house_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),  -- single-row settings table
  house_name TEXT NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL,
  unit TEXT,
  gate_code TEXT,
  wifi_name TEXT,
  wifi_password TEXT,
  parking TEXT,
  address TEXT,
  amenities_json TEXT NOT NULL DEFAULT '[]'  -- JSON array of strings
);

CREATE TABLE house_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE checkout_checklist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE supplies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('good', 'low', 'out')),
  count_label TEXT,             -- free text like "8 rolls" or "Half bottle"
  essential INTEGER NOT NULL DEFAULT 0,  -- boolean 0/1
  updated_by INTEGER REFERENCES users(id),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE local_recs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,       -- Dining, Beach, Bike & Trails, Activities, Groceries
  name TEXT NOT NULL,
  note TEXT,
  tag TEXT,
  walk TEXT,                    -- e.g. "5 min walk", "10 min drive"
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,       -- Views, Living, Kitchen, Bedrooms, Bathrooms, Parking & Access
  file_path TEXT NOT NULL,      -- served from /public/photos/... in v1
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX idx_priority_dates ON priority_periods(start_date, end_date);
CREATE INDEX idx_supplies_status ON supplies(status);
