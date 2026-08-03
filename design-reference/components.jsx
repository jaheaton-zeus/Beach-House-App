// Shared UI components — Apple-polish + Claude-warm-beach palette

const THEMES = {
  shore: {
    name: "Shore",
    // Claude-inspired warm cream + beachy accents
    bg: "#F7F4EE",
    surface: "#FFFFFF",
    surfaceAlt: "#F0EBE2",
    surfaceTint: "#FAF7F1",
    accent: "#C96442",        // Claude warm terracotta
    accentSoft: "#F5E6DD",
    accentDeep: "#A04D2F",
    ocean: "#5B8BA8",         // dusty seafoam blue
    oceanSoft: "#DDE7EE",
    text: "#1F1B16",
    textMuted: "#7A6F62",
    textSubtle: "#A89F90",
    border: "#E8E1D4",
    borderSoft: "#F0EAE0",
    headerBg: "#1F1B16",
    headerText: "#FFFFFF",
    badge: {
      approved: "#E0EBD6", approvedText: "#3D5A2E",
      pending: "#F5E6DD", pendingText: "#8B4220",
      denied: "#F0DAD8", deniedText: "#8B1A1A"
    }
  },
  dusk: {
    name: "Dusk",
    // Dark mode — warm charcoal + same terracotta/ocean accents
    bg: "#17140F",
    surface: "#211D17",
    surfaceAlt: "#2A251D",
    surfaceTint: "#1D1A14",
    accent: "#E08561",        // brightened terracotta for dark contrast
    accentSoft: "#3A2A22",
    accentDeep: "#F2A382",
    ocean: "#7FA9C4",         // brightened dusty blue
    oceanSoft: "#233039",
    text: "#F3EFE7",
    textMuted: "#A79A89",
    textSubtle: "#766B5C",
    border: "#332C22",
    borderSoft: "#2A251D",
    headerBg: "#0F0D09",
    headerText: "#F3EFE7",
    badge: {
      approved: "#233522", approvedText: "#9BCB82",
      pending: "#3A2A1A", pendingText: "#E5A868",
      denied: "#3A201E", deniedText: "#E58787"
    }
  }
};
window.THEMES = THEMES;

// SF-style icon system using Unicode + custom SVGs
const Icons = {
  home: (c = "currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11L12 4L21 11V20C21 20.5523 20.5523 21 20 21H15V14H9V21H4C3.44772 21 3 20.5523 3 20V11Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/></svg>,
  calendar: (c = "currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke={c} strokeWidth="1.6"/><path d="M3 9H21" stroke={c} strokeWidth="1.6"/><path d="M8 3V7M16 3V7" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  plus: (c = "#fff") => <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke={c} strokeWidth="2.2" strokeLinecap="round"/></svg>,
  menu: (c = "currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  trips: (c = "currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21C12 21 4 14.5 4 9C4 5.5 7.5 3 12 3C16.5 3 20 5.5 20 9C20 14.5 12 21 12 21Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="12" cy="9" r="2.5" stroke={c} strokeWidth="1.6"/></svg>,
  house: (c = "currentColor") => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6"/><path d="M3 12H21M12 3C14.5 6 14.5 18 12 21M12 3C9.5 6 9.5 18 12 21" stroke={c} strokeWidth="1.6"/></svg>,
  chevron: (c = "currentColor") => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4L10 8L6 12" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  back: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 5L7 10L12 15" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  close: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  check: (c = "currentColor") => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8L6.5 11.5L13 5" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  pin: (c = "currentColor") => <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 13C7 13 2 8.5 2 5.5C2 3 4.2 1.5 7 1.5C9.8 1.5 12 3 12 5.5C12 8.5 7 13 7 13Z" stroke={c} strokeWidth="1.4"/><circle cx="7" cy="5.5" r="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  bed: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 18V8M3 14H21M21 18V12C21 11 20 10 19 10H10V14" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="12" r="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  bath: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12H21V16C21 17.5 20 19 18 19H6C4 19 3 17.5 3 16V12Z" stroke={c} strokeWidth="1.6"/><path d="M6 12V6C6 5 6.5 4 7.5 4H9" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><circle cx="11" cy="6" r="1.5" stroke={c} strokeWidth="1.4"/><path d="M6 19V21M18 19V21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  guests: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke={c} strokeWidth="1.6"/><path d="M3 20C3 16.5 5.5 14 9 14C12.5 14 15 16.5 15 20" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><circle cx="16" cy="9" r="2.5" stroke={c} strokeWidth="1.4"/><path d="M14 14C17.5 14 20 16 20 19" stroke={c} strokeWidth="1.4" strokeLinecap="round"/></svg>,
  car: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 17V11L7 6H17L19 11V17H17V19H15V17H9V19H7V17H5Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="8.5" cy="14" r="1" fill={c}/><circle cx="15.5" cy="14" r="1" fill={c}/></svg>,
  wifi: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 9C9 5 15 5 19 9" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><path d="M8 12C10.5 9.5 13.5 9.5 16 12" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill={c}/></svg>,
  key: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="8" cy="12" r="4" stroke={c} strokeWidth="1.6"/><path d="M11.5 12H21M18 12V15M15 12V14" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  bike: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="16" r="4" stroke={c} strokeWidth="1.6"/><circle cx="18" cy="16" r="4" stroke={c} strokeWidth="1.6"/><path d="M6 16L10 8H14L18 16M9 8H12M14 8L16 5H18" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  wave: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 9C5 6 8 12 12 9C16 6 19 12 22 9M2 15C5 12 8 18 12 15C16 12 19 18 22 15" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  fork: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M7 3V11C7 12 8 13 9 13V21M9 13C10 13 11 12 11 11V3M16 3C14 5 14 9 16 11V21" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  sun: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke={c} strokeWidth="1.6"/><path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.5 5.5L7 7M17 17L18.5 18.5M5.5 18.5L7 17M17 7L18.5 5.5" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  cart: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 4H5L7 16H19L21 8H7" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.5" stroke={c} strokeWidth="1.4"/><circle cx="17" cy="20" r="1.5" stroke={c} strokeWidth="1.4"/></svg>,
  rules: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3H16L20 7V20C20 20.5 19.5 21 19 21H6C5.5 21 5 20.5 5 20V4C5 3.5 5.5 3 6 3Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 11H16M9 15H14" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  info: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.6"/><path d="M12 11V16M12 8V8.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  settings: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.6"/><path d="M12 2V5M12 19V22M4.2 4.2L6.3 6.3M17.7 17.7L19.8 19.8M2 12H5M19 12H22M4.2 19.8L6.3 17.7M17.7 6.3L19.8 4.2" stroke={c} strokeWidth="1.6" strokeLinecap="round"/></svg>,
  supplies: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 8H19L18 20H6L5 8Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 8V5C9 4 9.5 3 12 3C14.5 3 15 4 15 5V8" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><path d="M9 12V16M15 12V16M12 12V16" stroke={c} strokeWidth="1.4" strokeLinecap="round" opacity="0.5"/></svg>,
  alert: (c = "currentColor") => <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L22 20H2L12 3Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/><path d="M12 10V14M12 17V17.5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  checklist: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 5H19M9 12H19M9 19H19" stroke={c} strokeWidth="1.6" strokeLinecap="round"/><path d="M4 5L5 6L7 4M4 12L5 13L7 11M4 19L5 20L7 18" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  photos: (c = "currentColor") => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke={c} strokeWidth="1.6"/><path d="M8 6L9.5 3.5H14.5L16 6" stroke={c} strokeWidth="1.6" strokeLinejoin="round"/><circle cx="12" cy="13" r="3" stroke={c} strokeWidth="1.6"/></svg>,
};
window.Icons = Icons;

// Family color tokens
const FAMILY_COLORS = {
  Pierce: { primary: "#C96442", soft: "#F5E6DD", deep: "#8B4220", letter: "P" },
  Thomas: { primary: "#5B8BA8", soft: "#DDE7EE", deep: "#3A627A", letter: "T" }
};
window.FAMILY_COLORS = FAMILY_COLORS;

// Avatar — refined w/ family-aware coloring
function Avatar({ initials, size = 36, family }) {
  const fc = family && FAMILY_COLORS[family];
  const bg = fc ? fc.primary : "#7A6F62";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: bg, color: "#fff",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.36, fontWeight: 600, letterSpacing: "0.01em",
      flexShrink: 0, fontFamily: "'DM Sans', sans-serif"
    }}>{initials}</div>
  );
}

// Pill / badge
function Badge({ status, theme, family }) {
  if (family) {
    const fc = FAMILY_COLORS[family];
    return (
      <span style={{
        background: fc.soft, color: fc.deep,
        padding: "3px 10px", borderRadius: 99,
        fontSize: 11, fontWeight: 600, letterSpacing: "0.02em",
        display: "inline-flex", alignItems: "center", gap: 5
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: fc.primary }}></span>
        {family}
      </span>
    );
  }
  const t = theme.badge;
  const map = {
    approved: { bg: t.approved, color: t.approvedText, label: "Approved" },
    pending: { bg: t.pending, color: t.pendingText, label: "Pending" },
    denied: { bg: t.denied, color: t.deniedText, label: "Denied" },
  };
  const s = map[status] || map.pending;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.02em"
    }}>{s.label}</span>
  );
}

// Card — refined Apple-style
function Card({ children, style = {}, onClick, theme, hoverable = true }) {
  const [press, setPress] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseDown={() => onClick && setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{
        background: theme.surface,
        border: `0.5px solid ${theme.border}`,
        borderRadius: 20,
        padding: "18px 20px",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s",
        boxShadow: "0 1px 1px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.05)",
        transform: press ? "scale(0.985)" : "scale(1)",
        ...style
      }}
    >{children}</div>
  );
}

// Button — refined
function Btn({ children, onClick, variant = "primary", size = "md", style = {}, disabled = false, theme, full = false }) {
  const [press, setPress] = React.useState(false);
  const base = {
    border: "none", borderRadius: 12, cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
    transition: "transform 0.1s, opacity 0.15s, background 0.15s",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    gap: 6, opacity: disabled ? 0.4 : 1,
    padding: size === "sm" ? "7px 14px" : size === "lg" ? "15px 24px" : "11px 18px",
    fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
    transform: press && !disabled ? "scale(0.97)" : "scale(1)",
    width: full ? "100%" : "auto",
    letterSpacing: "-0.005em"
  };
  const variants = {
    primary: { background: theme.text, color: "#fff" },
    accent: { background: theme.accent, color: "#fff" },
    secondary: { background: theme.surfaceAlt, color: theme.text },
    ghost: { background: "transparent", color: theme.text },
    light: { background: "#fff", color: theme.text, border: `0.5px solid ${theme.border}` }
  };
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{ ...base, ...variants[variant], ...style }}
    >{children}</button>
  );
}

// Input
function Input({ label, type = "text", value, onChange, placeholder, style = {}, theme }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted, letterSpacing: "0.01em" }}>{label}</label>}
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? theme.accent : theme.border}`,
          borderRadius: 12, padding: "12px 14px",
          fontSize: 15, fontFamily: "'DM Sans', sans-serif",
          background: theme.surface, color: theme.text,
          outline: "none", transition: "all 0.15s",
          boxShadow: focus ? `0 0 0 4px ${theme.accent}1a` : "none"
        }}
      />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder, rows = 3, style = {}, theme }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted }}>{label}</label>}
      <textarea
        value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? theme.accent : theme.border}`,
          borderRadius: 12, padding: "12px 14px",
          fontSize: 15, fontFamily: "'DM Sans', sans-serif",
          background: theme.surface, color: theme.text,
          outline: "none", resize: "vertical", transition: "all 0.15s",
          boxShadow: focus ? `0 0 0 4px ${theme.accent}1a` : "none"
        }}
      />
    </div>
  );
}

// Nav items shared by header + sidebar
function navLinks(currentUser) {
  const base = [
    { id: "home", icon: Icons.home, label: "Home" },
    { id: "calendar", icon: Icons.calendar, label: "Calendar" },
    { id: "book", icon: Icons.plus, label: "Book a Stay" },
    { id: "mytrips", icon: Icons.trips, label: "My Trips" },
    { id: "info", icon: Icons.house, label: "House Info" },
  ];
  if (currentUser?.role === "admin") base.push({ id: "admin", icon: Icons.rules, label: "Admin" });
  return base;
}

// Site header — top navbar (desktop) + hamburger drawer (mobile)
function SiteHeader({ screen, setScreen, currentUser, theme, navStyle, showAdminBadge, onLogout, mobileOpen, setMobileOpen }) {
  const items = navLinks(currentUser);
  const isActive = (id) => screen === id || (id === "info" && ["rules", "recs"].includes(screen));
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 200, background: `${theme.surface}CC`, backdropFilter: "blur(20px) saturate(180%)", WebkitBackdropFilter: "blur(20px) saturate(180%)", borderBottom: `0.5px solid ${theme.border}` }}>
      <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62, gap: 20 }}>
        <button onClick={() => setScreen("home")} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: theme.accent, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'DM Serif Display', serif", fontWeight: 700, fontSize: 15, flexShrink: 0 }}>S</div>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: theme.text, whiteSpace: "nowrap" }}>Shelter Cove</span>
        </button>

        {navStyle === "top" && (
          <nav className="om-desktop-only" style={{ display: "flex", gap: 2 }}>
            {items.map(it => (
              <button key={it.id} onClick={() => setScreen(it.id)} style={{
                padding: "8px 14px", borderRadius: 8, border: "none", cursor: "pointer", whiteSpace: "nowrap",
                background: isActive(it.id) ? theme.surfaceAlt : "transparent",
                color: isActive(it.id) ? theme.text : theme.textMuted,
                fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
              }}>{it.label}</button>
            ))}
          </nav>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="om-desktop-only" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Avatar initials={currentUser.avatar} size={26} family={currentUser.family} />
            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, whiteSpace: "nowrap" }}>{currentUser.family} family</span>
            {currentUser.role === "admin" && showAdminBadge && (
              <span style={{ fontSize: 9, padding: "2px 7px", background: theme.text, color: "#fff", borderRadius: 99, fontWeight: 600, letterSpacing: "0.06em" }}>ADMIN</span>
            )}
            <button onClick={onLogout} style={{ fontSize: 12, color: theme.textMuted, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", padding: 0, marginLeft: 6, whiteSpace: "nowrap", flexShrink: 0 }}>Sign out</button>
          </div>
          <button className="om-mobile-only" onClick={() => setMobileOpen(o => !o)} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: theme.text, alignItems: "center" }}>
            {mobileOpen ? Icons.close(theme.text) : Icons.menu(theme.text)}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="om-mobile-only" style={{ flexDirection: "column", borderTop: `0.5px solid ${theme.border}`, padding: "10px 20px 18px", background: `${theme.surface}F2`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
          {items.map(it => (
            <button key={it.id} onClick={() => { setScreen(it.id); setMobileOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
              padding: "11px 4px", border: "none", background: "none", cursor: "pointer",
              color: isActive(it.id) ? theme.accent : theme.text, fontSize: 15, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", borderBottom: `1px solid ${theme.borderSoft}`
            }}>{it.icon(isActive(it.id) ? theme.accent : theme.textMuted)}{it.label}</button>
          ))}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px 0" }}>
            <span style={{ fontSize: 13, color: theme.textMuted }}>{currentUser.name} · {currentUser.family}</span>
            <button onClick={onLogout} style={{ fontSize: 13, color: theme.accentDeep, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>Sign out</button>
          </div>
        </div>
      )}
    </header>
  );
}

// Sidebar nav — desktop-only persistent rail (used when navStyle === "sidebar")
function SidebarNav({ screen, setScreen, currentUser, theme }) {
  const items = navLinks(currentUser);
  const isActive = (id) => screen === id || (id === "info" && ["rules", "recs"].includes(screen));
  return (
    <aside className="om-desktop-only" style={{
      width: 220, flexShrink: 0, borderRight: `0.5px solid ${theme.border}`,
      background: theme.surfaceTint,
      padding: "20px 12px", flexDirection: "column", gap: 2,
      height: "calc(100vh - 62px)", position: "sticky", top: 62, overflowY: "auto"
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setScreen(it.id)} style={{
          display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
          padding: "10px 12px", borderRadius: 8, border: "none", cursor: "pointer",
          background: isActive(it.id) ? theme.surfaceAlt : "transparent",
          color: isActive(it.id) ? theme.text : theme.textMuted,
          fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
        }}>
          {it.icon(isActive(it.id) ? theme.accent : theme.textSubtle)}
          {it.label}
        </button>
      ))}
    </aside>
  );
}

// Top Bar — large title style (Apple)
function TopBar({ title, subtitle, right, left, theme }) {
  return (
    <div style={{
      background: `${theme.bg}CC`, backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      padding: "14px 20px 12px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: 12, flexShrink: 0, position: "sticky", top: 62, zIndex: 50,
      borderBottom: `0.5px solid ${theme.borderSoft}`
    }}>
      <div style={{ width: 36 }}>{left}</div>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, letterSpacing: "-0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

function Screen({ children, style = {} }) {
  return <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60, ...style }}>{children}</div>;
}

function SectionLabel({ children, theme, action, onAction, style = {} }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, padding: "0 4px", ...style }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>{children}</span>
      {action && <button onClick={onAction} style={{ fontSize: 13, color: theme.accent, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{action}</button>}
    </div>
  );
}

function Divider({ theme, style = {} }) {
  return <div style={{ height: 0.5, background: theme.border, ...style }}></div>;
}

// Icon button (small, circular)
function IconBtn({ children, onClick, theme, style = {} }) {
  const [press, setPress] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseDown={() => setPress(true)} onMouseUp={() => setPress(false)} onMouseLeave={() => setPress(false)}
      style={{
        width: 36, height: 36, borderRadius: "50%",
        background: theme.surfaceAlt, border: "none", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: press ? "scale(0.92)" : "scale(1)",
        transition: "transform 0.1s, background 0.15s",
        color: theme.text, ...style
      }}>{children}</button>
  );
}

Object.assign(window, { THEMES, Icons, FAMILY_COLORS, Avatar, Badge, Card, Btn, Input, Textarea, SiteHeader, SidebarNav, navLinks, TopBar, Screen, SectionLabel, Divider, IconBtn });
