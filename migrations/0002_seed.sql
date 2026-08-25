-- Shelter Cove — seed content.
-- Sourced from the Coastal Dark handoff prototypes in
-- design_handoff_shelter_cove_redesign/design-reference/.

DELETE FROM reservation_votes;
DELETE FROM reservations;
DELETE FROM users;
DELETE FROM family_priority;
DELETE FROM places;
DELETE FROM local_favorites;
DELETE FROM house_rules;
DELETE FROM access_details;
DELETE FROM lights_info;
DELETE FROM gallery_photos;
DELETE FROM house_info;

INSERT INTO users (id, name, email, family, code, super_user, site_admin) VALUES
  (1, 'Sarah Pierce', 'sarah@family.com', 'Pierce', 'PIERCE7', 1, 0),
  (2, 'Mike Thomas', 'mike@thomasfam.com', 'Thomas', 'THOMAS7', 1, 0),
  (3, 'Emma Pierce', 'emma@family.com', 'Pierce', 'EMMA22', 0, 0),
  (4, 'Dave Thomas', 'dave@thomasfam.com', 'Thomas', 'DAVE19', 0, 0),
  (5, 'Aaron Heaton', 'aaron@ptbeachhouse.com', 'Pierce', 'HEATON1', 1, 1);

INSERT INTO family_priority (family, rank) VALUES
  ('Pierce', 1),
  ('Thomas', 2);

INSERT INTO house_info (id, house_name, location, bedrooms, bathrooms, max_guests) VALUES
  (1, 'P/T Beach House', 'Shelter Cove, Hilton Head Island, SC', 2, 2, 6);

INSERT INTO house_rules (text, sort_order) VALUES
  ('No smoking inside the house', 1),
  ('Max 6 guests at a time (2 BR / 2 BA)', 2),
  ('Quiet hours after 10pm — be neighborly', 3),
  ('Clean before you leave', 4),
  ('Notify the other family of any damage right away', 5),
  ('Pets allowed with prior heads-up', 6),
  ('Lock all doors when leaving', 7),
  ('Trash is taken out', 8),
  ('Set the thermostat to 75', 9),
  ('Unplug the dehumidifier', 10),
  ('Turn off all lights', 11);

INSERT INTO access_details (label, value, note, sort_order) VALUES
  ('COMMUNITY GATE CODE', '1776#', NULL, 1),
  ('UNIT', '7557', NULL, 2),
  ('WIFI NETWORK', 'paradise7557', NULL, 3),
  ('WIFI PASSWORD', 'happy123', NULL, 4),
  ('PARKING', 'Unassigned lot parking at the building', NULL, 5),
  ('ADDRESS', 'Unit 7557 · Shelter Cove, Hilton Head Island, SC', NULL, 6);

INSERT INTO lights_info (title, body, icon, full_width, sort_order) VALUES
  ('The My Leviton app', 'Download **My Leviton** (free, iOS & Android) to control lights from your phone. You don''t need an account to use the switches on the wall — the app is only for remote and scheduled control. Ask the family for a guest invite if you''d like app access during your stay.', 'switch', 1, 1),
  ('At the wall', 'Tap the top of the paddle for on, the bottom for off. Press and hold to dim up or down. The small LED bar on the switch shows the current brightness level, even when the light is off.', NULL, 0, 2),
  ('Dimming & scenes', 'Dimmers remember your last brightness. In the app you can set scenes — like a low "Evening" setting for the living room and balcony — and trigger them with one tap.', NULL, 0, 3),
  ('Wi-Fi network', 'The switches are already connected to the house Wi-Fi (**paradise7557**). Leviton devices use the 2.4 GHz band — no setup needed on your end.', NULL, 0, 4),
  ('If a light won''t respond', 'Toggle the switch off and on at the wall first — that fixes most hiccups. If it''s still stuck, the switch may be offline; it reconnects to Wi-Fi on its own within a minute or two. Please don''t factory-reset any switch.', NULL, 0, 5);

INSERT INTO local_favorites (name, subtitle, rating, url, image_path, sort_order) VALUES
  ('The French Bakery', 'Shelter Cove · Café', '4.7', 'https://frenchbakeryhhi.com/', '/favorites/french-bakery.jpg', 1),
  ('Poseidon', 'Shelter Cove · Seafood', '4.9', 'https://www.poseidonhhi.com/', '/favorites/poseidon.jpg', 2),
  ('Skull Creek Boathouse', 'Hilton Head · Waterfront', '4.7', 'https://www.skullcreekboathouse.com/', '/favorites/skullcreek.jpg', 3),
  ('The Sandbar', 'Hilton Head · Beach Eats', '4.8', 'https://www.sandbarhhi.com/', '/favorites/sandbar.jpg', 4);

INSERT INTO places (category, name, tag, drive, destination, description, sort_order) VALUES
  ('Dining', 'ELA''s Blu Water Grille', 'MARINA', '5 min walk', 'ELA''s Blu Water Grille, Shelter Cove Marina, Hilton Head Island, SC', 'Waterfront dining at Shelter Cove Marina. Sunset reservations are everything.', 1),
  ('Dining', 'San Miguel''s', 'MARINA', '5 min walk', 'San Miguel''s Mexican Restaurant, Shelter Cove, Hilton Head Island, SC', 'Casual Mexican right on the marina — frozen margaritas + tacos.', 2),
  ('Dining', 'Hudson''s Seafood House', 'SEAFOOD', '10 min drive', 'Hudson''s Seafood House on the Docks, Hilton Head Island, SC', 'Local institution. Get the shrimp. Cash-friendly, no reservations.', 3),
  ('Dining', 'Skull Creek Boathouse', 'WATERFRONT', '15 min drive', 'Skull Creek Boathouse, Hilton Head Island, SC', 'Sunset views, dock-and-dine. Good for groups.', 4),
  ('Dining', 'Poseidon', 'ROOFTOP', '8 min walk', 'Poseidon Coastal Cuisine, Shelter Cove Towne Centre, Hilton Head Island, SC', 'Rooftop bar at Shelter Cove Towne Centre. Great for cocktails.', 5),

  ('Beach', 'Burkes Beach', 'BEACH', '10 min drive', 'Burkes Beach, Hilton Head Island, SC', 'Closest public beach access. Wide sand, less crowded than Coligny.', 1),
  ('Beach', 'Islanders Beach Park', 'FAMILY', '12 min drive', 'Islanders Beach Park, Hilton Head Island, SC', 'Resident-friendly, restrooms, picnic tables. Bring the parking pass.', 2),
  ('Beach', 'Coligny Beach Park', 'LIVELY', '15 min drive', 'Coligny Beach Park, Hilton Head Island, SC', 'Big public beach with shops + restaurants nearby.', 3),
  ('Beach', 'Driessen Beach Park', 'QUIET', '10 min drive', 'Driessen Beach Park, Hilton Head Island, SC', 'Boardwalk through the dunes. Great for sunrise walks.', 4),

  ('Bike & Trails', 'Cross Island Path', 'PATH', 'At door', 'Shelter Cove, Hilton Head Island, SC', 'Paved bike path running across the island. Pick it up right at Shelter Cove.', 1),
  ('Bike & Trails', 'Pinckney Island Refuge', 'NATURE', '8 min drive', 'Pinckney Island National Wildlife Refuge, Hilton Head Island, SC', 'Flat, scenic dirt trails through the marsh. Amazing wildlife.', 2),
  ('Bike & Trails', 'Beach Riding (Low Tide)', 'BEACH', '10 min drive', 'Coligny Beach Park, Hilton Head Island, SC', 'Ride the hard sand at low tide — check tide chart first.', 3),
  ('Bike & Trails', 'Hilton Head Bicycle Co.', 'RENTALS', '5 min drive', 'Hilton Head Bicycle Company, Hilton Head Island, SC', 'Rentals, repairs, and recommended routes if you brought your own.', 4),
  ('Bike & Trails', 'Shelter Cove Loop', 'EASY', 'At door', 'Shelter Cove Community Park, Hilton Head Island, SC', 'Easy 4-mile loop around the marina + community. Good for kids.', 5),

  ('Activities', 'Shelter Cove Marina', 'MARINA', '5 min walk', 'Shelter Cove Marina, Hilton Head Island, SC', 'Boats, dolphin tours, sunset cruises — all leave from here.', 1),
  ('Activities', 'Harbour Town Lighthouse', 'LANDMARK', '20 min drive', 'Harbour Town Lighthouse, Sea Pines, Hilton Head Island, SC', 'Walk up for the view. Sea Pines fee at the gate.', 2),
  ('Activities', 'Outside Hilton Head', 'WATER', '5 min walk', 'Outside Hilton Head, Shelter Cove Marina, Hilton Head Island, SC', 'Kayak + paddleboard rentals, marsh tours. Book ahead in summer.', 3),
  ('Activities', 'Coastal Discovery Museum', 'INDOOR', '8 min drive', 'Coastal Discovery Museum, Hilton Head Island, SC', 'Free, easy walking trails + butterfly garden. Great rainy-day backup.', 4),

  ('Groceries', 'Publix at Shelter Cove', 'SHOPPING', '8 min walk', 'Publix Super Market at Shelter Cove Towne Centre, Hilton Head Island, SC', 'Closest grocery, in the Towne Centre. Open until 10pm.', 1),
  ('Groceries', 'Fresh Market', 'SPECIALTY', '5 min drive', 'The Fresh Market, Hilton Head Island, SC', 'Nicer produce + prepared foods. Worth the short drive.', 2),
  ('Groceries', 'Harris Teeter (Coligny)', 'SHOPPING', '15 min drive', 'Harris Teeter, Coligny Plaza, Hilton Head Island, SC', 'Full-size grocery near Coligny Plaza, wide selection. Good for a big stock-up.', 3),
  ('Groceries', 'Kroger (Pineland Station)', 'SHOPPING', '12 min drive', 'Kroger, Pineland Station, Hilton Head Island, SC', 'Large, well-stocked, usually less crowded than the Publix by the marina.', 4),
  ('Groceries', 'Whole Foods Market', 'SPECIALTY', '15 min drive', 'Whole Foods Market, Hilton Head Island, SC', 'Organic + specialty groceries, good prepared foods bar for a quick dinner.', 5),
  ('Groceries', 'Piggly Wiggly (Sea Pines Center)', 'CONVENIENT', '20 min drive', 'Piggly Wiggly, Sea Pines Center, Hilton Head Island, SC', 'Small, convenient, in-season for quick top-ups near Sea Pines.', 6),
  ('Groceries', 'The Store (Bluffton)', 'SPECIALTY', '20 min drive', 'The Store, Bluffton, SC', 'Local butcher + market with excellent seafood and meats, worth the trip.', 7);

INSERT INTO gallery_photos (slot_key, label, col_span, row_span, sort_order) VALUES
  ('house-photo-1', 'Living room', 4, 2, 1),
  ('house-photo-2', 'Marina view', 2, 1, 2),
  ('house-photo-3', 'Kitchen', 2, 1, 3),
  ('house-photo-4', 'Primary bedroom', 2, 2, 4),
  ('house-photo-5', 'Balcony', 2, 1, 5),
  ('house-photo-6', 'Pool & hot tub', 2, 1, 6),
  ('house-photo-7', 'Guest room', 2, 1, 7),
  ('house-photo-8', 'Bathroom', 2, 1, 8),
  ('house-photo-9', 'Sunset from the dock', 2, 1, 9);
