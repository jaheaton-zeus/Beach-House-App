# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Extended family, multiple households, sharing use of a single beach house
("Shelter Cove"). The house has split ownership among several owning
branches, treated as equal. Beyond the owners, the extended family (e.g.
in-laws / related branches such as the Heatons and Pierces) also books
time, plus non-family guests on request. Everyone with an account uses the
same app to view the shared calendar and book stays.

## Product Purpose

Coordinate who gets to stay at the shared house and when, without
double-bookings or disputes, and give the family one place for house
info, rules, supplies, and photos instead of scattered texts/docs.

## Positioning

The core job is conflict-free scheduling under a tiered, rule-based
priority system that a plain shared calendar or group text cannot
enforce on its own — the app is the source of truth for whose turn it is
and what happens when priorities conflict (see Priority admin tab).

## Operating Context

Family members log in (interim email/password against the `users` table;
Cloudflare Access migration in progress) and use: Home, Calendar, Book a
Stay, My Trips, House Info (House/Rules/Around tabs), Gallery, Supplies,
Checkout. Admins manage Reservations, Around the House, Users, Priority,
and Photos.

## Capabilities and Constraints

- Booking priority is tiered, in this order:
  1. **Owners** — during their own designated time, an owning branch has
     first selection. Ownership is split among several branches, treated
     as equal (no branch outranks another).
  2. **Extended family tied to that branch** — when it is a given
     branch's time, that branch's closer extended family (e.g. if it's
     the Pierces' time, the Pierces and the Heatons) has next priority.
  3. **Anyone else** — any other family member/guest may request time
     after the above have had their opportunity.
- This tiering is a real scheduling rule the product must reflect
  accurately (already partially modeled via the admin Priority tab) —
  not just a display convention.
- Auth is an interim, deliberately temporary plaintext-password stand-in
  (`users.password` in D1), pending replacement by Cloudflare Access.
  Nothing long-term should be built assuming the current auth model is
  permanent.
- Condo Information content is still pending a correct source document
  from the project owner (a previously-attached file was an unrelated
  blank template).

## Brand Commitments

- Name: **Shelter Cove**, live at `sheltercove.aheaton.com`.
- Current visual identity is the "Ocean Deck" coastal navy/azure system
  recorded in `DESIGN.md` (2026-08-18 redesign, replacing the earlier
  McLaren F1 papaya/black reskin) — treat `DESIGN.md` as the incumbent
  visual world unless a further redesign is explicitly requested.

## Evidence on Hand

- `CLAUDE.md` documents the full build state: all core screens (Login,
  Home, Calendar, Book a Stay, My Trips, House Info, Gallery, Supplies,
  Checkout) and all five admin tabs are real and wired to D1/R2.
- `design-reference/` preserves the original Claude Design prototype this
  app was ported from.
- No fabricated testimonials, pricing, or customer evidence exists or
  should be invented — this is a private family tool, not a commercial
  product.

## Product Principles

- Priority rules must be accurate and enforced, not just documented —
  disputes over whose turn it is are the failure mode this product
  exists to prevent.
- Treat the interim auth model as temporary scaffolding; don't deepen
  investment in it.
- The house's real content (rules, condo info, photos) is authoritative;
  never invent house facts to fill gaps.
- Family-facing, not consumer-facing: no marketing/persuasion patterns:
  this is an Operate-mode tool for a small trusted group.
