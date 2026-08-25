/**
 * Date helpers for `YYYY-MM-DD` strings.
 *
 * Every date in this app is a plain calendar date with no time component:
 * check-in, check-out, and today. Mixing those with timestamps that carry a
 * time of day is what produced an off-by-one bug in an earlier version of this
 * app — a `Math.round()` over a day difference landed on an exact .5 boundary
 * and tipped the wrong way.
 *
 * The fix, and the rule here: parse every date string to **noon local time**,
 * so a whole number of days always separates two dates no matter the timezone
 * or a DST shift in between. Never call `new Date(str)` on a date string
 * elsewhere in the app — go through `parseLocalDate`.
 */

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const MONTHS_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_MS = 86_400_000;

/** Parse `YYYY-MM-DD` into a Date anchored at local noon. */
export function parseLocalDate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

/** Format a Date back to `YYYY-MM-DD`. */
export function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Today as `YYYY-MM-DD`, in the viewer's local timezone. */
export function todayString(): string {
  return toDateString(new Date());
}

/** True when `value` looks like a well-formed calendar date. */
export function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = parseLocalDate(value);
  return !Number.isNaN(date.getTime()) && toDateString(date) === value;
}

/** Whole nights between two dates. Never negative. */
export function nights(checkIn: string, checkOut: string): number {
  if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) return 0;
  const diff = parseLocalDate(checkOut).getTime() - parseLocalDate(checkIn).getTime();
  return Math.max(0, Math.round(diff / DAY_MS));
}

export function nightsLabel(checkIn: string, checkOut: string): string {
  const n = nights(checkIn, checkOut);
  return `${n} ${n === 1 ? "night" : "nights"}`;
}

/** "Sep 12 – 19, 2026", collapsing the month when both dates share one. */
export function formatRange(checkIn: string, checkOut: string): string {
  if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) return "";
  const a = parseLocalDate(checkIn);
  const b = parseLocalDate(checkOut);
  const sameMonth = a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  if (sameMonth) {
    return `${MONTHS_SHORT[a.getMonth()]} ${a.getDate()} – ${b.getDate()}, ${b.getFullYear()}`;
  }
  return `${MONTHS_SHORT[a.getMonth()]} ${a.getDate()} – ${MONTHS_SHORT[b.getMonth()]} ${b.getDate()}, ${b.getFullYear()}`;
}

/** "June 12, 2026" — used in the calendar's selection summary. */
export function formatLongDate(value: string): string {
  if (!isValidDateString(value)) return "—";
  const d = parseLocalDate(value);
  return `${MONTHS_LONG[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

/** The "SEP / 12" chip on a My Trips row. */
export function dateChip(value: string): { month: string; day: number } {
  const d = parseLocalDate(value);
  return { month: MONTHS_SHORT[d.getMonth()].toUpperCase(), day: d.getDate() };
}

export function monthLabel(month: number): string {
  return MONTHS_LONG[month];
}

/** Days in a month, and the weekday its 1st falls on (0 = Sunday). */
export function monthGrid(year: number, month: number): { days: number; startDow: number } {
  return {
    days: new Date(year, month + 1, 0).getDate(),
    startDow: new Date(year, month, 1).getDay(),
  };
}

/** Add months to a { year, month } pair, rolling the year over. */
export function addMonths(year: number, month: number, delta: number): { year: number; month: number } {
  const total = year * 12 + month + delta;
  return { year: Math.floor(total / 12), month: ((total % 12) + 12) % 12 };
}

/** Compare two date strings. Safe because the format sorts lexicographically. */
export function isBefore(a: string, b: string): boolean {
  return a < b;
}

/**
 * Half-open overlap test: a stay running [inA, outA) collides with [inB, outB)
 * only if each starts before the other ends. Back-to-back stays — one family
 * checking out the morning another checks in — do not overlap.
 */
export function rangesOverlap(inA: string, outA: string, inB: string, outB: string): boolean {
  return inA < outB && outA > inB;
}
