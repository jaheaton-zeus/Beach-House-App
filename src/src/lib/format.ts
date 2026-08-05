// Date/formatting helpers ported from the prototype's screens.jsx

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function fmtDate(d: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return parseLocalDate(d).toLocaleDateString("en-US", opts);
}

export function fmtRange(a: string, b: string) {
  const da = parseLocalDate(a);
  const db = parseLocalDate(b);
  if (da.getMonth() === db.getMonth()) {
    return `${MONTHS_SHORT[da.getMonth()]} ${da.getDate()} – ${db.getDate()}`;
  }
  return `${MONTHS_SHORT[da.getMonth()]} ${da.getDate()} – ${MONTHS_SHORT[db.getMonth()]} ${db.getDate()}`;
}

export function nightsBetween(a: string, b: string) {
  // Compare using UTC-normalized day indices so this is immune to both
  // local midnight/noon mismatches and DST transitions.
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const dayA = Date.UTC(ay, am - 1, ad) / 86400000;
  const dayB = Date.UTC(by, bm - 1, bd) / 86400000;
  return Math.max(0, dayB - dayA);
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
