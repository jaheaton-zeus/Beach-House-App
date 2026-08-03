-- 0002_seed.sql
-- Seed data migrated from the Claude Design prototype (app-data.js)

INSERT INTO users (id, name, email, password, role, avatar, family) VALUES
  (1, 'Sarah Pierce', 'sarah@family.com', 'pierce123', 'admin', 'SP', 'Pierce'),
  (2, 'Mike Pierce', 'mike@family.com', 'pierce123', 'member', 'MP', 'Pierce'),
  (3, 'Linda Thomas', 'linda@family.com', 'thomas123', 'admin', 'LT', 'Thomas'),
  (4, 'James Thomas', 'james@family.com', 'thomas123', 'member', 'JT', 'Thomas'),
  (5, 'Emma Pierce', 'emma@family.com', 'pierce123', 'member', 'EP', 'Pierce');

INSERT INTO reservations (id, user_id, check_in, check_out, guests_json, guest_count, status, notes, created_at) VALUES
  (1, 2, '2026-05-13', '2026-05-20', '["Mike Pierce", "Karen Pierce", "Tommy Pierce"]', 3, 'approved', 'Kids'' summer break!', '2026-04-10'),
  (2, 4, '2026-07-04', '2026-07-11', '["James Thomas", "Linda Thomas", "Cody Thomas", "Mia Thomas"]', 4, 'pending', '4th of July week — fireworks on the beach!', '2026-04-22'),
  (3, 5, '2026-05-25', '2026-05-30', '["Emma Pierce", "Ryan Cole"]', 2, 'pending', 'Anniversary weekend ❤️', '2026-05-01'),
  (4, 1, '2026-09-12', '2026-09-19', '["Sarah Pierce", "Dan Pierce"]', 2, 'approved', 'Fall getaway', '2026-03-15');

INSERT INTO reservation_votes (reservation_id, user_id, vote) VALUES
  (1, 1, 'approve'),
  (1, 3, 'approve'),
  (2, 3, 'approve'),
  (4, 1, 'approve'),
  (4, 4, 'approve');

INSERT INTO priority_periods (family, start_date, end_date, label) VALUES
  ('Pierce', '2026-01-01', '2026-02-28', 'Pierce Family'),
  ('Thomas', '2026-03-01', '2026-04-30', 'Thomas Family'),
  ('Pierce', '2026-05-01', '2026-06-30', 'Pierce Family'),
  ('Thomas', '2026-07-01', '2026-08-31', 'Thomas Family'),
  ('Pierce', '2026-09-01', '2026-10-31', 'Pierce Family'),
  ('Thomas', '2026-11-01', '2026-12-31', 'Thomas Family');

INSERT INTO house_info (id, house_name, location, bedrooms, bathrooms, max_guests, unit, gate_code, wifi_name, wifi_password, parking, address, amenities_json) VALUES
  (1, 'The Pierce/Thomas Beach House', 'Shelter Cove, Hilton Head Island, SC', 2, 2, 6, '7557', '1776#', 'paradise7557', 'happy123', 'Unassigned lot parking at the building', 'Unit 7557 · Shelter Cove, Hilton Head Island, SC', '["Marina & pool view", "Community pool & hot tub", "Chef''s kitchen", "Gas fireplace", "Wet bar + wine storage", "Screened balcony", "Walk to dining & marina", "Smart TVs", "Washer/dryer", "LED-lit baths"]');

INSERT INTO house_rules (text, sort_order) VALUES
  ('No smoking inside the house', 0),
  ('Max 6 guests at a time (2 BR / 2 BA)', 1),
  ('Quiet hours after 10pm — be neighborly', 2),
  ('Clean before you leave', 3),
  ('Notify the other family of any damage right away', 4),
  ('Pets allowed with prior heads-up', 5),
  ('Lock all doors when leaving', 6),
  ('Trash is taken out', 7);

INSERT INTO checkout_checklist_items (text, sort_order) VALUES
  ('Trash out to curb (if Monday night)', 0),
  ('Dishwasher run + emptied', 1),
  ('Beds stripped, linens in laundry', 2),
  ('Towels in laundry basket', 3),
  ('Thermostat set to 78° (summer) / 62° (winter)', 4),
  ('All windows + doors locked', 5),
  ('Lockbox keys returned', 6),
  ('Supplies inventory updated', 7);

INSERT INTO supplies (name, category, status, count_label, essential, updated_by, updated_at) VALUES
  ('Toilet paper', 'Bathroom', 'good', '8 rolls', 1, 2, '2026-05-18'),
  ('Paper towels', 'Kitchen', 'good', '4 rolls', 1, 2, '2026-05-18'),
  ('Dish soap', 'Kitchen', 'low', 'Half bottle', 1, 2, '2026-05-18'),
  ('Dishwasher pods', 'Kitchen', 'good', '20+ pods', 0, 1, '2026-04-22'),
  ('Laundry detergent', 'Laundry', 'good', 'Full bottle', 0, 1, '2026-04-22'),
  ('Trash bags (kitchen)', 'Cleaning', 'out', '0', 1, 2, '2026-05-18'),
  ('Trash bags (outdoor)', 'Cleaning', 'good', 'Most of box', 0, 2, '2026-05-18'),
  ('Hand soap', 'Bathroom', 'good', '2 dispensers full', 0, 1, '2026-04-22'),
  ('Shampoo & conditioner', 'Bathroom', 'low', 'Running low', 0, 2, '2026-05-18'),
  ('Body wash', 'Bathroom', 'good', 'Full', 0, 1, '2026-04-22'),
  ('Coffee + filters', 'Kitchen', 'low', '1/2 bag', 0, 2, '2026-05-18'),
  ('Salt, pepper, oil', 'Kitchen', 'good', 'Pantry stocked', 0, 1, '2026-04-22'),
  ('Sponges + dish cloths', 'Cleaning', 'good', 'Fresh', 0, 2, '2026-05-18'),
  ('All-purpose cleaner', 'Cleaning', 'good', 'Almost full', 0, 1, '2026-04-22'),
  ('Sunscreen (shared)', 'Beach', 'low', 'Half bottle', 0, 2, '2026-05-18'),
  ('Beach towels', 'Beach', 'good', '8 towels', 0, 1, '2026-04-22'),
  ('Sand toys + chairs', 'Beach', 'good', 'In garage', 0, 1, '2026-04-22'),
  ('First aid kit', 'Safety', 'good', 'Fully stocked', 0, 1, '2026-04-22'),
  ('Batteries (AA/AAA)', 'Safety', 'good', 'Drawer full', 0, 1, '2026-04-22'),
  ('Light bulbs (spare)', 'Safety', 'low', 'Just 2 left', 0, 2, '2026-05-18');

INSERT INTO local_recs (category, name, note, tag, walk, sort_order) VALUES
  ('Dining', 'ELA''s Blu Water Grille', 'Waterfront dining at Shelter Cove Marina. Sunset reservations are everything.', 'Marina', '5 min walk', 0),
  ('Dining', 'San Miguel''s', 'Casual Mexican right on the marina — frozen margaritas + tacos.', 'Marina', '5 min walk', 1),
  ('Dining', 'Hudson''s Seafood House', 'Local institution. Get the shrimp. Cash-friendly, no reservations.', 'Seafood', '10 min drive', 2),
  ('Dining', 'Skull Creek Boathouse', 'Sunset views, dock-and-dine. Good for groups.', 'Waterfront', '15 min drive', 3),
  ('Dining', 'Poseidon', 'Rooftop bar at Shelter Cove Towne Centre. Great for cocktails.', 'Rooftop', '8 min walk', 4),
  ('Beach', 'Burkes Beach', 'Closest public beach access. Wide sand, less crowded than Coligny.', 'Beach', '10 min drive', 5),
  ('Beach', 'Islanders Beach Park', 'Resident-friendly, restrooms, picnic tables. Bring the parking pass.', 'Family', '12 min drive', 6),
  ('Beach', 'Coligny Beach Park', 'Big public beach with shops + restaurants nearby.', 'Lively', '15 min drive', 7),
  ('Beach', 'Driessen Beach Park', 'Boardwalk through the dunes. Great for sunrise walks.', 'Quiet', '10 min drive', 8),
  ('Bike & Trails', 'Cross Island Path', 'Paved bike path running across the island. Pick it up right at Shelter Cove.', 'Path', 'At door', 9),
  ('Bike & Trails', 'Pinckney Island Refuge', 'Flat, scenic dirt trails through the marsh. Amazing wildlife.', 'Nature', '8 min drive', 10),
  ('Bike & Trails', 'Beach Riding (Low Tide)', 'Ride the hard sand at low tide — check tide chart first.', 'Beach', '10 min drive', 11),
  ('Bike & Trails', 'Hilton Head Bicycle Co.', 'Rentals, repairs, and recommended routes if you brought your own.', 'Rentals', '5 min drive', 12),
  ('Bike & Trails', 'Shelter Cove Loop', 'Easy 4-mile loop around the marina + community. Good for kids.', 'Easy', 'At door', 13),
  ('Activities', 'Shelter Cove Marina', 'Boats, dolphin tours, sunset cruises — all leave from here.', 'Marina', '5 min walk', 14),
  ('Activities', 'Harbour Town Lighthouse', 'Walk up for the view. Sea Pines fee at the gate.', 'Landmark', '20 min drive', 15),
  ('Activities', 'Outside Hilton Head', 'Kayak + paddleboard rentals, marsh tours. Book ahead in summer.', 'Water', '5 min walk', 16),
  ('Activities', 'Coastal Discovery Museum', 'Free, easy walking trails + butterfly garden. Great rainy-day backup.', 'Indoor', '8 min drive', 17),
  ('Groceries', 'Publix at Shelter Cove', 'Closest grocery, in the Towne Centre. Open until 10pm.', 'Shopping', '8 min walk', 18),
  ('Groceries', 'Fresh Market', 'Nicer produce + prepared foods. Worth the short drive.', 'Specialty', '5 min drive', 19),
  ('Groceries', 'Harris Teeter (Coligny)', 'Full-size grocery near Coligny Plaza, wide selection. Good for a big stock-up.', 'Shopping', '15 min drive', 20),
  ('Groceries', 'Kroger (Pineland Station)', 'Large, well-stocked, usually less crowded than the Publix by the marina.', 'Shopping', '12 min drive', 21),
  ('Groceries', 'Whole Foods Market', 'Organic + specialty groceries, good prepared foods bar for a quick dinner.', 'Specialty', '15 min drive', 22),
  ('Groceries', 'Piggly Wiggly (Sea Pines Center)', 'Small, convenient, in-season for quick top-ups near Sea Pines.', 'Convenient', '20 min drive', 23),
  ('Groceries', 'The Store (Bluffton)', 'Local butcher + market with excellent seafood and meats, worth the trip.', 'Specialty', '20 min drive', 24);

INSERT INTO gallery_photos (category, file_path, caption, sort_order) VALUES
  ('Views', 'photos/IMG_3259.jpg', 'Pool & marina from the balcony', 0),
  ('Views', 'photos/IMG_3260.jpg', 'Shelter Cove marina & boats', 1),
  ('Views', 'photos/IMG_3238.jpg', 'Marina & pool through the windows', 2),
  ('Views', 'photos/IMG_3243.jpg', 'Screened balcony over the water', 3),
  ('Living', 'photos/IMG_3250.jpg', 'Open living room with gas fireplace', 4),
  ('Living', 'photos/IMG_3239.jpg', 'Living & dining, open to the kitchen', 5),
  ('Living', 'photos/IMG_3242.jpg', 'Sitting area & wet bar, marina view', 6),
  ('Living', 'photos/IMG_3241.jpg', 'Lounge with wine wall & wet bar', 7),
  ('Living', 'photos/IMG_3240.jpg', 'Wet bar with wine fridge', 8),
  ('Kitchen', 'photos/IMG_3245.jpg', 'Chef''s kitchen, waterfall marble island', 9),
  ('Kitchen', 'photos/IMG_3244.jpg', 'Full kitchen, stainless appliances', 10),
  ('Bedrooms', 'photos/IMG_3252.jpg', 'Guest bedroom with balcony', 11),
  ('Bedrooms', 'photos/IMG_3251.jpg', 'Guest bedroom, queen + smart TV', 12),
  ('Bedrooms', 'photos/IMG_3247.jpg', 'Bedroom with private porch access', 13),
  ('Bedrooms', 'photos/IMG_3246.jpg', 'Queen bedroom', 14),
  ('Bathrooms', 'photos/IMG_3249.jpg', 'Marble walk-in shower', 15),
  ('Bathrooms', 'photos/IMG_3248.jpg', 'Double vanity & dressing area', 16),
  ('Bathrooms', 'photos/IMG_3257.jpg', 'Dual LED-lit vanities', 17),
  ('Bathrooms', 'photos/IMG_3258.jpg', 'Walk-in shower, sea-glass tile', 18),
  ('Bathrooms', 'photos/IMG_3253.jpg', 'Guest bath with glass shower', 19),
  ('Parking & Access', 'photos/IMG_3261.jpg', 'Unit 7557 — front door (keypad entry)', 20),
  ('Parking & Access', 'photos/IMG_3263.jpg', 'Parking lot at the building', 21),
  ('Parking & Access', 'photos/IMG_3262.jpg', 'Parking from above', 22);
