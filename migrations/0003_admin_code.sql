-- Aaron's real reservation code.
--
-- 0002 seeded HEATON1, which came from the handoff prototype's placeholder
-- user list rather than from anything real.
UPDATE users
   SET code = 'HEATON1557'
 WHERE lower(code) = 'heaton1';
