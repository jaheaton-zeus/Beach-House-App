// Ported 1:1 from the Claude Design prototype's components.jsx Icons object.
// Kept as a map of functions (rather than components) to match the original
// call style used throughout the ported screens: Icons.home(color)

export const Icons = {
  home: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11L12 4L21 11V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V11Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /></svg>
  ),
  calendar: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke={c} strokeWidth="1.6" /><path d="M3 9H21" stroke={c} strokeWidth="1.6" /><path d="M8 3V7M16 3V7" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  plus: (c = "#fff") => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke={c} strokeWidth="2.2" strokeLinecap="round" /></svg>
  ),
  menu: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  trips: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 4 14.5 4 9C4 5.5 7.5 3 12 3C16.5 3 20 5.5 20 9C20 14.5 12 21 12 21Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.6" /></svg>
  ),
  house: (c = "currentColor") => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6" /><path d="M3 12H21M12 3C14.5 6 14.5 18 12 21M12 3C9.5 6 9.5 18 12 21" stroke={c} strokeWidth="1.6" /></svg>
  ),
  chevron: (c = "currentColor") => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  back: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 5L7 10L12 15" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  close: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  check: (c = "currentColor") => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  pin: (c = "currentColor") => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 13C7 13 2 8.5 2 5.5C2 3 4.2 1.5 7 1.5C9.8 1.5 12 3 12 5.5C12 8.5 7 13 7 13Z" stroke={c} strokeWidth="1.4" /><circle cx="7" cy="5.5" r="1.5" stroke={c} strokeWidth="1.4" /></svg>
  ),
  bed: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 18V8M3 14H21M21 18V12C21 11 20 10 19 10H10V14" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="7" cy="12" r="1.5" stroke={c} strokeWidth="1.4" /></svg>
  ),
  bath: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12H21V16C21 17.5 20 19 18 19H6C4 19 3 17.5 3 16V12Z" stroke={c} strokeWidth="1.6" /><path d="M6 12V6C6 5 6.5 4 7.5 4H9" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><circle cx="11" cy="6" r="1.5" stroke={c} strokeWidth="1.4" /><path d="M6 19V21M18 19V21" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  guests: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.6" /><path d="M3 20C3 16.5 5.5 14 9 14C12.5 14 15 16.5 15 20" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><circle cx="16" cy="9" r="2.5" stroke={c} strokeWidth="1.4" /><path d="M14 14C17.5 14 20 16 20 19" stroke={c} strokeWidth="1.4" strokeLinecap="round" /></svg>
  ),
  car: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 17V11L7 6H17L19 11V17H17V19H15V17H9V19H7V17H5Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><circle cx="8.5" cy="14" r="1" fill={c} /><circle cx="15.5" cy="14" r="1" fill={c} /></svg>
  ),
  wifi: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 9C9 5 15 5 19 9" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M8 12C10.5 9.5 13.5 9.5 16 12" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><circle cx="12" cy="16" r="1.5" fill={c} /></svg>
  ),
  key: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="12" r="4" stroke={c} strokeWidth="1.6" /><path d="M11.5 12H21M18 12V15M15 12V14" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  bike: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="16" r="4" stroke={c} strokeWidth="1.6" /><circle cx="18" cy="16" r="4" stroke={c} strokeWidth="1.6" /><path d="M6 16L10 8H14L18 16M9 8H12M14 8L16 5H18" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  wave: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 9C5 6 8 12 12 9C16 6 19 12 22 9M2 15C5 12 8 18 12 15C16 12 19 18 22 15" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  fork: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3V11C7 12 8 13 9 13V21M9 13C10 13 11 12 11 11V3M16 3C14 5 14 9 16 11V21" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  sun: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke={c} strokeWidth="1.6" /><path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.5 5.5L7 7M17 17L18.5 18.5M5.5 18.5L7 17M17 7L18.5 5.5" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  cart: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 4H5L7 16H19L21 8H7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="20" r="1.5" stroke={c} strokeWidth="1.4" /><circle cx="17" cy="20" r="1.5" stroke={c} strokeWidth="1.4" /></svg>
  ),
  rules: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3H16L20 7V20C20 20.5 19.5 21 19 21H6C5.5 21 5 20.5 5 20V4C5 3.5 5.5 3 6 3Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 11H16M9 15H14" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  info: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6" /><path d="M12 11V16M12 8V8.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  settings: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.6" /><path d="M12 2V5M12 19V22M4.2 4.2L6.3 6.3M17.7 17.7L19.8 19.8M2 12H5M19 12H22M4.2 19.8L6.3 17.7M17.7 6.3L19.8 4.2" stroke={c} strokeWidth="1.6" strokeLinecap="round" /></svg>
  ),
  supplies: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 8H19L18 20H6L5 8Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 8V5C9 4 9.5 3 12 3C14.5 3 15 4 15 5V8" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M9 12V16M15 12V16M12 12V16" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" /></svg>
  ),
  alert: (c = "currentColor") => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L22 20H2L12 3Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 10V14M12 17V17.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  checklist: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H19M9 12H19M9 19H19" stroke={c} strokeWidth="1.6" strokeLinecap="round" /><path d="M4 5L5 6L7 4M4 12L5 13L7 11M4 19L5 20L7 18" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  photos: (c = "currentColor") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke={c} strokeWidth="1.6" /><path d="M8 6L9.5 3.5H14.5L16 6" stroke={c} strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="13" r="3" stroke={c} strokeWidth="1.6" /></svg>
  ),
};
