// Date/formatting helpers ported from the prototype's screens.jsx

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function fmtDate(d: string, opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", opts);
}

export function fmtRange(a: string, b: string) {
  const da = new Date(a + "T12:00:00");
  const db = new Date(b + "T12:00:00");
  if (da.getMonth() === db.getMonth()) {
    return `${MONTHS_SHORT[da.getMonth()]} ${da.getDate()} – ${db.getDate()}`;
  }
  return `${MONTHS_SHORT[da.getMonth()]} ${da.getDate()} – ${MONTHS_SHORT[db.getMonth()]} ${db.getDate()}`;
}

export function nightsBetween(a: string, b: string) {
  return Math.max(0, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));
}

export function todayISO() {
  return new Date().toISOString().split("T")[0];
}
