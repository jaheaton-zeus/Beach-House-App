# Shelter Cove — P/T Beach House

Reservations, house info, and local recommendations for the Pierce/Thomas
family beach house at Shelter Cove, Hilton Head Island.

Next.js 16 (App Router, TypeScript) on Cloudflare Workers, with D1 for data and
R2 for gallery photos. Visual design is "Coastal Dark" — see `DESIGN.md`.

## Screens

| Route | What it does |
|---|---|
| `/` | Hero, booking card, local favorites, house stats |
| `/calendar` | Two-month availability grid, range selection, request dates |
| `/mytrips` | Your stays, grouped into pending / upcoming / past |
| `/admin` | Reservations, Around the House, Users, Priority, Photos |
| `/house/rules`, `/house/access`, `/house/lights`, `/house/photos` | House info |
| `/around`, `/beaches`, `/bike-trails` | Curated local recommendations |
| `/pathways` | The island's public bike-path map |

## How access works

There is no login page. Everyone has a **reservation code** — that is the only
credential. Booking with it identifies you, and clicking **Admin** asks for a
code, which opens the admin screens only if it belongs to a super user. Super
users approve or deny requests by majority vote and manage the user list.

## First-time setup

```bash
npm install
npm run db:migrate:local     # create + seed the local database
npm run dev                  # http://localhost:3000
```

Sign in on any screen with a seeded code — `PIERCE7` and `THOMAS7` are super
users, `EMMA22` and `DAVE19` are not.

### Cloudflare

The `sheltercove-db` D1 database and `sheltercove-photos` R2 bucket are already
created and wired up in `wrangler.jsonc`. To apply migrations to production:

```bash
npm run db:migrate:remote
```

## Deploying

Cloudflare Workers Build is connected to this repo and deploys the
`beach-house-app` Worker on every push to `main` (`npm run deploy`). To deploy
by hand:

```bash
npm run build      # also regenerates cloudflare-env.d.ts
npm run deploy
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with D1/R2 bound to local state |
| `npm run build` | Generate Worker types, then build |
| `npm run preview` | Build and run in the real Workers runtime |
| `npm run deploy` | Build and deploy |
| `npm run lint` | ESLint |
| `npm run db:migrate:local` / `:remote` | Apply migrations |

## Repo layout

```
migrations/          D1 schema (0001) and seed content (0002)
src/app/             routes, server actions, API route handlers
src/components/      screens and shared UI
src/lib/             db bindings, queries, auth, date helpers, icons
public/              heroes, thumbnails, tile art (optimized from the handoff)
design_handoff_shelter_cove_redesign/
                     the Coastal Dark handoff — design source of truth
```

Read `CLAUDE.md` before changing anything: it records the gotchas (date
handling, photo uploads, font loading, the build/typecheck difference) that
have each cost a debugging session before.
