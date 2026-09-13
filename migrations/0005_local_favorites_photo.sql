-- Local Favorites now support admin-uploaded photos via R2, same as the
-- house photo gallery. image_path (the seeded /public paths) stays as a
-- fallback for the original rows; r2_key takes priority once set.
ALTER TABLE local_favorites ADD COLUMN r2_key TEXT;
