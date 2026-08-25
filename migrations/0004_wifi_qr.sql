-- Replace the Wi-Fi network/password pair with a scannable join code.
--
-- `kind` lets a row render as something other than a label/value pair. Only
-- the Wi-Fi row uses it today; everything else stays a plain detail.
ALTER TABLE access_details ADD COLUMN kind TEXT NOT NULL DEFAULT 'detail';

UPDATE access_details
   SET kind = 'wifi_qr',
       label = 'WI-FI',
       note = 'Open your phone''s camera, point it at the code, and tap the banner that appears to join — no password to type.'
 WHERE label = 'WIFI NETWORK';

-- The code carries the password, so the separate card is redundant.
DELETE FROM access_details WHERE label = 'WIFI PASSWORD';
