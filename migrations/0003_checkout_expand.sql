DELETE FROM checkout_checklist_items;

INSERT INTO checkout_checklist_items (text, sort_order) VALUES
  ('Trash taken to the dumpster/curb', 0),
  ('Dishes washed, dried, and put away (run + empty the dishwasher)', 1),
  ('Perishable food cleared out of the fridge', 2),
  ('Beds stripped, sheets started in the wash or bagged for laundry', 3),
  ('Towels washed or bagged for laundry', 4),
  ('Wet towels/swimsuits hung to dry, not left in a pile', 5),
  ('Countertops and surfaces wiped down', 6),
  ('Thermostat set appropriately (78° summer / 62° winter)', 7),
  ('All windows and doors locked', 8),
  ('Lights and fans turned off', 9),
  ('Lockbox keys returned', 10),
  ('Personal belongings double-checked (fridge, drawers, closets)', 11),
  ('Supplies inventory updated in the app for the next family', 12);
