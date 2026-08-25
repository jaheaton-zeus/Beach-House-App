# Design — "Coastal Dark"

Dark teal-on-charcoal. Tokens below are the source of truth and are defined as
CSS custom properties at the top of `src/app/globals.css`. The rendered
prototypes in `design_handoff_shelter_cove_redesign/design-reference/` show how
they compose per screen; `screenshots/` has a capture of each.

## Color

| Role | Value | Token |
|---|---|---|
| Page background (charcoal) | `#0c1316` | `--bg` |
| Panel / card surface | `rgba(12,19,22,0.82)` | `--panel` |
| Glass card | `rgba(14,22,25,0.72)` | `--glass` |
| Solid glass (menus, modal) | `rgba(14,22,25,0.97)` | `--glass-solid` |
| Card border (hairline) | `rgba(255,255,255,0.1)` | `--hairline` |
| Subtle fill (inputs, chips) | `rgba(255,255,255,0.05)` | `--subtle-fill` |
| Subtle border | `rgba(255,255,255,0.08)` | `--subtle-border` |
| Primary text | `#ffffff` | `--text` |
| Secondary text | `rgba(255,255,255,0.6)` | `--text-2` |
| Muted / label text | `rgba(255,255,255,0.45)` | `--text-3` |
| **Primary accent (sage)** | `#6fa793` | `--sage` |
| Accent light | `#a7d0c4` | `--accent` |
| Accent lighter (kickers, rules) | `#8fc7b6` | `--accent-lt` |
| Link | `#7fb6a6` → hover `#a7d0c4` | `--link` |
| Deep teal (Add buttons) | `#0f4c5c` | `--deep-teal` |

**Button text on sage is dark** — `#0c1316` on `#6fa793`, never white.

### Status

| Status | Text | Fill / border |
|---|---|---|
| Approved | `#a7d0c4` (`#bfe6d8` in messages) | `rgba(111,167,147,0.16)` / `rgba(111,167,147,0.3)` |
| Pending | `#e8c877` | `rgba(230,190,90,0.16)` / `rgba(230,190,90,0.32)` |
| Denied | `#e39b8c` (`#f0b3a6` in messages) | `rgba(210,90,70,0.16)` / `rgba(210,90,70,0.34)` |

### Family accent

- **Pierce** — bg `rgba(255,107,74,0.18)`, border `rgba(255,107,74,0.4)`, fg `#ff9a80`
- **Thomas** — bg `rgba(111,167,147,0.18)`, border `rgba(111,167,147,0.4)`, fg `#a7d0c4`

## Typography

Manrope and Playfair Display, loaded with a `<link>` in `layout.tsx` (not
`next/font/google` — see `CLAUDE.md`).

**Manrope is the default for everything.** Playfair is used only for a few
display accents: the "Schedule Your Stay" card title, "Local Favorites", and
the Calendar `<h1>` with its month labels. Every other `<h1>` is Manrope 800.

| Element | Font / weight | Size | Tracking / line-height |
|---|---|---|---|
| Hero headline (Home) | Manrope 800 | 82px | −1.5px, lh 0.98 |
| Page `<h1>` | Manrope 800 | 52px | −1.5px, lh 1 |
| Serif `<h1>` (Calendar) | Playfair 600 | 52px | −1px |
| Section heading | Playfair 600 | 24–26px | — |
| Kicker label | Manrope 600 | 12px | 3px tracking, uppercase, `#a7d0c4` |
| Card / row title | Manrope 700 | 15–17px | — |
| Body | Manrope 400–500 | 14–16px | lh 1.5–1.6 |
| Stat number | Manrope 800 | 30px | −0.5px |

Both headline sizes are `clamp()`ed down on narrow screens.

## Shape, spacing, effects

- **Radii:** action buttons `24–30px` (pill); cards `14–18px`; large glass cards
  `22px`; inputs `10–12px`; chips `16–20px`; calendar day cells `9px`; avatars `50%`.
- **Content width:** page wrapper `max-width:1440px`; inner column
  `1000–1200px` with `padding: 0 48px` (20px under 900px).
- **Glass:** `backdrop-filter: blur(8–18px)` + translucent dark fill + a
  `1px rgba(255,255,255,0.1)` border. Booking card shadow
  `0 24px 60px rgba(0,0,0,0.4)`.
- **Hover:** cards scale 1.05–1.06 with a soft shadow; nav and tab items flip to
  sage fill with dark text.
- **Kicker pattern:** a 34px×1px `#8fc7b6` rule then the tracked uppercase label,
  above the page `<h1>` (`.sc-kicker`, `<PageHeader>`).
- **Page hero:** a full-width photo faded into the charcoal with a five-stop
  `linear-gradient(180deg, …)`, centered at 30% vertical, behind the content at
  `z-index: 0` (`<HeroBackdrop>`).

Kicker labels per page: Home `THE WORLD IS YOURS`, Calendar `AVAILABILITY`,
My Trips `YOUR STAYS`, Admin `MANAGE`, Rules/Access/Lights/Photos `HOUSE INFO`,
Around the House/Beaches/Bike & Trails `RECOMMENDATIONS`, Pathways
`ISLAND TRAIL MAP`.

## Where this deviates from the prototype

1. **Admin is always in the nav.** The prototype hid it unless the current user
   was a super user; here it is visible to everyone and the code modal is the
   gate.
2. **The calendar has month navigation.** The prototype hardcoded June/July 2026;
   a live calendar needs arrows, styled into the month card header.
3. **Every screen is responsive.** The prototype is a fixed 1440px desktop
   design. Breakpoints live at the bottom of each section in `globals.css`.
