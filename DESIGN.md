---
name: Shelter Cove
description: A family beach house reservation app in a coastal navy-and-azure visual language.
colors:
  deep-tide: "#0E2A4D"
  ocean-azure: "#1D63E0"
  azure-soft: "#DCEAFC"
  azure-deep: "#12459E"
  seafoam-teal: "#12A594"
  seafoam-soft: "#D3F3EE"
  sea-mist: "#F5F8FB"
  cloud-white: "#FFFFFF"
  mist-blue: "#EDF3F8"
  azure-tint: "#E8F1FB"
  text-muted: "#5C6B7A"
  text-subtle: "#93A2B0"
  hairline: "#E2E9F0"
  hairline-soft: "#EEF3F8"
  coral-sunset: "#FF6B4A"
  coral-soft: "#FFE3DA"
  coral-deep: "#C23F22"
  sand-amber: "#FFF1C7"
  sand-amber-deep: "#8A6100"
  coral-denied: "#FCE1DC"
  coral-denied-deep: "#B23B26"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(1.375rem, 3vw, 2.375rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  chip: "3px"
  logo: "10px"
  input: "12px"
  card: "16px"
  hero: "22px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.ocean-azure}"
    textColor: "#FFFFFF"
    typography: "{typography.display}"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  button-primary-hover:
    backgroundColor: "{colors.azure-deep}"
  button-dark:
    backgroundColor: "{colors.deep-tide}"
    textColor: "#FFFFFF"
    rounded: "{rounded.pill}"
    padding: "11px 18px"
  card:
    backgroundColor: "{colors.cloud-white}"
    textColor: "{colors.deep-tide}"
    rounded: "{rounded.card}"
    padding: "18px 20px"
---

# Design System: Shelter Cove

## Overview

**Creative North Star: "Ocean Deck"**

Shelter Cove reads like the deck of a house that faces the water: a deep
tide-navy horizon (headers, footers, hero overlays) grounds a bright,
airy foreground of soft sea-mist white and one confident ocean-azure
accent. Where the app's earlier identity borrowed an F1 pit-wall
language — sharp corners, uppercase tracked mono labels, a racing-stripe
accent rail on every card — this system replaces that with something a
family actually relaxes into: rounded cards, pill-shaped buttons, soft
diffuse shadows instead of hard-edged ones, and headline type that reads
as confident rather than technical.

The palette is Restrained-to-Committed: neutrals and white carry most
surfaces, navy commits whole regions (header, nav, footers, photo
overlays), and ocean-azure is the single accent that marks anything
actionable — buttons, links, active nav state, the "next stay" pill. Two
family-branch colors (coral-sunset for Pierce, seafoam-teal for Thomas)
exist alongside the primary azure but never compete with it: they're
reserved for person/family identity — avatars, the priority banner —
never for actions a user can click.

**Key Characteristics:**
- Deep navy grounds structural regions; white/mist surfaces carry content
- One accent (ocean-azure) marks every actionable element, nothing else
- Fully rounded corners and pill buttons; no sharp edges, no accent rails
- Soft, diffuse shadows (never hard-edged or high-contrast)
- Bold geometric display type in normal case, not uppercase-tracked

## Colors

A cool, coastal palette: navy and azure carry the identity, warm coral
and teal mark family identity, and neutrals stay quietly blue-tinted
rather than warm/beige.

### Primary
- **Ocean Azure** (`#1D63E0`): The single accent color. Every button,
  active link, active nav underline, and interactive highlight uses this
  and only this. Its rarity is what makes it legible as "you can act
  here."

### Secondary
- **Deep Tide** (`#0E2A4D`): The navy that grounds structural regions —
  page headers, the desktop nav bar, footers, photo-card gradient
  overlays, and primary body text. Not a decorative color; it's the
  system's ground plane wherever full-bleed photography or navigation
  chrome needs a dark base.
- **Seafoam Teal** (`#12A594`): Thomas family identity color, and the
  "approved" status badge hue. Doubles as the app's secondary coastal
  accent (echoing the ocean itself) without ever being used for buttons.

### Tertiary
- **Coral Sunset** (`#FF6B4A`): Pierce family identity color. Paired
  with Seafoam Teal, the two sit ~160° apart on the hue wheel — chosen
  deliberately so family badges and avatars stay instantly distinguishable
  at a glance, which matters here because family color-coding is
  functional (booking-priority scanning), not decorative.
- **Sand Amber** (`#FFF1C7` / text `#8A6100`): Pending-status badge only.

### Neutral
- **Sea Mist** (`#F5F8FB`): Page background.
- **Cloud White** (`#FFFFFF`): Card and surface background.
- **Mist Blue** (`#EDF3F8`): Secondary surface fill (hover states, alt
  panels, icon-button backgrounds).
- **Deep Tide** (`#0E2A4D`) at full strength for body text; `#5C6B7A`
  (Text Muted) for secondary text; `#93A2B0` (Text Subtle) for the
  quietest labels and disabled-adjacent content.
- **Hairline** (`#E2E9F0`): Default border/divider color, always thin
  (0.5–1px) and low-contrast — the system never uses a heavy border.

### Named Rules
**The One Accent Rule.** Ocean Azure is the only color a user should
ever read as "clickable." Family colors, status colors, and navy never
substitute for it on an actionable element.

## Typography

**Display Font:** Plus Jakarta Sans (with system sans-serif fallback)
**Body Font:** DM Sans (with system sans-serif fallback)

**Character:** Plus Jakarta Sans is bold, geometric, and rounded at the
terminals — confident without being technical. It replaces the previous
identity's Titillium Web, whose condensed, motorsport-derived shapes are
exactly what this redesign moves away from. DM Sans stays as the body
face; it was already quiet and legible and needed no replacement.

### Hierarchy
- **Display** (800, `clamp(1.375rem, 3vw, 2.375rem)`, 1.1 line-height,
  −0.02em tracking): Page-level headings — "Hi, Sarah," the hero house
  card title, the login headline. Always normal case; the previous
  system's uppercase treatment is retired everywhere except short kicker
  labels.
- **Title** (700, 15–17px): Section headings, nav wordmark, card titles.
- **Body** (400–600, 13–15px): All running text, form fields, card copy.
- **Label** (700, 11px, 0.06em tracking, uppercase): Kickers only — "THE
  BEACH HOUSE," "PRIORITY TO," "A LOOK INSIDE." The one place uppercase
  survives, because it reads as an editorial kicker, not a racing HUD.

### Named Rules
**The No-Shout Rule.** Uppercase and heavy tracking are reserved for
kickers under 20 characters. A full headline or button label is never
set in uppercase — that was the old system's tell, and reintroducing it
anywhere is a regression to the retired identity.

## Layout

Single-column on mobile; a fixed two-column dashboard grid on desktop
(`minmax(0,1.6fr) minmax(0,1fr)`, 28px gap) for the Home screen, with a
1250px max-width container centered on the page. Section rhythm is loose
— 20–24px of vertical padding between stacked blocks — with a
consistent left-aligned kicker (`SectionLabel`) introducing each group.
Photo strips scroll horizontally on both breakpoints rather than
wrapping.

## Elevation & Depth

Flat-by-default with soft ambient shadows, never hard-edged. Cards rest
on a two-layer diffuse shadow (`0 1px 1px rgba(14,42,77,0.03), 0 4px
16px rgba(14,42,77,0.06)`) tinted with the navy ground color rather than
pure black, so shadows read as "lifted off the sea-mist background"
rather than as generic drop-shadows. Photo cards use a bottom-anchored
navy gradient overlay (`rgba(9,26,48,…)`) for caption legibility instead
of a shadow.

### Named Rules
**The Tinted Shadow Rule.** Every shadow uses `rgba(14,42,77,…)`
(Deep Tide at low opacity), never `rgba(0,0,0,…)`. A pure-black shadow
reads as generic; a navy-tinted one reads as this system's.

## Shapes

Fully rounded, no sharp corners anywhere — the clearest visual break
from the previous identity's sharp-cornered "telemetry panel" cards and
their 3px accent top rail (both retired). Corner radius scales with
element size: 12px on inputs, 16px on standard cards, 22–26px on
full-bleed hero/photo cards, and 999px (true pill) on every button,
status badge, and small tag. Circular avatars and icon buttons stay
fully round (50%).

### Named Rules
**The No-Sharp-Corner Rule.** Nothing in this system ships with a
border-radius under 3px. A square-cornered card or button is the old
identity leaking back in.

## Components

### Buttons
- **Shape:** Full pill (`border-radius: 999px`).
- **Primary:** Ocean Azure background, white text, Plus Jakarta Sans
  700, normal case, 11–15px padding scaled by size.
- **Dark variant:** Deep Tide background, white text — used for the
  default/neutral primary action (e.g. "Sign In") where azure would be
  too loud.
- **Hover / Press:** Scale to 0.97 on press; background darkens to
  `azure-deep` (`#12459E`) on the accent variant.
- **Secondary / Ghost / Light:** Fill with `mist-blue`, transparent, or
  white respectively; text stays Deep Tide.

### Cards / Containers
- **Corner Style:** 16px (standard), 22–26px (hero/photo).
- **Background:** Cloud White.
- **Shadow Strategy:** See Elevation & Depth — soft, navy-tinted,
  two-layer.
- **Border:** 1px Hairline (`#E2E9F0`), present but low-contrast; hero
  cards drop the border in favor of the shadow alone.
- **Internal Padding:** 18–20px.

### Inputs / Fields
- **Style:** 12px radius, 1px Hairline border, Cloud White (or
  translucent white-on-navy for the login screen's glass card).
- **Focus:** Border shifts to Ocean Azure; a soft 4px azure glow ring
  (`{accent}1a`) appears around the field.

### Status Badges
- **Style:** Full pill, DM Sans 700 uppercase, 11px, no longer
  monospace — the previous mono/uppercase "telemetry tag" treatment is
  retired in favor of the same sans face used everywhere else.
- **Palette:** Approved → Seafoam Teal on its soft tint; Pending → Sand
  Amber; Denied → Coral Denied.

### Navigation
- **Header:** Sticky, translucent-blurred Cloud White bar on mobile; a
  two-row navy (`Deep Tide`) desktop bar beneath it holds primary nav
  links in white/60%-white, with the active item marked by a 3px
  Ocean Azure underline (rounded top corners) — replacing the previous
  diagonal racing-chevron indicator.
- **Mobile:** Slide-down sheet, Plus Jakarta Sans/DM Sans mix, azure for
  the active item's icon and label.

### Family Identity (signature pattern)
Avatars, the home-screen "Priority To" banner, and family badges all key
off `FAMILY_COLORS` (Pierce = Coral Sunset, Thomas = Seafoam Teal) rather
than the shared theme accent — this is the one place two non-azure
colors are allowed to appear as strongly as an accent, because the
color-coding does real work: it lets someone scan the booking-priority
strip or an upcoming-stays list and identify "whose turn is it" without
reading text.

## Do's and Don'ts

### Do:
- **Do** use Ocean Azure for every actionable element and nothing else.
- **Do** keep every corner radius at 12px or above, or a true pill
  (999px) — no exceptions for "small" UI like tags or chips.
- **Do** tint shadows with Deep Tide navy, never pure black.
- **Do** reserve uppercase type for kickers under ~20 characters.
- **Do** keep Pierce/Thomas family colors reserved for identity, never
  reused for a generic action button.

### Don't:
- **Don't** reintroduce sharp corners, accent top-rails on cards, or
  uppercase-tracked headline type — those are the retired identity.
- **Don't** set body or button text in JetBrains Mono; monospace is
  fully retired from this system.
- **Don't** use warm cream/beige neutrals — this system's neutrals are
  cool and blue-tinted (Sea Mist, Mist Blue), not the earlier warm
  off-white.
- **Don't** let a family color double as a button or link color; that
  collapses the "azure means clickable" convention this system depends
  on.
