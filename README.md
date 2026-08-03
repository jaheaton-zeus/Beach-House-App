# Shelter Cove — Beach House Reservation App

The real, database-backed version of the Beach House Reservation App, built on
Next.js (App Router) and deployed to Cloudflare Workers via the OpenNext
adapter. Data lives in Cloudflare D1.

The original visual design and feature prototype (built in Claude Design as a
single-page HTML/React app, no build step) lives in `design-reference/` for
reference — nothing was deleted, this app is being built out screen by screen
based on that prototype.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **@opennextjs/cloudflare** — deploys the Next.js app to Cloudflare Workers
- **D1** — SQLite database (see `migrations/`)
- **Cloudflare Access** — family login via email allowlist (not yet configured)

## First-time setup (after this code is in GitHub)

1. **Create the D1 database** — Cloudflare dashboard → Workers & Pages → D1 →
   Create database → name it `sheltercove-db`.
2. **Copy the Database ID** shown after creation, and paste it into
   `wrangler.jsonc`, replacing `REPLACE_WITH_YOUR_D1_DATABASE_ID`.
3. **Run the schema + seed migrations** against the new database. Easiest way
   without a local terminal: open the D1 database in the Cloudflare dashboard,
   go to its **Console** tab, and paste in the contents of
   `migrations/0001_init.sql`, run it, then paste in
   `migrations/0002_seed.sql` and run that too.
4. **Connect this repo to a Cloudflare Worker** via Workers & Pages → Create
   application → Connect to Git, same as the personal site. Deploy command:
   `npm run deploy`.
5. Once deployed, attach `sheltercove.aheaton.com` as a custom domain the same
   way as `aheaton.com` was attached earlier.

## Local development (once you have a machine with Node.js installed)

```bash
npm install
npm run dev          # regular Next.js dev server
npm run preview      # builds + runs in the actual Workers runtime (more accurate)
npm run deploy       # builds + deploys to Cloudflare
```

## Database changes

Add new files to `migrations/` (e.g. `0003_add_something.sql`) rather than
editing existing ones, so the history of schema changes stays intact.
