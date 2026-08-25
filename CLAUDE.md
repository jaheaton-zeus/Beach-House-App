@AGENTS.md

# Shelter Cove — project brief

A reservation and house-info app for the Pierce/Thomas family beach house at
Shelter Cove, Hilton Head Island. Built fresh from the "Coastal Dark" design
handoff in `design_handoff_shelter_cove_redesign/`, which stays in the repo as
the visual source of truth.

## Stack

- **Next.js 16** (App Router, TypeScript) on **Cloudflare Workers** via
  `@opennextjs/cloudflare`
- **D1** (`sheltercove-db`) for all app data — `migrations/`
- **R2** (`sheltercove-photos`) for gallery photos, served through
  `src/app/api/photos/[...key]/route.ts`

## Auth: reservation codes, no passwords

There is no login page and no password anywhere. Each user has a reservation
code (`users.code`) that is their only credential:

- Booking with a code identifies you — the code goes into an httpOnly cookie
  (`src/lib/auth.ts`), which is what makes My Trips show your stays.
- The cookie stores the code itself rather than a session token. That is safe
  *because* every request looks it up in D1 again, so a forged cookie resolves
  to no user. Never turn it into a bearer token.
- **Admin** is in the nav for everyone. `/admin` renders a code modal
  (`CodeGate`) unless the cookie belongs to a super user. The modal is only the
  UI — `requireSuperUser()` runs again inside every admin Server Action and the
  upload route, because Server Actions are reachable by direct POST.

## Voting

Reservations resolve by majority of the **current** super users:
`floor(superCount / 2) + 1`. Votes cast by someone who is later demoted stop
counting — `resolveStatus()` in `src/app/admin-actions.ts` re-derives status
from the votes that still count, and re-runs across all reservations whenever
the user list changes.

## Deploying: the postinstall build shim

Workers Builds runs `npm clean-install` and then the trigger's deploy command.
This project's trigger has **no build command** — a leftover from when the repo
served a static "Coming Soon" page — and its deploy command is a bare
`npx wrangler deploy`. Wrangler detects the OpenNext project and hands off to
`opennextjs-cloudflare deploy` *before* running any build of its own, so with
no build step the deploy dies on "Could not find compiled Open Next config".

`scripts/workers-ci-build.mjs`, wired to npm's `postinstall`, puts that step
back: it runs `opennextjs-cloudflare build` when `WORKERS_CI` is set, and
no-ops everywhere else so a developer's `npm install` is untouched.

**This is a shim, not the intended arrangement.** Setting the trigger's build
command to `npx opennextjs-cloudflare build` in the dashboard does the same job
properly; once that is set, delete the script and the `postinstall` hook.

## Database changes

The database is new and has no manual-console history, so wrangler's own
migration tracking is accurate — use it normally:

```bash
npm run db:migrate:local     # local D1 under .wrangler/
npm run db:migrate:remote    # production
```

Add new schema/data as `migrations/000N_description.sql`.

## Gotchas — don't reintroduce these

- **Dates.** Every `YYYY-MM-DD` string goes through `src/lib/format.ts`, which
  parses to local **noon**. Mixing midnight-anchored dates with timestamps made
  `Math.round()` land on exact .5-day boundaries and produced a real
  off-by-one bug in an earlier version. Never call `new Date(dateString)`
  directly.
- **Overlap is half-open.** `rangesOverlap()` treats one family's check-out day
  as bookable by the next — back-to-back stays are not a conflict.
- **Photo uploads go through a Route Handler**
  (`src/app/api/photos/upload/route.ts`), never a Server Action: Server Actions
  cap bodies at 1MB and real photos exceed that.
- **Fonts load via a `<link>` in `layout.tsx`**, not `next/font/google` —
  build-time font fetches returned 403s from CI before.
- **Run `npm run build`, not bare `npx tsc --noEmit`, before pushing.**
  `cloudflare-env.d.ts` (which types the `DB`/`PHOTOS` bindings) is generated
  by `wrangler types` as part of the build and is git-ignored, so a plain tsc
  run on a clean checkout reports phantom errors — and can miss real ones,
  since the Workers types differ from the DOM's.
- **Handoff images are 6–8MB PNGs.** Anything pulled out of
  `design_handoff_shelter_cove_redesign/` into `public/` must be downsized and
  re-encoded first.

## Commands

```bash
npm run dev        # Next dev server, with D1/R2 bound to local state
npm run preview    # build + run in the real Workers runtime
npm run deploy     # build + deploy to the beach-house-app Worker
npm run lint
npm run build
```
