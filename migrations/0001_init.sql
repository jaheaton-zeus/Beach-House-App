-- Shelter Cove — initial schema.
--
-- There is no password anywhere in this app by design: a person's reservation
-- code is their only credential. Codes are compared case-insensitively, which
-- the unique index on lower(code) both enforces and makes fast.

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  family TEXT NOT NULL CHECK (family IN ('Pierce', 'Thomas')),
  code TEXT NOT NULL,
  super_user INTEGER NOT NULL DEFAULT 0,
  site_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_users_code ON users (lower(code));

-- guest_name / family / code are snapshots taken at booking time so a stay
-- survives the person being removed from the users list.
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  guest_name TEXT NOT NULL,
  family TEXT NOT NULL CHECK (family IN ('Pierce', 'Thomas')),
  code TEXT NOT NULL,
  check_in TEXT NOT NULL,
  check_out TEXT NOT NULL,
  guest_count INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_reservations_dates ON reservations (check_in, check_out);
CREATE INDEX idx_reservations_code ON reservations (lower(code));

CREATE TABLE reservation_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote TEXT NOT NULL CHECK (vote IN ('approve', 'deny')),
  voted_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (reservation_id, user_id)
);

CREATE TABLE family_priority (
  family TEXT PRIMARY KEY CHECK (family IN ('Pierce', 'Thomas')),
  rank INTEGER NOT NULL
);

-- Recommendations: one row per spot, shown on Around the House, Beaches and
-- Bike & Trails filtered by category, and managed in Admin.
CREATE TABLE places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL CHECK (category IN ('Dining', 'Beach', 'Bike & Trails', 'Activities', 'Groceries')),
  name TEXT NOT NULL,
  tag TEXT,
  drive TEXT,
  destination TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_places_category ON places (category, sort_order);

-- The four photo cards in the Local Favorites row on the home page.
CREATE TABLE local_favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  rating TEXT NOT NULL,
  url TEXT NOT NULL,
  image_path TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE house_rules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  text TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE access_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE lights_info (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,
  full_width INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Gallery tiles. col_span / row_span drive the grid; r2_key is NULL until a
-- photo is uploaded for that tile, and the tile renders as an empty slot.
CREATE TABLE gallery_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slot_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  col_span INTEGER NOT NULL DEFAULT 2,
  row_span INTEGER NOT NULL DEFAULT 1,
  r2_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE house_info (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  house_name TEXT NOT NULL,
  location TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER NOT NULL
);
