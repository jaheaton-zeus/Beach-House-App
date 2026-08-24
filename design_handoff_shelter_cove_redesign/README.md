# Handoff: Shelter Cove — "Coastal Dark" Redesign

## Overview

This package is a **visual redesign** of the Shelter Cove beach-house app
(`jaheaton-zeus/Beach-House-App`). The app already exists and is fully built and
database-backed — Login, Home, Calendar, Book a Stay, My Trips, House Info,
Gallery, Supplies, Checkout, and the five admin tabs all run on Next.js 16 (App
Router, TypeScript) on Cloudflare Workers with D1 (SQLite) + R2 (photos).

**Nothing about the app's data model, routes, or server logic changes here.**
The task is to **re-skin the existing screens** to match the new "Coastal Dark"
look in this bundle — swap the current "Ocean Deck" light theme for the dark
teal-on-charcoal design, screen by screen, keeping every existing wire-up (D1
reads/writes, R2 photos, auth, the majority-vote booking flow) intact.

Read the repo's `CLAUDE.md`, `README.md`, `PRODUCT.md`, and `DESIGN.md` before
starting — they carry the build state and several already-fixed gotchas
(date off-by-one, migration tracking, font loading) you must not reintroduce.
When done, **update `DESIGN.md`** so it documents Coastal Dark instead of Ocean
Deck.

## About the design files

The files in `design-reference/` are **design references, not production code.**
They are HTML prototypes (authored as self-contained "Design Component" `.dc.html`
files) that show the intended look and behavior. Do **not** copy them into the
Next.js app or wire them up as-is:

- They use inline styles and small vanilla-JS `localStorage` stores
  (`user-store.js`, `reservation-store.js`, `photo-store.js`) purely to make the
  prototype interactive in isolation. The **real app already has all of this in
  D1** — ignore the localStorage stores except as a description of the data
  shape and the intended interactions.
- `<image-slot>` is a prototype drag-and-drop placeholder. In the app, images
  come from R2 via the existing gallery API — keep that.
- The `.dc.html` wrapper, `support.js`, and `<x-dc>`/`<dc-import>`/`<sc-for>`
  tags are prototype scaffolding. Recreate the **markup structure, layout, and
  exact style values** inside the app's existing React components.

**How to view the prototype:** open `design-reference/Wanderlust.dc.html` in a
browser (it's the Home page) and click through the nav. Every `.dc.html` opens
directly.

## Screenshots

Rendered captures of every screen are in `screenshots/` for quick reference
(the live prototype in `design-reference/` is the source of truth):

`01-home` · `02-calendar` · `03-my-trips` · `04-admin` · `05-rules` ·
`06-access` · `07-around-the-house` · `08-beaches` · `09-bike-trails` ·
`10-lights` · `11-photos` · `12-pathways`.

(The Pathways map is a live embedded ArcGIS iframe — it appears blank in the
static screenshot but renders in the browser.)

## Fidelity

**High-fidelity.** Colors, typography, spacing, and radii are final — match them
exactly. The design tokens below are the source of truth; the HTML files are the
reference for how they compose per screen.

---

## Design tokens — "Coastal Dark"

### Color

| Role | Value |
|---|---|
| Page background (charcoal) | `#0c1316` |
| Panel / card surface | `rgba(12,19,22,0.82)` over the page, or `rgba(14,22,25,0.72)` for glass cards |
| Card border (hairline) | `rgba(255,255,255,0.1)` |
| Subtle fill (inputs, chips) | `rgba(255,255,255,0.05)` |
| Subtle border | `rgba(255,255,255,0.08)` |
| Primary text | `#ffffff` |
| Secondary text | `rgba(255,255,255,0.6)` |
| Muted / label text | `rgba(255,255,255,0.45–0.5)` |
| **Primary accent (sage/seafoam)** | `#6fa793` — buttons, active nav, selected states |
| Accent light (text/icon) | `#a7d0c4` |
| Accent lighter (kicker labels, hairline rule) | `#8fc7b6` |
| Link default | `#7fb6a6` · hover `#a7d0c4` |
| Deep teal (Add buttons) | `#0f4c5c` |

**Button text on accent is dark:** `#0c1316` on `#6fa793` (never white on the
sage).

### Status / semantic colors

| Status | Text | Fill / border |
|---|---|---|
| Approved / success | `#a7d0c4` (`#bfe6d8` in messages) | `rgba(111,167,147,0.16)` / `rgba(111,167,147,0.3)` |
| Pending | `#e8c877` | `rgba(230,190,90,0.16)` / `rgba(230,190,90,0.32)` |
| Denied / error | `#e39b8c` (`#f0b3a6` in messages) | `rgba(210,90,70,0.14–0.16)` / `rgba(210,90,70,0.34)` |

### Family accent (avatars, dots)

- **Pierce** — bg `rgba(255,107,74,0.18)`, border `rgba(255,107,74,0.4)`, fg `#ff9a80`
- **Thomas** — bg `rgba(111,167,147,0.18)`, border `rgba(111,167,147,0.4)`, fg `#a7d0c4`

### Typography

Two Google fonts, loaded via `<link>` (the repo loads fonts with a `<link>` in
`layout.tsx`, **not** `next/font/google` — keep that pattern):

```
https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap
```

- **Manrope** — everything by default. Weights 400/500/600/700/800.
- **Playfair Display** (serif) — used *selectively* for a few display accents:
  the "Schedule Your Stay" card title, "Local Favorites" / section headings, the
  Calendar page `<h1>` ("Booking Calendar"), and per-month labels. Everything
  else (including most page `<h1>`s) is Manrope 800.

**Type scale in use:**

| Element | Font / weight | Size | Tracking / line-height |
|---|---|---|---|
| Hero headline (Home) | Manrope 800 | 82px | −1.5px, lh 0.98 |
| Page `<h1>` (inner pages) | Manrope 800 | 52px | −1.5px, lh 1 |
| Serif display `<h1>` (Calendar) | Playfair 600 | 52px | −1px |
| Section heading | Playfair 600 | 24–26px | — |
| Kicker label | Manrope 600 | 12px | **3px tracking, uppercase**, color `#a7d0c4` |
| Card / row title | Manrope 700 | 15–17px | — |
| Body | Manrope 400–500 | 14–16px | lh 1.5–1.6 |
| Small label | Manrope 500–600 | 11–13px | — |
| Stat number | Manrope 800 | 30px | −0.5px |

### Shape, spacing, effects

- **Radii:** buttons/pills `24–30px` (fully round for actions); cards `14–18px`;
  large glass cards `22px`; inputs `10–12px`; small chips/tags `16–20px`;
  calendar day cells `9px`; avatar circles `50%`.
- **Content width:** page wrapper `max-width:1440px`; inner content column
  `max-width:1000–1200px`, `padding:0 48px`.
- **Glass cards:** `backdrop-filter: blur(8–18px)` + translucent dark fill +
  `1px rgba(255,255,255,0.1)` border. Booking card shadow:
  `0 24px 60px rgba(0,0,0,0.4)`.
- **Hover:** cards scale `1.05–1.06` with a soft shadow; nav/menu items flip to
  the sage fill with dark text.
- **Kicker pattern (every inner page):** a 34px×1px `#8fc7b6` rule + the
  uppercase 3px-tracked label, above the page `<h1>`.

---

## The "kicker + H1 + lead" page header

Every inner page repeats the same header block; match it exactly:

```
[— 34px rule]  KICKER LABEL (12px, 3px tracking, #a7d0c4)
Page Title (Manrope 800, 52px, −1.5px)
Lead paragraph (15px, rgba(255,255,255,0.6), max-width ~560px)
```

Most inner pages also have a **full-width hero image** behind the header,
faded into the charcoal with a top-to-bottom gradient
(`linear-gradient(180deg, rgba(12,19,22,0.45) → #0c1316)`), centered at 30%
vertical, ~700px tall, sitting behind the content at `z-index:0`.

Kicker labels per page: Home `THE WORLD IS YOURS`, Calendar `AVAILABILITY`,
My Trips `YOUR STAYS`, Admin `MANAGE`, Rules/Access/Lights/Photos `HOUSE INFO`,
Activities/Beaches/Bike & Trails `RECOMMENDATIONS`, Pathways `ISLAND TRAIL MAP`.

---

## Global header / nav (`design-reference/Header.dc.html`)

Top bar, present on every screen. Recreate as the app's `SiteHeader`.

- **Left:** a wave SVG mark (stroke `#8fc7b6`) + wordmark **SHELTER COVE**
  (Manrope 800, 19px, 1.5px tracking, white). Links to Home.
- **Center nav** (Manrope 500, 14.5px, `rgba(255,255,255,0.9)`), gap 34px:
  **Calendar**, **House Info** (dropdown), **My Trips**, **Pathways**, and
  **Admin** (only when the current user is a super user).
  - Active item: white + weight 700.
  - **House Info** is a hover dropdown (glass panel, `rgba(14,22,25,0.97)`,
    radius 12px) with: Rules, Access, Around the House, Lights, Photos. Menu
    items flip to `#6fa793` fill + `#0c1316` text on hover.
- **Right:** a live weather pill (glass, rounded 30px) showing an emoji icon,
  temperature, and short forecast. In the prototype it fetches
  `api.weather.gov` for Hilton Head (32.1896, −80.7501); the pill hides if the
  fetch fails. **Match the styling; source weather however the app prefers** (a
  server route is cleaner than a client fetch).
- Bottom border `1px rgba(255,255,255,0.08)`.

`Header.dc.html` exposes one prop `active` (`"" | calendar | houseinfo | mytrips
| pathways | admin`) to drive the active-link state — mirror that with the
current route.

---

## Screens

Exact style values live in each `design-reference/*.dc.html` file. Map each to
its existing repo component (see the "Screen → repo" table at the end).

### Home — `Wanderlust.dc.html`
- **Full-bleed hero** (coastal photo, min-height 850px) with a two-column grid:
  left = kicker + 82px headline "Welcome to the P/T Beach House" + lead + a
  round sage **"Explore Hilton Head"** button (→ Around the House). Right = the
  **"Schedule Your Stay"** booking card.
- **Booking card** (344px glass card): check-in / check-out date inputs (2-col),
  a "Length of stay" nights readout, a Guests stepper (1–6), a reservation-code
  input, an inline success/error message slot, and a full-width sage **"Check
  Availability"** button. In the app this maps to the existing booking flow that
  writes a `pending` reservation to D1 and validates the code against `users`.
- **Local Favorites** row: 4 photo cards (French Bakery, Poseidon, Skull Creek
  Boathouse, The Sandbar) with rating badge + category, flanked by prev/next
  arrow buttons (next = sage). Cards link out to the venues; hover scales 1.06.
- **Feature tiles** (4-up panel): House Rules, Wi-Fi Access, Bike Trails,
  Beaches — each links to its page and reveals a background image on hover.
- **Stats bar:** 2 Bedrooms · 2 Bathrooms · Sleeps 6, three columns divided by
  hairlines, sage line-icons.

### Calendar — `Calendar.dc.html`
- Page header (serif `<h1>` "Booking Calendar") + legend (Available / Selected /
  Booked).
- **Two month grids side by side** (glass cards). Day cells: available =
  subtle fill; **selected/range = sage** (`#6fa793` endpoints, translucent sage
  mid-range); booked = dimmed + `not-allowed`. Range selection: click start then
  end.
- **Selection summary bar:** check-in / check-out / nights readout, a Guests
  stepper, a reservation-code input, and **Clear** + **Request These Dates**
  (sage) buttons, with the same inline message slot as Home. In the app this
  reads real bookings from D1 and writes a pending request.

### My Trips — `MyTrips.dc.html`
- Page header + a "Viewing as" person `<select>` (prototype-only impersonation;
  in the app this is just the logged-in user).
- Three grouped sections — **Pending review**, **Upcoming**, **Past &
  declined** — each with a diamond bullet, title, count, and an empty-state
  card. Trip rows: a date chip (month + day), date range + nights + family, a
  pending vote line, and a right-aligned status pill (approved/pending/denied
  colors above).

### Admin — `Admin.dc.html`
Page header + a **pill tab bar** (active tab = sage). Five tabs:
1. **Reservations** — request rows with a family-colored avatar, name/family,
   dates + nights; pending rows show a vote readout + **Approve/Deny** buttons
   (Approve = sage, becomes "✓ Approved"); decided rows show a status pill.
   Majority-of-super-users vote logic — keep the app's existing rule.
2. **Around the House** — "+ Add a place" (deep-teal button) then places grouped
   by category (Dining, Beach, Bike & Trails, Activities, Groceries) with a
   remove (×) button per row.
3. **Users** — add/edit user form (name, email, reservation code, family toggle
   Pierce/Thomas, Super User toggle) + a user list with avatar, super-user
   badge, monospace reservation code chip, Edit + remove buttons.
4. **Priority** — ranked family list (First pick / Second) + "Swap priority".
5. **Photos** — the gallery-tile manager (same tiles as the Photos page):
   `<image-slot>` tiles in a 6-col grid with per-tile remove + an "Add photo"
   dashed tile. In the app this manages R2 gallery photos.

### House Info pages
- **Rules — `Rules.dc.html`**: hero + rule content. House-rules copy for both
  families.
- **Access — `Access.dc.html`**: codes/details to get in and connected (Wi-Fi,
  door codes, etc.).
- **Lights — `Lights.dc.html`**: how the Leviton Decora Smart Wi-Fi switches
  work. (No direct repo equivalent yet — the repo currently has a Supplies page
  instead; confirm with the owner whether Lights replaces or supplements it.)
- **Photos — `Photos.dc.html`**: the public gallery, `<image-slot>` tiles in a
  6-col masonry-ish grid driven by `photo-store.js` (→ R2 gallery in the app).

### Recommendations pages
- **Around the House — `Activities.dc.html`**, **Beaches — `Beaches.dc.html`**,
  **Bike & Trails — `BikeTrails.dc.html`**: curated place lists, same header +
  card vocabulary. The full place dataset (25 spots, with categories,
  drive-times, and descriptions) is in `Admin.dc.html`'s `places` array — treat
  that as the seed content.
- **Pathways — `Pathways.dc.html`**: an island bike-path trail map with a legend
  of toggleable route layers. Confirm the map source with the owner.

---

## Interactions & behavior to preserve

- **Booking:** submitting Home or Calendar creates a `pending` reservation
  (already wired to D1). Validate the reservation code against `users`; block
  overlapping dates; show the inline success/error message. Keep the app's
  server-side validation — the prototype's client checks just illustrate intent.
- **Voting:** Admin → Reservations approve/deny resolves by the app's existing
  majority rule; resolution flips status to approved/denied.
- **Nav active state + House Info dropdown** as described above.
- **Hover states:** favorite cards and feature tiles scale ~1.05–1.06; dropdown
  and tab items use the sage-fill treatment.
- **Weather pill** best-effort; hidden on failure.
- **Dates:** keep using the repo's `src/lib/format.ts` helpers — do **not**
  hand-roll `new Date()` math (per `CLAUDE.md`, that caused an off-by-one).

---

## Data model (already in D1 — for reference only)

The prototype's localStorage stores mirror the app's tables:

- **users** — `{ name, email, family (Pierce|Thomas), code, superUser, siteAdmin }`.
  Reservation code is the per-user booking credential; super users vote.
- **reservations** — `{ name, family, code, checkIn, checkOut, status
  (pending|approved|denied), approvals[], denials[] }`.
- **photos (gallery tiles)** — `{ id, label, col, row }` grid spans; images in R2.

Use the **repo schema** (`migrations/*.sql`, `src/lib/db.ts`) as the real
source of truth — these shapes are just to explain the UI.

---

## Assets

In `design-reference/assets/` and `design-reference/uploads/`:

- **Hero photos:** `uploads/IMG_3260.JPEG` (Home hero), `uploads/IMG_3307.JPEG`
  (Calendar hero). These are the owner's real photos — reuse or replace with the
  app's R2 hero images.
- **Local-favorites thumbnails:** `assets/french-bakery.jpg`, `poseidon.jpg`,
  `skullcreek.jpg`, `sandbar.jpg`.
- **Feature-tile hover images:** `assets/house-rules.png`, `wifi-access.png`,
  `bike-trails.png`, `beaches.png`, plus `activities.png`, `lights.png`.
- **Icons** are inline SVG in the markup (wave mark, calendar, guests, bike,
  beach, etc.) — lift them directly.

Fonts: Manrope + Playfair Display from Google Fonts (link above).

---

## Deployment (Cloudflare + GitHub) — unchanged from current setup

The app already deploys to Cloudflare Workers via OpenNext from the GitHub repo.
This redesign is a code change only — commit the re-skinned components and push;
the existing Worker auto-builds on push to `main`. If you haven't set the
project up locally yet, follow the repo `README.md` "First-time setup" (create
D1 `sheltercove-db`, paste the Database ID into `wrangler.jsonc`, apply
`migrations/0001–0003` **manually in the D1 Console** — not
`wrangler d1 migrations apply --remote`, per `CLAUDE.md`, connect the repo to a
Worker with deploy command `npm run deploy`, attach the custom domain).

**Build gotcha:** run `npm run build` (not bare `npx tsc --noEmit`) before
pushing anything touching `fetch()` or ambient globals — `cloudflare-env.d.ts`
is generated by the build.

---

## Screen → repo component map

| Design file | Repo component / route |
|---|---|
| `Wanderlust.dc.html` (Home + booking) | `src/components/BookForm.tsx`, `src/app/(app)/home` |
| `Header.dc.html` | `src/components/SiteHeader.tsx` |
| `Calendar.dc.html` | `src/components/CalendarView.tsx`, `src/app/(app)/calendar` |
| `MyTrips.dc.html` | `src/components/MyTripsView.tsx` |
| `Admin.dc.html` | `src/components/admin/*.tsx` (Reservations, Around, Users, Priority, Photos) |
| `Rules.dc.html` / `Access.dc.html` / `Activities.dc.html` / `Beaches.dc.html` / `BikeTrails.dc.html` | `src/components/HouseInfoView.tsx` (House / Rules / Around tabs) |
| `Photos.dc.html` | `src/components/GalleryView.tsx`, `src/app/api/photos` (R2) |
| `Lights.dc.html` | no direct equivalent — repo has `SuppliesView.tsx`; confirm intent |
| `Pathways.dc.html` | confirm map source with owner |

## Acceptance checklist

- [ ] Every existing screen re-skinned to Coastal Dark; no data/route/logic changes.
- [ ] Tokens match exactly (charcoal `#0c1316`, sage `#6fa793`, accent text `#a7d0c4`, status colors, family accents).
- [ ] Manrope + Playfair loaded via `<link>`; Playfair used only for the noted display accents.
- [ ] Header nav + House Info dropdown + active states + weather pill match.
- [ ] Booking, voting, gallery all still hit D1/R2 as before (dates via `format.ts`).
- [ ] `DESIGN.md` updated to describe Coastal Dark.
- [ ] Pushed to `main`; Cloudflare Worker rebuilt; site verified on the custom domain.

## Repo reference files

- `DESIGN.md` — design tokens (update to Coastal Dark)
- `CLAUDE.md` — build/deploy gotchas (read before pushing)
- `src/app/layout.tsx` — font `<link>` loading
- `src/components/SiteHeader.tsx` — global header
- `src/lib/format.ts` — date helpers (mandatory for any date display)
- `src/lib/db.ts` — schema types
