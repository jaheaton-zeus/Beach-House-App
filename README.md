# Beach House Reservation App

A responsive web app for managing a shared family beach house — reservations, local recommendations, supply inventory, and admin controls.

## Overview

Built as a single-page HTML/React (Babel in-browser) app with a top navigation bar (no sidebar) and an Apple-inspired "Shore" design language: frosted translucent headers, hairline borders, soft shadows, light theme.

## Features

- **Home / Calendar** — dashboard home with a month-grid calendar showing multi-family bookings; each reservation bar segment displays the guest name.
- **Reservations** — request/view stays; status filter pills color-coded by state (amber = Pending, green = Approved, red = Denied).
- **Around** — local restaurant and store recommendations with Google Maps links.
- **Supplies** — shared inventory list with banners for critical/low items.
- **Priority rotation** — alternating booking priority between the Pierce and Thomas families.
- **Admin** — tabbed management for Reservations, Around items, Users, Priority periods, and Site photos.

## Responsive behavior

- Max content width: 1250px.
- Below ~860px: top nav collapses into a hamburger drawer.

## Files

- `Beach House App.html` — entry point, loads React/Babel and the app scripts.
- `main.jsx` — app shell, routing/state, top nav.
- `screens.jsx` — page-level screens (Home/Calendar, Reservations, Around, Admin + tabs).
- `components.jsx` — shared UI components (cards, pills, calendar grid, modals, etc.).
- `app-data.js` — seed/mock data (users, reservations, around items, supplies, priority periods).
- `tweaks-panel.jsx` — in-app tweak controls (dev/testing panel).
- `photos/`, `uploads/` — site image assets.

## Status

Feature-complete: Home/Calendar, Reservations, Around, and full Admin section (Reservations, Around items, Users, Priority periods, Photos) are all built and functional. Theme: Shore (light) only.

## Running locally

Open `Beach House App.html` directly in a browser — no build step required.
