// All app screens — Apple-quality redesign

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmtDate = (d, opts = { month: "short", day: "numeric" }) =>
  new Date(d + "T12:00:00").toLocaleDateString("en-US", opts);

const fmtRange = (a, b) => {
  const da = new Date(a + "T12:00:00"), db = new Date(b + "T12:00:00");
  if (da.getMonth() === db.getMonth()) {
    return `${MONTHS_SHORT[da.getMonth()]} ${da.getDate()} – ${db.getDate()}`;
  }
  return `${MONTHS_SHORT[da.getMonth()]} ${da.getDate()} – ${MONTHS_SHORT[db.getMonth()]} ${db.getDate()}`;
};

const nightsBetween = (a, b) => Math.max(0, Math.ceil((new Date(b) - new Date(a)) / 86400000));

const getFamilyForMonth = (m) => APP_DATA.familyRotation.find(s => s.months.includes(m));

const memberById = (id) => APP_DATA.familyMembers.find(u => u.id === id);

// ──────────────────────────────────────────────────────────────
// LOGIN
// ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, theme }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const submit = () => {
    setError(""); setLoading(true);
    setTimeout(() => {
      const u = APP_DATA.familyMembers.find(x => x.email === email && x.password === password);
      if (u) onLogin(u);
      else { setError("Email or password didn't match."); setLoading(false); }
    }, 500);
  };

  return (
    <div style={{
      minHeight: "100vh", position: "relative",
      backgroundImage: "url('photos/IMG_3259.jpg')",
      backgroundSize: "cover", backgroundPosition: "center",
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,27,22,0.3) 0%, rgba(31,27,22,0.6) 60%, rgba(31,27,22,0.85) 100%)" }}></div>

      <div style={{ position: "relative", zIndex: 1, padding: "0 24px 40px", color: "#fff", maxWidth: 440, margin: "0 auto", width: "100%" }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 500 }}>Shelter Cove</div>
          <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 36, lineHeight: 1.4, letterSpacing: "0" }}>
            The Pierce/Thomas<br />Beach House
          </div>
        </div>

        {/* Glass form */}
        <div style={{
          background: "rgba(255,255,255,0.10)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          border: "0.5px solid rgba(255,255,255,0.18)",
          borderRadius: 24, padding: 22,
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" autoComplete="email"
              style={{
                background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "13px 16px", borderRadius: 12,
                fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none"
              }}
            />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password" autoComplete="current-password"
              onKeyDown={e => e.key === "Enter" && submit()}
              style={{
                background: "rgba(255,255,255,0.12)", border: "0.5px solid rgba(255,255,255,0.2)",
                color: "#fff", padding: "13px 16px", borderRadius: 12,
                fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: "none"
              }}
            />
            {error && <div style={{ fontSize: 12, color: theme.accentDeep }}>{error}</div>}
            <button
              onClick={submit} disabled={loading || !email || !password}
              style={{
                background: "#fff", color: theme.text, border: "none",
                padding: "14px", borderRadius: 12, fontSize: 15, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
                opacity: (loading || !email || !password) ? 0.5 : 1,
                transition: "opacity 0.15s",
              }}
            >{loading ? "Signing in…" : "Sign In"}</button>
          </div>

          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid rgba(255,255,255,0.15)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 8, letterSpacing: "0.04em", textTransform: "uppercase" }}>Demo</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {APP_DATA.familyMembers.slice(0, 3).map(u => (
                <button key={u.id} onClick={() => { setEmail(u.email); setPassword(u.password); }}
                  style={{ background: "rgba(255,255,255,0.10)", color: "#fff", border: "0.5px solid rgba(255,255,255,0.2)", borderRadius: 99, padding: "5px 11px", fontSize: 11, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {u.name.split(" ")[0]} · {u.family}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 18, fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>
          UNIT 7557 · SHELTER COVE · HILTON HEAD ISLAND, SC
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// HOME
// ──────────────────────────────────────────────────────────────
function HomeScreen({ currentUser, setScreen, theme, layout = "single" }) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const [weather, setWeather] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    const iconFor = (t = "") => {
      t = t.toLowerCase();
      if (t.includes("rain") || t.includes("shower") || t.includes("storm") || t.includes("thunder")) return "rain";
      if (t.includes("cloud") || t.includes("overcast") || t.includes("fog")) return "cloud";
      return "sun";
    };
    (async () => {
      try {
        const pt = await fetch("https://api.weather.gov/points/32.2163,-80.7526").then(r => r.json());
        const [forecastRes, stationsRes] = await Promise.all([
          fetch(pt.properties.forecast).then(r => r.json()),
          fetch(pt.properties.observationStations).then(r => r.json())
        ]);
        let current = null;
        const stationId = stationsRes.features?.[0]?.properties?.stationIdentifier;
        if (stationId) {
          const obs = await fetch(`https://api.weather.gov/stations/${stationId}/observations/latest`).then(r => r.json());
          const tempC = obs.properties?.temperature?.value;
          current = {
            tempF: tempC != null ? Math.round(tempC * 9 / 5 + 32) : null,
            text: obs.properties?.textDescription || "",
            icon: iconFor(obs.properties?.textDescription)
          };
        }
        const periods = forecastRes.properties.periods;
        const days = periods.filter(p => p.isDaytime).slice(0, 5).map(p => ({ name: p.name.slice(0, 3), hi: p.temperature, icon: iconFor(p.shortForecast) }));
        const nights = periods.filter(p => !p.isDaytime);
        days.forEach((d, i) => { d.lo = nights[i] ? nights[i].temperature : null; });
        if (alive) setWeather({ current, days });
      } catch (e) {
        if (alive) setWeather({ error: true });
      }
    })();
    return () => { alive = false; };
  }, []);
  const weatherIcon = (icon, size = 18, color) => {
    if (icon === "sun") return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4.5" stroke={color || "#FFD166"} strokeWidth="1.8"/><path d="M12 2.5V5M12 19V21.5M21.5 12H19M5 12H2.5M18.6 5.4L16.9 7.1M7.1 16.9L5.4 18.6M18.6 18.6L16.9 16.9M7.1 7.1L5.4 5.4" stroke={color || "#FFD166"} strokeWidth="1.8" strokeLinecap="round"/></svg>;
    if (icon === "cloud") return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6 17H16C18 17 19.5 15.5 19.5 13.7C19.5 12 18.2 10.7 16.6 10.5C16.2 8 14 6 11.5 6C8.7 6 6.5 8.2 6.3 11C4.4 11.3 3 12.9 3 14.8C3 16 4.3 17 6 17Z" stroke={color || "rgba(255,255,255,0.75)"} strokeWidth="1.6" strokeLinejoin="round"/></svg>;
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M6 14H15C17 14 18.5 12.6 18.5 10.9C18.5 9.3 17.3 8 15.7 7.8C15.3 5.5 13.2 3.7 10.9 3.7C8.3 3.7 6.2 5.7 6 8.3C4.2 8.6 3 10.1 3 11.9C3 13 4.3 14 6 14Z" stroke={color || "rgba(255,255,255,0.75)"} strokeWidth="1.6" strokeLinejoin="round"/><path d="M8 18L7 20M12 18L11 20M16 18L15 20" stroke="#7FC7E8" strokeWidth="1.6" strokeLinecap="round"/></svg>;
  };

  const upcoming = APP_DATA.reservations
    .filter(r => r.checkIn >= today && r.status !== "denied")
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const myNext = upcoming.find(r => r.userId === currentUser.id);
  const nextStay = upcoming[0];

  const daysUntil = (d) => Math.ceil((new Date(d + "T12:00:00") - now) / 86400000);

  // Rotation
  const currentMonth = now.getMonth();
  const currentSlot = getFamilyForMonth(currentMonth);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <Screen>
        {/* Family Schedule — full-width strip under the nav */}
        {currentSlot && (
          <div style={{ padding: "14px 20px 0" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              padding: "10px 18px", borderRadius: 4,
              background: FAMILY_COLORS[currentSlot.family].soft, border: `0.5px solid ${FAMILY_COLORS[currentSlot.family].primary}33`
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                  background: FAMILY_COLORS[currentSlot.family].primary, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, fontSize: 15
                }}>{currentSlot.family[0]}</div>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: FAMILY_COLORS[currentSlot.family].deep }}>Priority To</div>
                <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 15, color: FAMILY_COLORS[currentSlot.family].deep }}>
                  {currentSlot.family}
                </div>
                <div style={{ fontSize: 12, color: FAMILY_COLORS[currentSlot.family].deep, opacity: 0.7 }}>
                  {MONTHS[currentSlot.months[0]]} – {MONTHS[currentSlot.months[1]]}
                </div>
              </div>
              <button onClick={() => setScreen("calendar")} style={{ fontSize: 13, color: FAMILY_COLORS[currentSlot.family].deep, background: "none", border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}>See all →</button>
            </div>
          </div>
        )}

        {/* Supplies status banner — full-width, only when something is critically out */}
        {(() => {
          const outCount = APP_DATA.supplies.filter(s => s.status === "out").length;
          if (outCount === 0) return null;
          return (
            <div style={{ padding: "14px 20px 0" }}>
              <Card theme={theme} onClick={() => setScreen("supplies")} style={{
                background: theme.accentSoft, border: `0.5px solid ${theme.accent}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: theme.accentSoft, color: theme.accentDeep,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>{Icons.alert(theme.accentDeep)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.accentDeep, letterSpacing: "-0.005em" }}>
                      {outCount} out
                    </div>
                    <div style={{ fontSize: 12, color: theme.accentDeep, opacity: 0.8, marginTop: 2 }}>
                      Pick up before arrival — last family left a heads-up
                    </div>
                  </div>
                  {Icons.chevron(theme.accentDeep)}
                </div>
              </Card>
            </div>
          );
        })()}

        <div className={layout === "dashboard" ? "home-dashboard grid" : "home-dashboard"}>
        <div className="home-col">
        {/* Greeting */}
        <div style={{ padding: "20px 20px 12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2, fontWeight: 500 }}>
                {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 32, color: theme.text, letterSpacing: "-0.015em", lineHeight: 1.1 }}>
                Hi, {currentUser.name.split(" ")[0]}
              </div>
            </div>
            <Avatar initials={currentUser.avatar} size={44} family={currentUser.family} />
          </div>
        </div>

        {/* Plan-a-stay prompt — only when no upcoming trip (next stay now shown in nav) */}
        {!myNext && (
          <div style={{ padding: "20px 20px 0" }}>
            <Card theme={theme} onClick={() => setScreen("book")} style={{ background: theme.accent, color: "#fff", border: "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, letterSpacing: "-0.01em", lineHeight: 1.1 }}>Plan a stay</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>Pick your dates and we'll let the family know.</div>
                </div>
                {Icons.chevron("#fff")}
              </div>
            </Card>
          </div>
        )}

        {/* Weather — live NWS data for Hilton Head Island, SC */}
        <div style={{ padding: "0 20px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: theme.text, borderRadius: 4, padding: "14px 18px", minHeight: 58 }}>
            {!weather ? (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Loading weather…</div>
            ) : weather.error ? (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>Weather unavailable right now.</div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {weatherIcon(weather.current?.icon || "sun", 30)}
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: 26, color: "#fff", lineHeight: 1 }}>
                      {weather.current?.tempF != null ? `${weather.current.tempF}°` : "—"}<span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}> F</span>
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: 2 }}>{weather.current?.text || "—"} · Hilton Head</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 18 }}>
                  {weather.days.map((w, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{w.name}</div>
                      {weatherIcon(w.icon)}
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#fff" }}>{w.hi}°<span style={{ color: "rgba(255,255,255,0.45)" }}>{w.lo != null ? `/${w.lo}°` : ""}</span></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Hero house card */}
        <div style={{ padding: "20px 20px 4px" }}>
          <div onClick={() => setScreen("info")} style={{
            position: "relative", borderRadius: 22, overflow: "hidden",
      backgroundImage: "url('photos/IMG_3260.jpg')",
            backgroundSize: "cover", backgroundPosition: "center",
            aspectRatio: "16/10", cursor: "pointer",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(31,27,22,0) 40%, rgba(31,27,22,0.85) 100%)" }}></div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 18px", color: "#fff" }}>
              <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", marginBottom: 4, fontWeight: 500 }}>The Beach House</div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 24, lineHeight: 1.1, marginBottom: 4 }}>Shelter Cove</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 4 }}>
                {Icons.pin("rgba(255,255,255,0.85)")}
                Unit 7557 · Shelter Cove, Hilton Head
              </div>
            </div>
          </div>
        </div>

        </div>
        <div className="home-col">
        {/* A look inside — photo strip */}
        <div style={{ padding: "22px 0 0" }}>
          <div style={{ padding: "0 20px" }}>
            <SectionLabel theme={theme} action="View all" onAction={() => setScreen("gallery")}>A Look Inside</SectionLabel>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 20px 4px", scrollbarWidth: "none" }}>
            {APP_DATA.gallery.slice(0, 7).map((p, idx) => (
              <button key={p.file} onClick={() => setScreen("gallery")} style={{
                flexShrink: 0, border: "none", padding: 0, cursor: "pointer",
                width: idx === 0 ? 220 : 150, height: 130, borderRadius: 16, overflow: "hidden",
                position: "relative", background: theme.surfaceAlt,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}>
                <img src={p.file} alt={p.caption} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 10px 8px",
                  background: "linear-gradient(180deg, rgba(31,27,22,0) 0%, rgba(31,27,22,0.72) 100%)",
                  color: "#fff", fontSize: 11, fontWeight: 500, textAlign: "left", lineHeight: 1.25,
                  fontFamily: "'DM Sans', sans-serif" }}>{p.caption}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming stays from family */}
        {upcoming.length > 0 && (
          <div style={{ padding: "20px 20px 0" }}>
            <SectionLabel theme={theme} action="View all" onAction={() => setScreen("calendar")}>Upcoming Stays</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {upcoming.slice(0, 3).map(r => {
                const m = memberById(r.userId);
                return (
                  <Card key={r.id} theme={theme} style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initials={m?.avatar || "?"} size={38} family={m?.family} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{r.userName}</span>
                          {r.status === "pending" && <Badge status="pending" theme={theme} />}
                        </div>
                        <div style={{ fontSize: 13, color: theme.textMuted }}>
                          {fmtRange(r.checkIn, r.checkOut)} · {r.guestCount} guests
                        </div>
                      </div>
                      {Icons.chevron(theme.textSubtle)}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ padding: "24px 20px 0" }}>
          <SectionLabel theme={theme}>Quick Access</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: Icons.supplies, label: "House Supplies", screen: "supplies", accent: true },
              { icon: Icons.rules, label: "House Rules", screen: "rules" },
              { icon: Icons.photos, label: "Photo Gallery", screen: "gallery" },
              { icon: Icons.key, label: "Access & WiFi", screen: "info" },
              { icon: Icons.bike, label: "Bike Trails", screen: "recs" },
              { icon: Icons.wave, label: "Beaches", screen: "recs" },
              { icon: Icons.fork, label: "Dining", screen: "recs" },
            ].map(item => (
              <Card key={item.label} theme={theme} onClick={() => setScreen(item.screen)} className="quick-tile" style={{ padding: "16px", "--tile-accent": theme.accent }}>
                <div className="quick-tile-icon" style={{ marginBottom: 8, color: theme.accent }}>{item.icon(theme.accent)}</div>
                <div className="quick-tile-label" style={{ fontSize: 14, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>{item.label}</div>
              </Card>))}
          </div>
        </div>
        </div>
        </div>
      </Screen>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// CALENDAR
// ──────────────────────────────────────────────────────────────
function CalendarScreen({ setScreen, setBookingDates, theme }) {
  const now = new Date();
  const [viewYear, setViewYear] = React.useState(now.getFullYear());
  const [viewMonth, setViewMonth] = React.useState(now.getMonth());
  const [selected, setSelected] = React.useState({ start: null, end: null });

  const today = now.toISOString().split("T")[0];
  const fmtKey = (d) => d.toISOString().split("T")[0];

  const goPrev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const goNext = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };
  const goToday = () => { setViewMonth(now.getMonth()); setViewYear(now.getFullYear()); };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const gridStart = new Date(viewYear, viewMonth, 1 - firstDay);
  const weeks = React.useMemo(() => {
    const w = [];
    for (let r = 0; r < 6; r++) {
      const row = [];
      for (let c = 0; c < 7; c++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + r * 7 + c);
        row.push(d);
      }
      w.push(row);
    }
    return w;
  }, [viewYear, viewMonth]);

  const reservations = APP_DATA.reservations.filter(r => r.status !== "denied");

  const makeKey = (d) => `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const handleDayClick = (key, isCurrentMonth) => {
    if (!isCurrentMonth) return;
    if (key < today) return;
    if (!selected.start || (selected.start && selected.end)) {
      setSelected({ start: key, end: null });
    } else {
      if (key < selected.start) setSelected({ start: key, end: selected.start });
      else if (key === selected.start) setSelected({ start: null, end: null });
      else setSelected({ start: selected.start, end: key });
    }
  };
  const inRange = (key) => selected.start && selected.end && key > selected.start && key < selected.end;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <Screen>
        <div style={{ padding: "20px 0 0" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
            <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 34, color: theme.text, letterSpacing: "-0.015em" }}>
              {MONTHS[viewMonth]} <span style={{ color: theme.textMuted }}>{viewYear}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={goToday} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surface, color: theme.text, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Today</button>
              <button onClick={goPrev} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: theme.text }}>{Icons.back(theme.text)}</button>
              <button onClick={goNext} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.surface, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transform: "rotate(180deg)", color: theme.text }}>{Icons.back(theme.text)}</button>
            </div>
          </div>

          {/* Year strip — family rotation at a glance */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel theme={theme}>{viewYear} at a glance</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 5 }}>
              {Array.from({ length: 12 }).map((_, m) => {
                const f = getFamilyForMonth(m);
                const fc = f ? FAMILY_COLORS[f.family] : null;
                const active = m === viewMonth;
                return (
                  <button key={m} onClick={() => setViewMonth(m)} style={{
                    padding: "10px 2px", borderRadius: 10, cursor: "pointer",
                    background: active ? (fc?.primary || theme.accent) : (fc?.soft || theme.surfaceAlt),
                    border: "none", fontFamily: "'DM Sans', sans-serif",
                    color: active ? "#fff" : (fc?.deep || theme.text),
                    transition: "all 0.15s", textAlign: "center"
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>{MONTHS_SHORT[m]}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1, fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase" }}>{f ? f.family[0] : "—"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month grid */}
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", background: theme.surface }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${theme.border}` }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: theme.textMuted, padding: "8px 0", letterSpacing: "0.04em", textTransform: "uppercase" }}>{d}</div>
              ))}
            </div>
            {weeks.map((week, wi) => {
              // compute event bar segments for this week, avoiding overlap via slot assignment
              const segs = [];
              reservations.forEach(r => {
                const start = new Date(r.checkIn + "T12:00:00");
                const end = new Date(r.checkOut + "T12:00:00");
                if (end < week[0] || start > week[6]) return;
                const segStart = start < week[0] ? week[0] : start;
                const segEnd = end > week[6] ? week[6] : end;
                const startCol = Math.round((segStart - week[0]) / 86400000) + 1;
                const endCol = Math.round((segEnd - week[0]) / 86400000) + 1;
                segs.push({ r, startCol, endCol, isStart: fmtKey(start) === fmtKey(segStart), isEnd: fmtKey(end) === fmtKey(segEnd) });
              });
              segs.sort((a, b) => a.startCol - b.startCol);
              const slots = [];
              segs.forEach(s => {
                let slot = slots.findIndex(occupiedTo => occupiedTo < s.startCol);
                if (slot === -1) { slot = slots.length; slots.push(s.endCol); } else { slots[slot] = s.endCol; }
                s.slot = slot;
              });
              const maxSlots = Math.max(0, ...segs.map(s => s.slot + 1));
              const rowMinHeight = 40 + maxSlots * 24;

              return (
                <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: 22, position: "relative", minHeight: rowMinHeight, borderBottom: wi < weeks.length - 1 ? `1px solid ${theme.borderSoft}` : "none" }}>
                  {week.map((d, ci) => {
                    const isCurrentMonth = d.getMonth() === viewMonth;
                    const key = fmtKey(d);
                    const isToday = key === today;
                    const isStart = key === selected.start, isEnd = key === selected.end, isBetween = inRange(key);
                    return (
                      <div key={ci} onClick={() => handleDayClick(key, isCurrentMonth)} style={{
                        gridColumn: ci + 1, gridRow: "1 / -1",
                        borderRight: ci < 6 ? `1px solid ${theme.borderSoft}` : "none",
                        background: isBetween ? theme.accentSoft : "transparent",
                        cursor: isCurrentMonth && key >= today ? "pointer" : "default",
                        opacity: isCurrentMonth ? 1 : 0.35
                      }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", padding: "5px 6px 0" }}>
                          <span style={{
                            width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: isToday ? 700 : 500,
                            background: isStart || isEnd ? theme.accent : (isToday ? theme.text : "transparent"),
                            color: isStart || isEnd || isToday ? "#fff" : theme.text
                          }}>{d.getDate()}</span>
                        </div>
                      </div>
                    );
                  })}
                  {segs.map((s, si) => {
                    const m = memberById(s.r.userId);
                    const fc = m?.family ? FAMILY_COLORS[m.family] : null;
                    const pending = s.r.status === "pending";
                    const bg = pending ? theme.accentSoft : (fc?.soft || theme.surfaceAlt);
                    const color = pending ? theme.accentDeep : (fc?.deep || theme.text);
                    return (
                      <div key={si} onClick={() => setScreen("mytrips")} title={`${s.r.userName} · ${fmtRange(s.r.checkIn, s.r.checkOut)}`} style={{
                        gridColumn: `${s.startCol} / ${s.endCol + 1}`, gridRow: s.slot + 2,
                        margin: "0 2px", padding: "2px 8px", background: bg, color,
                        borderRadius: s.isStart && s.isEnd ? 6 : s.isStart ? "6px 0 0 6px" : s.isEnd ? "0 6px 6px 0" : 0,
                        fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        cursor: "pointer", zIndex: 1, display: "flex", alignItems: "center"
                      }}>{s.r.userName}</div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 16 }}>
            {[
              { dot: FAMILY_COLORS.Pierce.soft, ring: FAMILY_COLORS.Pierce.primary, label: "Pierce booked" },
              { dot: FAMILY_COLORS.Thomas.soft, ring: FAMILY_COLORS.Thomas.primary, label: "Thomas booked" },
              { dot: theme.accentSoft, ring: theme.accent, label: "Pending" },
              { dot: theme.accent, ring: theme.accent, label: "Selected" },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.dot, border: `1px solid ${l.ring}` }}></div>
                <span style={{ fontSize: 11, color: theme.textMuted }}>{l.label}</span>
              </div>
            ))}
          </div>



          {/* Upcoming list */}
          <div style={{ marginTop: 28, paddingBottom: 40 }}>
            <SectionLabel theme={theme}>All Upcoming Stays</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {APP_DATA.reservations
                .filter(r => r.checkIn >= today)
                .sort((a, b) => a.checkIn.localeCompare(b.checkIn))
                .map(r => {
                  const m = memberById(r.userId);
                  return (
                    <Card key={r.id} theme={theme} style={{ padding: "13px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar initials={m?.avatar || "?"} size={36} family={m?.family} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{r.userName}</div>
                          <div style={{ fontSize: 12, color: theme.textMuted }}>
                            {fmtRange(r.checkIn, r.checkOut)} · {r.guestCount} guests
                          </div>
                        </div>
                        <Badge status={r.status} theme={theme} />
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </Screen>

      {/* Floating CTA */}
      {selected.start && selected.end && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", width: "min(92%, 420px)", zIndex: 150 }}>
          <Btn onClick={() => { setBookingDates(selected); setScreen("book"); }} theme={theme} variant="accent" size="lg" full
            style={{ boxShadow: "0 12px 30px rgba(201,100,66,0.3)" }}>
            Continue with {fmtRange(selected.start, selected.end)}
          </Btn>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// BOOKING
// ──────────────────────────────────────────────────────────────
function BookScreen({ currentUser, bookingDates, setScreen, theme }) {
  const [step, setStep] = React.useState(1);
  const [checkIn, setCheckIn] = React.useState(bookingDates?.start || "");
  const [checkOut, setCheckOut] = React.useState(bookingDates?.end || "");
  const [guests, setGuests] = React.useState([currentUser.name]);
  const [newGuest, setNewGuest] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  const nights = checkIn && checkOut ? nightsBetween(checkIn, checkOut) : 0;

  const addGuest = () => {
    if (newGuest.trim() && guests.length < APP_DATA.houseInfo.maxGuests) {
      setGuests(g => [...g, newGuest.trim()]);
      setNewGuest("");
    }
  };
  const removeGuest = (i) => i > 0 && setGuests(g => g.filter((_, idx) => idx !== i));

  const submit = () => {
    APP_DATA.reservations.push({
      id: Date.now(), userId: currentUser.id, userName: currentUser.name,
      checkIn, checkOut, guests, guestCount: guests.length,
      status: "pending", notes, votes: {}, createdAt: new Date().toISOString().split("T")[0]
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg, alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", background: theme.accentSoft,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24
        }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: theme.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 28, color: theme.text, marginBottom: 10, letterSpacing: "-0.01em" }}>Request sent</div>
        <div style={{ fontSize: 15, color: theme.textMuted, maxWidth: 280, lineHeight: 1.5, marginBottom: 28 }}>
          {fmtRange(checkIn, checkOut)} · {guests.length} guests<br />
          The family will see this and chime in.
        </div>
        <Btn onClick={() => setScreen("mytrips")} theme={theme} variant="primary" size="lg" full style={{ maxWidth: 280 }}>View my trips</Btn>
        <button onClick={() => setScreen("home")} style={{ marginTop: 12, background: "none", border: "none", color: theme.textMuted, fontSize: 14, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>Back to home</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title={step === 1 ? "When?" : "Who?"}
        subtitle={`Step ${step} of 2`}
        theme={theme}
        left={step > 1
          ? <IconBtn theme={theme} onClick={() => setStep(1)}>{Icons.back(theme.text)}</IconBtn>
          : <IconBtn theme={theme} onClick={() => setScreen("home")}>{Icons.close(theme.text)}</IconBtn>}
        right={step === 1
          ? <IconBtn theme={theme} onClick={() => setScreen("home")}>{Icons.close(theme.text)}</IconBtn>
          : null}
      />

      {/* Progress */}
      <div style={{ height: 2, background: theme.border, margin: "0 20px", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${step * 50}%`, background: theme.accent, transition: "width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}></div>
      </div>

      <Screen>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18 }}>
          {step === 1 && (
            <>
              <Input label="Check-in" type="date" value={checkIn} onChange={setCheckIn} theme={theme} />
              <Input label="Check-out" type="date" value={checkOut} onChange={setCheckOut} theme={theme} />

              {nights > 0 && (
                <Card theme={theme} style={{ background: theme.accentSoft, border: "none" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, color: theme.accent, fontWeight: 600, letterSpacing: "0.02em", textTransform: "uppercase", marginBottom: 4 }}>Your stay</div>
                      <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, color: theme.accentDeep, lineHeight: 1.1 }}>{nights} night{nights > 1 ? "s" : ""}</div>
                    </div>
                    <div style={{ fontSize: 13, color: theme.accentDeep, opacity: 0.7, textAlign: "right" }}>
                      {fmtRange(checkIn, checkOut)}
                    </div>
                  </div>
                </Card>
              )}

              <Btn onClick={() => setStep(2)} disabled={!checkIn || !checkOut || nights < 1} theme={theme} variant="primary" size="lg" full>
                Continue
              </Btn>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <SectionLabel theme={theme}>Guests · {guests.length}/{APP_DATA.houseInfo.maxGuests}</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {guests.map((g, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: theme.surface, border: `0.5px solid ${theme.border}`, borderRadius: 12 }}>
                      <Avatar initials={g.split(" ").map(w => w[0]).join("").slice(0, 2)} size={28} family={i === 0 ? currentUser.family : null} />
                      <span style={{ flex: 1, fontSize: 14, color: theme.text }}>{g}{i === 0 ? " (you)" : ""}</span>
                      {i > 0 && <button onClick={() => removeGuest(i)} style={{ background: "none", border: "none", cursor: "pointer", color: theme.textSubtle, padding: 4, display: "flex" }}>{Icons.close(theme.textSubtle)}</button>}
                    </div>
                  ))}
                </div>

                {guests.length < APP_DATA.houseInfo.maxGuests && (
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <input value={newGuest} onChange={e => setNewGuest(e.target.value)} onKeyDown={e => e.key === "Enter" && addGuest()}
                      placeholder="Add guest name"
                      style={{
                        flex: 1, border: `1px solid ${theme.border}`, borderRadius: 12, padding: "10px 14px",
                        fontSize: 14, fontFamily: "'DM Sans', sans-serif", background: theme.surface, color: theme.text, outline: "none"
                      }}
                    />
                    <Btn onClick={addGuest} theme={theme} variant="secondary" disabled={!newGuest.trim()}>Add</Btn>
                  </div>
                )}
              </div>

              <Textarea label="Note for the family (optional)" value={notes} onChange={setNotes} placeholder="Anything to share?" rows={3} theme={theme} />

              {/* Summary */}
              <Card theme={theme} style={{ background: theme.surfaceAlt, border: "none" }}>
                {[
                  ["Dates", fmtRange(checkIn, checkOut)],
                  ["Nights", nights],
                  ["Guests", guests.length],
                  ["Status", "Awaiting family"]
                ].map(([k, v], i, arr) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.border}` : "none" }}>
                    <span style={{ fontSize: 13, color: theme.textMuted }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{v}</span>
                  </div>
                ))}
              </Card>

              <Btn onClick={submit} theme={theme} variant="accent" size="lg" full>Request stay</Btn>
            </>
          )}
        </div>
      </Screen>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// MY TRIPS
// ──────────────────────────────────────────────────────────────
function MyTripsScreen({ currentUser, setScreen, theme }) {
  const [expanded, setExpanded] = React.useState(null);
  const myRes = APP_DATA.reservations
    .filter(r => r.userId === currentUser.id)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));

  const today = new Date().toISOString().split("T")[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar title="My Trips" subtitle={`${myRes.length} reservation${myRes.length !== 1 ? "s" : ""}`} theme={theme} />
      <Screen>
        <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {myRes.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                {Icons.trips(theme.accent)}
              </div>
              <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, color: theme.text, marginBottom: 6, letterSpacing: "-0.01em" }}>No trips yet</div>
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 24 }}>Plan your next stay at the house.</div>
              <Btn onClick={() => setScreen("book")} theme={theme} variant="accent" size="lg">Book a Stay</Btn>
            </div>
          )}

          {myRes.map(r => {
            const isPast = r.checkOut < today;
            return (
              <Card key={r.id} theme={theme} onClick={() => setExpanded(expanded === r.id ? null : r.id)} style={{ opacity: isPast ? 0.65 : 1 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Badge status={r.status} theme={theme} />
                      <span style={{ fontSize: 12, color: theme.textSubtle }}>{nightsBetween(r.checkIn, r.checkOut)} nights</span>
                      {isPast && <span style={{ fontSize: 11, color: theme.textSubtle, fontStyle: "italic" }}>Past</span>}
                    </div>
                    <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, color: theme.text, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                      {fmtRange(r.checkIn, r.checkOut)}
                    </div>
                    <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
                      {r.guestCount} guest{r.guestCount > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div style={{ color: theme.textSubtle, transition: "transform 0.2s", transform: expanded === r.id ? "rotate(90deg)" : "none" }}>
                    {Icons.chevron(theme.textSubtle)}
                  </div>
                </div>

                {expanded === r.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `0.5px solid ${theme.border}` }}>
                    {r.notes && (
                      <div style={{ marginBottom: 14 }}>
                        <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSubtle, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 5 }}>Note</div>
                        <div style={{ fontSize: 14, color: theme.text }}>"{r.notes}"</div>
                      </div>
                    )}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: theme.textSubtle, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Guests</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {r.guests.map((g, i) => (
                          <span key={i} className="pill-badge" style={{ padding: "4px 11px", background: theme.surfaceAlt, borderRadius: 99, fontSize: 12, color: theme.text, "--pc": theme.text }}>{g}</span>
                        ))}
                      </div>
                    </div>
                    {r.status === "pending" && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: theme.surfaceAlt, borderRadius: 10 }}>
                        <span style={{ fontSize: 12, color: theme.textMuted }}>Family chime-ins</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>
                          {Object.values(r.votes).filter(v => v === "approve").length} 👍
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {myRes.length > 0 && (
            <Btn onClick={() => setScreen("book")} theme={theme} variant="light" full style={{ marginTop: 10 }}>+ Plan another stay</Btn>
          )}
        </div>
      </Screen>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// HOUSE INFO (3 tabs)
// ──────────────────────────────────────────────────────────────
function HouseInfoScreen({ setScreen, theme, initialTab }) {
  const [tab, setTab] = React.useState(initialTab || "rules");
  const info = APP_DATA.houseInfo;

  const tabs = [
    { id: "info", label: "House" },
    { id: "rules", label: "Rules" },
    { id: "recs", label: "Around" },
    { id: "lights", label: "Lights" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar title="The House" theme={theme} />

      {/* Segmented control */}
      <div style={{ padding: "0 20px 8px" }}>
        <div style={{ display: "flex", background: theme.surfaceAlt, borderRadius: 12, padding: 3 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 500,
              background: tab === t.id ? theme.surface : "transparent",
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              border: "none", borderRadius: 9, cursor: "pointer",
              color: tab === t.id ? theme.text : theme.textMuted,
              fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <Screen>
        <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "info" && <InfoTab info={info} theme={theme} setScreen={setScreen} />}
          {tab === "rules" && <RulesTab theme={theme} />}
          {tab === "recs" && <RecsTab theme={theme} />}
          {tab === "lights" && <LightsTab theme={theme} />}
        </div>
      </Screen>
    </div>
  );
}

function LightsTab({ theme }) {
  return (
    <Card theme={theme} hoverable={false} style={{ textAlign: "center", padding: "48px 20px" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        {Icons.settings(theme.accent)}
      </div>
      <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 18, color: theme.text, marginBottom: 6 }}>Lights — coming soon</div>
      <div style={{ fontSize: 13, color: theme.textMuted }}>Smart lighting controls for the house will live here.</div>
    </Card>
  );
}

function InfoTab({ info, theme, setScreen }) {
  const [copied, setCopied] = React.useState(null);
  const copy = (key, val) => {
    try { navigator.clipboard.writeText(String(val)); } catch (e) {}
    setCopied(key); setTimeout(() => setCopied(null), 1400);
  };
  const access = [
    { key: "gate", icon: Icons.key, label: "Community gate code", value: info.gateCode, mono: true, copyable: true, highlight: true },
    { key: "unit", icon: Icons.pin, label: "Unit", value: info.unit, mono: true },
    { key: "ssid", icon: Icons.wifi, label: "WiFi network", value: info.wifiName, mono: true, copyable: true },
    { key: "wpw", icon: Icons.key, label: "WiFi password", value: info.wifiPassword, mono: true, copyable: true },
    { key: "park", icon: Icons.car, label: "Parking", value: info.parking },
    { key: "addr", icon: Icons.pin, label: "Address", value: info.address },
  ];
  return (
    <>
      {/* Stat row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { icon: Icons.bed, label: "Bedrooms", value: info.bedrooms },
          { icon: Icons.bath, label: "Bathrooms", value: info.bathrooms },
          { icon: Icons.guests, label: "Sleeps", value: info.maxGuests },
        ].map(s => (
          <div key={s.label} style={{ background: theme.surface, border: `0.5px solid ${theme.border}`, borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, color: theme.accent }}>{s.icon(theme.accent)}</div>
            <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, color: theme.text, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Access */}
      <div>
        <SectionLabel theme={theme}>Access</SectionLabel>
        <Card theme={theme} style={{ padding: 0 }}>
          {access.map((row, i, arr) => (
            <div key={row.key} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "13px 18px",
              background: row.highlight ? theme.accentSoft : "transparent",
              borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none"
            }}>
              <div style={{ color: row.highlight ? theme.accentDeep : theme.textMuted, marginTop: 1 }}>{row.icon(row.highlight ? theme.accentDeep : theme.textMuted)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: row.highlight ? theme.accentDeep : theme.textMuted, fontWeight: 500, letterSpacing: "0.02em", marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontSize: row.highlight ? 18 : 14, color: row.highlight ? theme.accentDeep : theme.text, fontFamily: row.mono ? "'SF Mono', Monaco, monospace" : "'DM Sans', sans-serif", fontWeight: row.highlight ? 700 : 500, letterSpacing: row.mono ? "0.04em" : 0 }}>
                  {row.value}
                </div>
              </div>
              {row.copyable && (
                <button onClick={() => copy(row.key, row.value)} style={{
                  flexShrink: 0, border: `0.5px solid ${row.highlight ? theme.accentDeep + "55" : theme.border}`,
                  background: copied === row.key ? (row.highlight ? theme.accentDeep : theme.text) : "transparent",
                  color: copied === row.key ? "#fff" : (row.highlight ? theme.accentDeep : theme.textMuted),
                  borderRadius: 99, padding: "5px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s"
                }}>{copied === row.key ? "Copied" : "Copy"}</button>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Amenities */}
      <div>
        <SectionLabel theme={theme}>Amenities</SectionLabel>
        <Card theme={theme}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {info.amenities.map(a => (
              <span key={a} style={{ padding: "5px 12px", background: theme.accentSoft, color: theme.accentDeep, borderRadius: 99, fontSize: 12, fontWeight: 500 }}>{a}</span>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function RulesTab({ theme }) {
  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, color: theme.text, letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.1 }}>House Rules</div>
        <div style={{ fontSize: 14, color: theme.textMuted }}>Keep things smooth so both families can enjoy.</div>
      </div>
      <Card theme={theme} style={{ padding: 0 }}>
        {APP_DATA.houseRules.map((rule, i, arr) => (
          <div key={i} style={{
            display: "flex", gap: 14, padding: "14px 18px", alignItems: "flex-start",
            borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none"
          }}>
            <div style={{
              minWidth: 28, height: 28, borderRadius: "50%",
              background: theme.accentSoft, color: theme.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif"
            }}>{i + 1}</div>
            <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.45, paddingTop: 4 }}>{rule}</span>
          </div>
        ))}
      </Card>
    </>
  );
}

function RecsTab({ theme }) {
  const [filter, setFilter] = React.useState("All");
  const cats = [
    { id: "All", icon: null },
    { id: "Dining", icon: Icons.fork },
    { id: "Beach", icon: Icons.wave },
    { id: "Bike & Trails", icon: Icons.bike },
    { id: "Activities", icon: Icons.sun },
    { id: "Groceries", icon: Icons.cart },
  ];

  const recs = filter === "All" ? APP_DATA.localRecs : APP_DATA.localRecs.filter(r => r.category === filter);

  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 22, color: theme.text, letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.1 }}>Around the House</div>
        <div style={{ fontSize: 14, color: theme.textMuted }}>Family favorites within walking or short drive of Shelter Cove.</div>
      </div>

      {/* Category chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", margin: "0 -20px", padding: "0 20px 4px", scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            padding: "7px 13px", borderRadius: 99,
            background: filter === c.id ? theme.text : theme.surface,
            color: filter === c.id ? "#fff" : theme.text,
            border: filter === c.id ? "none" : `0.5px solid ${theme.border}`,
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
            display: "inline-flex", alignItems: "center", gap: 5, flexShrink: 0,
            transition: "all 0.15s"
          }}>
            {c.id}
          </button>
        ))}
      </div>

      {/* Group by category when "All" selected */}
      {filter === "All" ? (
        cats.slice(1).map(c => {
          const items = APP_DATA.localRecs.filter(r => r.category === c.id);
          if (items.length === 0) return null;
          return (
            <div key={c.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 4px 10px" }}>
                <div style={{ color: theme.accent }}>{c.icon(theme.accent)}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{c.id}</span>
                <span style={{ fontSize: 12, color: theme.textSubtle }}>· {items.length}</span>
              </div>
              <RecList items={items} theme={theme} />
              {c.id === "Bike & Trails" && <div style={{ marginTop: 8 }}><BikeMap theme={theme} /></div>}
            </div>
          );
        })
      ) : (
        <>
          {filter === "Bike & Trails" && <BikeMap theme={theme} />}
          <RecList items={recs} theme={theme} />
        </>
      )}
    </>
  );
}

function BikeMap({ theme }) {
  const MAP_URL = "https://hiltonhead.maps.arcgis.com/apps/instant/interactivelegend/index.html?appid=8f2036039c5e471c96cbdd3664af9052";
  const [loaded, setLoaded] = React.useState(false);
  return (
    <Card theme={theme} style={{ padding: 0, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ color: theme.accent }}>{Icons.bike(theme.accent)}</div>
          <span style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 18, color: theme.text, lineHeight: 1.1 }}>Island Trail Map</span>
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.45 }}>
          Hilton Head has 60+ miles of public bike paths. Tap a layer in the legend to see routes, then pinch to zoom around Shelter Cove.
        </div>
      </div>
      <div style={{ position: "relative", height: 300, background: theme.surfaceAlt }}>
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textSubtle, fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
            Loading map…
          </div>
        )}
        <iframe
          src={MAP_URL}
          title="Hilton Head Island Trail Map"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allowFullScreen
          style={{ position: "relative", width: "100%", height: "100%", border: "none", display: "block" }}
        ></iframe>
      </div>
      <a href={MAP_URL} target="_blank" rel="noopener noreferrer" style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "13px 16px", borderTop: `0.5px solid ${theme.borderSoft}`,
        color: theme.accentDeep, fontSize: 13, fontWeight: 600, textDecoration: "none",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        Open full map ↗
      </a>
    </Card>
  );
}

function RecList({ items, theme }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <Card key={i} theme={theme} className="quick-tile" style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>{item.name}</span>
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.45, marginBottom: 8 }}>{item.note}</div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(APP_DATA.houseInfo.address)}&destination=${encodeURIComponent(item.name + ", Hilton Head Island, SC")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: theme.accent, textDecoration: "none" }}
              >
                {Icons.pin(theme.accent)}
                Directions{item.walk ? ` · ${item.walk}` : ""}
              </a>
            </div>
            <span className="rec-tag" style={{ padding: "3px 9px", background: theme.surfaceAlt, color: theme.textMuted, borderRadius: 99, fontSize: 10, fontWeight: 600, flexShrink: 0, letterSpacing: "0.02em", textTransform: "uppercase" }}>{item.tag}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// ADMIN
// ──────────────────────────────────────────────────────────────
function AdminScreen({ currentUser, setScreen, theme }) {
  const [adminTab, setAdminTab] = React.useState("reservations");
  const [reservations, setReservations] = React.useState([...APP_DATA.reservations]);
  const [filter, setFilter] = React.useState("pending");
  const [toast, setToast] = React.useState("");

  const counts = {
    all: reservations.length,
    pending: reservations.filter(r => r.status === "pending").length,
    approved: reservations.filter(r => r.status === "approved").length,
    denied: reservations.filter(r => r.status === "denied").length,
  };

  const filtered = filter === "all" ? reservations : reservations.filter(r => r.status === filter);

  const castVote = (resId, vote) => {
    const updated = reservations.map(r => {
      if (r.id !== resId) return r;
      const newVotes = { ...r.votes, [currentUser.id]: vote };
      const approves = Object.values(newVotes).filter(v => v === "approve").length;
      const denies = Object.values(newVotes).filter(v => v === "deny").length;
      let status = r.status;
      if (approves >= 2) status = "approved";
      if (denies >= 2) status = "denied";
      return { ...r, votes: newVotes, status };
    });
    setReservations(updated);
    APP_DATA.reservations = updated;
    setToast(vote === "approve" ? "Approved 👍" : "Voted to deny");
    setTimeout(() => setToast(""), 1800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title="Admin"
        theme={theme}
        left={<IconBtn theme={theme} onClick={() => setScreen("home")}>{Icons.back(theme.text)}</IconBtn>}
      />

      {/* Section switcher */}
      <div style={{ margin: "8px 20px 0", display: "flex", background: theme.surfaceAlt, borderRadius: 10, padding: 3 }}>
        {[{ id: "reservations", label: "Reservations" }, { id: "around", label: "Around the House" }, { id: "users", label: "Users" }, { id: "priority", label: "Priority" }, { id: "photos", label: "Photos" }].map(t => (
          <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
            flex: 1, padding: "7px 0", borderRadius: 8,
            background: adminTab === t.id ? theme.surface : "transparent",
            color: adminTab === t.id ? theme.text : theme.textMuted,
            boxShadow: adminTab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            border: "none",
            fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s"
          }}>{t.label}</button>
        ))}
      </div>

      {adminTab === "reservations" ? (
      <>
      {/* Filter pills */}
      <div style={{ margin: "8px 20px 4px", display: "flex", background: theme.surfaceAlt, borderRadius: 10, padding: 3 }}>
        {[
          { id: "pending", label: "Pending", n: counts.pending, color: theme.badge.pendingText },
          { id: "approved", label: "Approved", n: counts.approved, color: theme.badge.approvedText },
          { id: "denied", label: "Denied", n: counts.denied, color: theme.badge.deniedText },
          { id: "all", label: "All", n: counts.all, color: theme.text },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            flex: 1, padding: "7px 0", borderRadius: 8,
            background: filter === f.id ? f.color : "transparent",
            color: filter === f.id ? "#fff" : theme.textMuted,
            boxShadow: filter === f.id ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
            border: "none",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 4,
            transition: "all 0.15s"
          }}>
            {f.label}
            <span style={{ opacity: 0.75, fontSize: 11 }}>{f.n}</span>
          </button>
        ))}
      </div>

      {toast && (
        <div style={{
          position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
          background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99,
          fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
        }}>{toast}</div>
      )}

      <Screen>
        <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted, fontSize: 14 }}>
              Nothing here.
            </div>
          )}
          {filtered.map(r => {
            const m = memberById(r.userId);
            const approves = Object.values(r.votes).filter(v => v === "approve").length;
            const denies = Object.values(r.votes).filter(v => v === "deny").length;
            const myVote = r.votes[currentUser.id];

            return (
              <Card key={r.id} theme={theme}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <Avatar initials={m?.avatar || "?"} size={42} family={m?.family} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{r.userName}</span>
                      <Badge status={r.status} theme={theme} />
                    </div>
                    <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 18, color: theme.text, letterSpacing: "-0.005em", lineHeight: 1.1, marginBottom: 4 }}>
                      {fmtRange(r.checkIn, r.checkOut)}
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>
                      {nightsBetween(r.checkIn, r.checkOut)} nights · {r.guestCount} guests
                    </div>
                    {r.notes && <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, padding: "8px 12px", background: theme.surfaceAlt, borderRadius: 8, fontStyle: "italic" }}>"{r.notes}"</div>}
                  </div>
                </div>

                {/* Guests */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {r.guests.map((g, i) => (
                    <span key={i} style={{ padding: "3px 9px", background: theme.surfaceAlt, borderRadius: 99, fontSize: 11, color: theme.textMuted }}>{g}</span>
                  ))}
                </div>

                {/* Vote bar */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `0.5px solid ${theme.border}` }}>
                  <div style={{ fontSize: 12, color: theme.textMuted, display: "flex", gap: 12 }}>
                    <span>👍 {approves}</span>
                    <span>👎 {denies}</span>
                  </div>
                  {r.status === "pending" && r.userId !== currentUser.id && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn onClick={() => castVote(r.id, "approve")} theme={theme}
                        variant={myVote === "approve" ? "accent" : "secondary"} size="sm">
                        {myVote === "approve" ? "✓ Approved" : "Approve"}
                      </Btn>
                      <Btn onClick={() => castVote(r.id, "deny")} theme={theme}
                        variant={myVote === "deny" ? "primary" : "ghost"} size="sm">Deny</Btn>
                    </div>
                  )}
                  {r.userId === currentUser.id && (
                    <span style={{ fontSize: 11, color: theme.textSubtle, fontStyle: "italic" }}>your stay</span>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </Screen>
      </>
      ) : adminTab === "around" ? (
        <AroundAdmin theme={theme} />
      ) : adminTab === "users" ? (
        <UsersAdmin theme={theme} currentUser={currentUser} />
      ) : adminTab === "priority" ? (
        <PriorityAdmin theme={theme} />
      ) : (
        <PhotosAdmin theme={theme} />
      )}
    </div>
  );
}

function AroundAdmin({ theme }) {
  const [items, setItems] = React.useState([...APP_DATA.localRecs]);
  const [showForm, setShowForm] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const cats = ["Dining", "Beach", "Bike & Trails", "Activities", "Groceries"];
  const blank = { category: cats[0], name: "", note: "", tag: "", walk: "" };
  const [draft, setDraft] = React.useState(blank);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1400); };

  const addItem = () => {
    if (!draft.name.trim()) return;
    const updated = [...items, { ...draft }];
    setItems(updated);
    APP_DATA.localRecs = updated;
    setDraft(blank);
    setShowForm(false);
    flash("Added");
  };

  const removeItem = (idx) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    APP_DATA.localRecs = updated;
    flash("Removed");
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{
            position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
            background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99,
            fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
          }}>{toast}</div>
        )}

        <Btn onClick={() => setShowForm(s => !s)} theme={theme} variant={showForm ? "secondary" : "primary"} full>
          {showForm ? "Cancel" : "+ Add a place"}
        </Btn>

        {showForm && (
          <Card theme={theme} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {cats.map(c => (
                <button key={c} onClick={() => setDraft(d => ({ ...d, category: c }))} style={{
                  padding: "6px 12px", borderRadius: 99,
                  background: draft.category === c ? theme.text : theme.surfaceAlt,
                  color: draft.category === c ? "#fff" : theme.text,
                  border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>{c}</button>
              ))}
            </div>
            <Input label="Name" value={draft.name} onChange={v => setDraft(d => ({ ...d, name: v }))} placeholder="e.g. Salty Dog Café" theme={theme} />
            <Textarea label="Note" value={draft.note} onChange={v => setDraft(d => ({ ...d, note: v }))} placeholder="Why the family likes it" rows={2} theme={theme} />
            <div style={{ display: "flex", gap: 10 }}>
              <Input label="Tag" value={draft.tag} onChange={v => setDraft(d => ({ ...d, tag: v }))} placeholder="e.g. Seafood" theme={theme} style={{ flex: 1 }} />
              <Input label="Distance" value={draft.walk} onChange={v => setDraft(d => ({ ...d, walk: v }))} placeholder="e.g. 10 min drive" theme={theme} style={{ flex: 1 }} />
            </div>
            <Btn onClick={addItem} theme={theme} variant="primary" full>Save place</Btn>
          </Card>
        )}

        {cats.map(c => {
          const catItems = items.map((it, i) => ({ ...it, _i: i })).filter(it => it.category === c);
          if (catItems.length === 0) return null;
          return (
            <div key={c}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "8px 4px 6px" }}>{c} <span style={{ color: theme.textSubtle, fontWeight: 400 }}>· {catItems.length}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {catItems.map(item => (
                  <Card key={item._i} theme={theme} hoverable={false} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, marginBottom: 2 }}>{item.name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted, lineHeight: 1.4 }}>{item.note}</div>
                        {item.walk && <div style={{ fontSize: 11, color: theme.textSubtle, marginTop: 4 }}>{item.walk}</div>}
                      </div>
                      <IconBtn theme={theme} onClick={() => removeItem(item._i)}>{Icons.close(theme.textMuted)}</IconBtn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

function UsersAdmin({ theme, currentUser }) {
  const [users, setUsers] = React.useState([...APP_DATA.familyMembers]);
  const [showForm, setShowForm] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const families = [...new Set(users.map(u => u.family))];
  const blank = { name: "", email: "", password: "welcome123", role: "member", family: families[0] || "Pierce", avatar: "" };
  const [draft, setDraft] = React.useState(blank);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1400); };

  const initials = (name) => name.trim().split(/\s+/).map(p => p[0]).join("").slice(0, 2).toUpperCase();

  const addUser = () => {
    if (!draft.name.trim() || !draft.email.trim()) return;
    const nextId = Math.max(0, ...users.map(u => u.id)) + 1;
    const updated = [...users, { ...draft, id: nextId, avatar: initials(draft.name) }];
    setUsers(updated);
    APP_DATA.familyMembers = updated;
    setDraft(blank);
    setShowForm(false);
    flash("User added");
  };

  const toggleRole = (id) => {
    const updated = users.map(u => u.id === id ? { ...u, role: u.role === "admin" ? "member" : "admin" } : u);
    setUsers(updated);
    APP_DATA.familyMembers = updated;
    flash("Role updated");
  };

  const removeUser = (id) => {
    if (id === currentUser.id) { flash("Can't remove yourself"); return; }
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    APP_DATA.familyMembers = updated;
    flash("User removed");
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{
            position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
            background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99,
            fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
          }}>{toast}</div>
        )}

        <Btn onClick={() => setShowForm(s => !s)} theme={theme} variant={showForm ? "secondary" : "primary"} full>
          {showForm ? "Cancel" : "+ Add a user"}
        </Btn>

        {showForm && (
          <Card theme={theme} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <Input label="Name" value={draft.name} onChange={v => setDraft(d => ({ ...d, name: v }))} placeholder="Full name" theme={theme} />
            <Input label="Email" value={draft.email} onChange={v => setDraft(d => ({ ...d, email: v }))} placeholder="name@family.com" theme={theme} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {families.map(f => (
                <button key={f} onClick={() => setDraft(d => ({ ...d, family: f }))} style={{
                  padding: "6px 12px", borderRadius: 99,
                  background: draft.family === f ? theme.text : theme.surfaceAlt,
                  color: draft.family === f ? "#fff" : theme.text,
                  border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>{f}</button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {["member", "admin"].map(r => (
                <button key={r} onClick={() => setDraft(d => ({ ...d, role: r }))} style={{
                  padding: "6px 12px", borderRadius: 99,
                  background: draft.role === r ? theme.accent : theme.surfaceAlt,
                  color: draft.role === r ? "#fff" : theme.text,
                  border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize"
                }}>{r}</button>
              ))}
            </div>
            <Btn onClick={addUser} theme={theme} variant="primary" full>Save user</Btn>
          </Card>
        )}

        {families.map(fam => {
          const famUsers = users.filter(u => u.family === fam);
          return (
            <div key={fam}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "8px 4px 6px" }}>{fam} <span style={{ color: theme.textSubtle, fontWeight: 400 }}>· {famUsers.length}</span></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {famUsers.map(u => (
                  <Card key={u.id} theme={theme} hoverable={false} style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initials={u.avatar} size={36} family={u.family} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{u.name}{u.id === currentUser.id && <span style={{ color: theme.textSubtle, fontWeight: 400 }}> (you)</span>}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>{u.email}</div>
                      </div>
                      <button onClick={() => toggleRole(u.id)} style={{
                        padding: "4px 10px", borderRadius: 99,
                        background: u.role === "admin" ? theme.accentSoft : theme.surfaceAlt,
                        color: u.role === "admin" ? theme.accentDeep : theme.textMuted,
                        border: "none", fontSize: 11, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif", textTransform: "capitalize"
                      }}>{u.role}</button>
                      <IconBtn theme={theme} onClick={() => removeUser(u.id)}>{Icons.close(theme.textMuted)}</IconBtn>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

function PriorityAdmin({ theme }) {
  const [rotation, setRotation] = React.useState([...APP_DATA.familyRotation]);
  const [toast, setToast] = React.useState("");
  const families = [...new Set(APP_DATA.familyMembers.map(u => u.family))];

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1400); };

  const setFamily = (idx, family) => {
    const updated = rotation.map((r, i) => i === idx ? { ...r, family, label: `${family} Family` } : r);
    setRotation(updated);
    APP_DATA.familyRotation = updated;
    flash("Priority updated");
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{
            position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
            background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99,
            fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
          }}>{toast}</div>
        )}
        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 4 }}>
          Set which family has priority for each period of the year.
        </div>
        {rotation.map((r, idx) => {
          return (
            <Card key={idx} theme={theme} hoverable={false} style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
                  {MONTHS[r.months[0]]} – {MONTHS[r.months[1]]}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {families.map(f => (
                    <button key={f} onClick={() => setFamily(idx, f)} style={{
                      padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                      background: r.family === f ? FAMILY_COLORS[f].primary : theme.surfaceAlt,
                      color: r.family === f ? "#fff" : theme.text,
                      fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif"
                    }}>{f}</button>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

function PhotosAdmin({ theme }) {
  const [photos, setPhotos] = React.useState([...APP_DATA.gallery]);
  const [showForm, setShowForm] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const cats = [...new Set(APP_DATA.gallery.map(p => p.cat))];
  const blank = { cat: cats[0], file: "", caption: "" };
  const [draft, setDraft] = React.useState(blank);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(""), 1400); };

  const addPhoto = () => {
    if (!draft.file.trim() || !draft.caption.trim()) return;
    const updated = [...photos, { ...draft }];
    setPhotos(updated);
    APP_DATA.gallery = updated;
    setDraft(blank);
    setShowForm(false);
    flash("Photo added");
  };

  const removePhoto = (idx) => {
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    APP_DATA.gallery = updated;
    flash("Photo removed");
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{
            position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
            background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99,
            fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
          }}>{toast}</div>
        )}

        <Btn onClick={() => setShowForm(s => !s)} theme={theme} variant={showForm ? "secondary" : "primary"} full>
          {showForm ? "Cancel" : "+ Add a photo"}
        </Btn>

        {showForm && (
          <Card theme={theme} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {cats.map(c => (
                <button key={c} onClick={() => setDraft(d => ({ ...d, cat: c }))} style={{
                  padding: "6px 12px", borderRadius: 99,
                  background: draft.cat === c ? theme.text : theme.surfaceAlt,
                  color: draft.cat === c ? "#fff" : theme.text,
                  border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif"
                }}>{c}</button>
              ))}
            </div>
            <Input label="Image path or URL" value={draft.file} onChange={v => setDraft(d => ({ ...d, file: v }))} placeholder="photos/IMG_XXXX.jpg" theme={theme} />
            <Input label="Caption" value={draft.caption} onChange={v => setDraft(d => ({ ...d, caption: v }))} placeholder="What this photo shows" theme={theme} />
            {draft.file && (
              <div style={{ borderRadius: 10, overflow: "hidden", height: 120, background: theme.surfaceAlt }}>
                <img src={draft.file} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} onError={e => e.target.style.display = "none"} />
              </div>
            )}
            <Btn onClick={addPhoto} theme={theme} variant="primary" full>Save photo</Btn>
          </Card>
        )}

        {cats.map(c => {
          const catPhotos = photos.map((p, i) => ({ ...p, _i: i })).filter(p => p.cat === c);
          if (catPhotos.length === 0) return null;
          return (
            <div key={c}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "8px 4px 6px" }}>{c} <span style={{ color: theme.textSubtle, fontWeight: 400 }}>· {catPhotos.length}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                {catPhotos.map(p => (
                  <div key={p._i} style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: theme.surfaceAlt, aspectRatio: "4/3" }}>
                    <img src={p.file} alt={p.caption} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "16px 8px 6px", background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)", color: "#fff", fontSize: 11, fontWeight: 500 }}>{p.caption}</div>
                    <button onClick={() => removePhoto(p._i)} style={{
                      position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%",
                      background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>{Icons.close("#fff")}</button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

// ──────────────────────────────────────────────────────────────
// SUPPLIES — house inventory
// ──────────────────────────────────────────────────────────────
function SuppliesScreen({ currentUser, setScreen, theme }) {
  const [supplies, setSupplies] = React.useState([...APP_DATA.supplies]);
  const [filter, setFilter] = React.useState("all");
  const [toast, setToast] = React.useState("");

  const today = new Date().toISOString().split("T")[0];

  // Is the current user currently/recently here? (within 2 days of checkout)
  const myRecentStay = APP_DATA.reservations.find(r => {
    if (r.userId !== currentUser.id || r.status !== "approved") return false;
    const co = new Date(r.checkOut + "T12:00:00");
    const now = new Date();
    const diffDays = (co - now) / 86400000;
    // diffDays < 0 = past checkout, > 0 = future
    // Show prompt for: checking out tomorrow → 7 days post-checkout
    return diffDays >= -7 && diffDays <= 1;
  });

  const counts = {
    good: supplies.filter(s => s.status === "good").length,
    low: supplies.filter(s => s.status === "low").length,
    out: supplies.filter(s => s.status === "out").length,
  };

  const filtered = filter === "all" ? supplies :
                   filter === "needs" ? supplies.filter(s => s.status !== "good") :
                   supplies.filter(s => s.status === filter);

  const setStatus = (id, status) => {
    const updated = supplies.map(s => s.id === id ? {
      ...s, status,
      updatedBy: currentUser.name,
      updatedAt: today,
      count: status === "out" ? "0" : status === "low" ? "Running low" : "Restocked"
    } : s);
    setSupplies(updated);
    APP_DATA.supplies = updated;
    setToast("Updated");
    setTimeout(() => setToast(""), 1400);
  };

  const statusMeta = {
    good: { color: theme.badge.approvedText, bg: theme.badge.approved, dot: "#6B9E4F", label: "Stocked" },
    low:  { color: theme.badge.pendingText, bg: theme.badge.pending, dot: "#D49432", label: "Low" },
    out:  { color: theme.badge.deniedText, bg: theme.badge.denied, dot: "#C73E3E", label: "Out" },
  };

  // Group by category
  const categories = [...new Set(filtered.map(s => s.category))];

  const fmtAgo = (d) => {
    const diff = Math.floor((new Date(today) - new Date(d)) / 86400000);
    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    if (diff < 7) return `${diff} days ago`;
    return `${Math.floor(diff / 7)}w ago`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title="Supplies"
        subtitle={`${counts.out + counts.low} need attention`}
        theme={theme}
        left={<IconBtn theme={theme} onClick={() => setScreen("home")}>{Icons.back(theme.text)}</IconBtn>}
      />

      {toast && (
        <div style={{
          position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)",
          background: theme.text, color: "#fff", padding: "8px 16px", borderRadius: 99,
          fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
        }}>{toast}</div>
      )}

      <Screen>
        <div style={{ padding: "8px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Pre-departure prompt */}
          {myRecentStay && (
            <Card theme={theme} onClick={() => setScreen("checkout")} style={{ background: theme.accent, color: "#fff", border: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {Icons.checklist("#fff")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", letterSpacing: "0.04em", textTransform: "uppercase", fontWeight: 500, marginBottom: 2 }}>Before you go</div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Run the checkout checklist</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>Help the next family land smoothly</div>
                </div>
                {Icons.chevron("#fff")}
              </div>
            </Card>
          )}

          {/* Status summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {[
              { key: "good", label: "Stocked", n: counts.good },
              { key: "low", label: "Low", n: counts.low },
              { key: "out", label: "Out", n: counts.out },
            ].map(s => (
              <button key={s.key} onClick={() => setFilter(s.key === "good" ? "all" : "needs")} style={{
                background: statusMeta[s.key].bg, border: "none", borderRadius: 14, padding: "14px 8px",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "center"
              }}>
                <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 26, color: statusMeta[s.key].color, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: statusMeta[s.key].color, marginTop: 4, fontWeight: 600, letterSpacing: "0.02em" }}>{s.label}</div>
              </button>
            ))}
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", margin: "0 -20px", padding: "0 20px", scrollbarWidth: "none" }}>
            {[
              { id: "all", label: "All" },
              { id: "needs", label: "Needs attention" },
              { id: "out", label: "Out" },
              { id: "low", label: "Low" },
              { id: "good", label: "Stocked" },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} style={{
                padding: "6px 13px", borderRadius: 99,
                background: filter === f.id ? theme.text : theme.surface,
                color: filter === f.id ? "#fff" : theme.text,
                border: filter === f.id ? "none" : `0.5px solid ${theme.border}`,
                fontSize: 12, fontWeight: 500, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0
              }}>{f.label}</button>
            ))}
          </div>

          {/* Items grouped by category */}
          {categories.map(cat => (
            <div key={cat}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.textSubtle, margin: "4px 4px 8px" }}>{cat}</div>
              <Card theme={theme} style={{ padding: 0 }}>
                {filtered.filter(s => s.category === cat).map((item, i, arr) => {
                  const meta = statusMeta[item.status];
                  return (
                    <div key={item.id} style={{
                      padding: "13px 16px",
                      borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none",
                      display: "flex", alignItems: "center", gap: 12
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.dot, flexShrink: 0 }}></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>{item.name}</span>
                          {item.essential && <span style={{ fontSize: 9, padding: "1px 6px", background: theme.accentSoft, color: theme.accent, borderRadius: 99, fontWeight: 600, letterSpacing: "0.04em" }}>ESSENTIAL</span>}
                        </div>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>
                          {item.count} · updated {fmtAgo(item.updatedAt)} by {item.updatedBy.split(" ")[0]}
                        </div>
                      </div>
                      {/* Quick status setter */}
                      <div style={{ display: "flex", gap: 3 }}>
                        {["good", "low", "out"].map(s => (
                          <button key={s} onClick={() => setStatus(item.id, s)} style={{
                            width: 26, height: 26, borderRadius: "50%",
                            background: item.status === s ? statusMeta[s].dot : "transparent",
                            border: `1.5px solid ${item.status === s ? statusMeta[s].dot : theme.border}`,
                            cursor: "pointer", padding: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.12s"
                          }}>
                            {item.status === s && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
          ))}

          <div style={{ fontSize: 11, color: theme.textSubtle, textAlign: "center", padding: "12px 0 4px" }}>
            Tap a circle to update: <span style={{ color: statusMeta.good.color, fontWeight: 600 }}>● stocked</span> · <span style={{ color: statusMeta.low.color, fontWeight: 600 }}>● low</span> · <span style={{ color: statusMeta.out.color, fontWeight: 600 }}>● out</span>
          </div>
        </div>
      </Screen>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// CHECKOUT — pre-departure checklist
// ──────────────────────────────────────────────────────────────
function CheckoutScreen({ currentUser, setScreen, theme }) {
  const [checks, setChecks] = React.useState({});
  const [done, setDone] = React.useState(false);

  const items = APP_DATA.checkoutChecklist;
  const completedCount = Object.values(checks).filter(Boolean).length;
  const progress = (completedCount / items.length) * 100;

  // Items low/out that next person needs to know about
  const lowItems = APP_DATA.supplies.filter(s => s.status !== "good");

  const toggle = (i) => setChecks(c => ({ ...c, [i]: !c[i] }));

  const submit = () => {
    setDone(true);
  };

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg, alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{
          width: 96, height: 96, borderRadius: "50%", background: theme.accentSoft,
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24
        }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: theme.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
        <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 28, color: theme.text, marginBottom: 10, letterSpacing: "-0.01em" }}>All set!</div>
        <div style={{ fontSize: 15, color: theme.textMuted, maxWidth: 280, lineHeight: 1.5, marginBottom: 28 }}>
          The next family will get a notification with the supply status and your handoff notes.
        </div>
        <Btn onClick={() => setScreen("home")} theme={theme} variant="primary" size="lg" full style={{ maxWidth: 280 }}>Back to home</Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title="Checkout"
        subtitle={`${completedCount}/${items.length} done`}
        theme={theme}
        left={<IconBtn theme={theme} onClick={() => setScreen("supplies")}>{Icons.back(theme.text)}</IconBtn>}
      />

      <div style={{ height: 3, background: theme.border, margin: "0 20px", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: theme.accent, transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", borderRadius: 99 }}></div>
      </div>

      <Screen>
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>

          <div>
            <div style={{ fontFamily: "'Titillium Web', sans-serif", fontWeight: 700, textTransform: "uppercase", fontSize: 24, color: theme.text, letterSpacing: "-0.01em", lineHeight: 1.1, marginBottom: 6 }}>
              Leave it better than you found it.
            </div>
            <div style={{ fontSize: 14, color: theme.textMuted }}>
              Quick check before you head out — takes 5 min.
            </div>
          </div>

          {/* Checklist */}
          <Card theme={theme} style={{ padding: 0 }}>
            {items.map((item, i) => {
              const checked = !!checks[i];
              return (
                <button key={i} onClick={() => toggle(i)} style={{
                  width: "100%", padding: "14px 16px",
                  background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  display: "flex", alignItems: "center", gap: 14,
                  borderBottom: i < items.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none",
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: checked ? theme.accent : "transparent",
                    border: `1.5px solid ${checked ? theme.accent : theme.border}`,
                    flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s"
                  }}>
                    {checked && Icons.check("#fff")}
                  </div>
                  <span style={{
                    fontSize: 14, color: checked ? theme.textMuted : theme.text,
                    textDecoration: checked ? "line-through" : "none",
                    transition: "all 0.15s", flex: 1
                  }}>{item}</span>
                </button>
              );
            })}
          </Card>

          {/* Low/out items reminder */}
          {lowItems.length > 0 && (
            <div>
              <SectionLabel theme={theme}>Heads-up for the next family</SectionLabel>
              <Card theme={theme} style={{ background: theme.accentSoft, border: `0.5px solid ${theme.accent}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ color: theme.accentDeep }}>{Icons.alert(theme.accentDeep)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.accentDeep, marginBottom: 2 }}>{lowItems.length} supplies need restocking</div>
                    <div style={{ fontSize: 12, color: theme.accentDeep, opacity: 0.8 }}>They'll see this when they arrive.</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {lowItems.map(s => (
                    <span key={s.id} style={{
                      padding: "3px 9px",
                      background: s.status === "out" ? theme.badge.denied : theme.badge.pending,
                      color: s.status === "out" ? theme.badge.deniedText : theme.badge.pendingText,
                      borderRadius: 99, fontSize: 11, fontWeight: 500
                    }}>
                      {s.status === "out" ? "● " : "○ "}{s.name}
                    </span>
                  ))}
                </div>
                <button onClick={() => setScreen("supplies")} style={{
                  marginTop: 10, background: "none", border: "none", cursor: "pointer",
                  color: theme.accentDeep, fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", padding: 0
                }}>Update supplies →</button>
              </Card>
            </div>
          )}

          <Btn onClick={submit} disabled={completedCount < items.length} theme={theme} variant="accent" size="lg" full
            style={{ marginTop: 4 }}>
            {completedCount < items.length ? `${items.length - completedCount} item${items.length - completedCount > 1 ? "s" : ""} to go` : "Finish checkout"}
          </Btn>
        </div>
      </Screen>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// GALLERY — photos of the unit
// ──────────────────────────────────────────────────────────────
function GalleryScreen({ setScreen, theme }) {
  const photos = APP_DATA.gallery;
  const cats = ["All", ...Array.from(new Set(photos.map(p => p.cat)))];
  const [filter, setFilter] = React.useState("All");
  const [lightbox, setLightbox] = React.useState(null); // index into `shown`

  const shown = filter === "All" ? photos : photos.filter(p => p.cat === filter);

  const move = (dir) => setLightbox(i => {
    const n = (i + dir + shown.length) % shown.length;
    return n;
  });

  React.useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, shown.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title="Gallery"
        subtitle={`${shown.length} photo${shown.length !== 1 ? "s" : ""}`}
        theme={theme}
        left={<IconBtn theme={theme} onClick={() => setScreen("info")}>{Icons.back(theme.text)}</IconBtn>}
      />

      {/* Category chips */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 20px 10px", scrollbarWidth: "none" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "7px 14px", borderRadius: 99,
            background: filter === c ? theme.text : theme.surface,
            color: filter === c ? "#fff" : theme.text,
            border: filter === c ? "none" : `0.5px solid ${theme.border}`,
            fontSize: 13, fontWeight: 500, cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", flexShrink: 0,
            transition: "all 0.15s"
          }}>{c}</button>
        ))}
      </div>

      <Screen>
        <div style={{ padding: "4px 16px 0", columnCount: 2, columnGap: 10 }}>
          {shown.map((p, i) => (
            <button key={p.file} onClick={() => setLightbox(i)} style={{
              border: "none", padding: 0, background: theme.surfaceAlt, cursor: "pointer",
              width: "100%", marginBottom: 10, borderRadius: 14, overflow: "hidden",
              display: "inline-block", position: "relative", breakInside: "avoid",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
            }}>
              <img src={p.file} alt={p.caption} loading="lazy" style={{ width: "100%", display: "block" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "20px 10px 8px",
                background: "linear-gradient(180deg, rgba(31,27,22,0) 0%, rgba(31,27,22,0.7) 100%)",
                color: "#fff", fontSize: 11, fontWeight: 500, textAlign: "left", lineHeight: 1.3,
                fontFamily: "'DM Sans', sans-serif" }}>{p.caption}</div>
            </button>
          ))}
        </div>
      </Screen>

      {/* Lightbox */}
      {lightbox !== null && (
        <div onClick={() => setLightbox(null)} style={{
          position: "absolute", inset: 0, zIndex: 200, background: "rgba(15,13,10,0.96)",
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
        }}>
          {/* Top bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>
              {lightbox + 1} / {shown.length}
            </span>
            <button onClick={(e) => { e.stopPropagation(); setLightbox(null); }} style={{
              width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.12)",
              border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
            }}>{Icons.close("#fff")}</button>
          </div>

          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "0 12px", textAlign: "center" }}>
            <img src={shown[lightbox].file} alt={shown[lightbox].caption}
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 12, objectFit: "contain" }} />
            <div style={{ color: "#fff", fontSize: 14, marginTop: 16, fontFamily: "'DM Sans', sans-serif" }}>{shown[lightbox].caption}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>{shown[lightbox].cat}</div>
          </div>

          {/* Nav arrows */}
          {shown.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); move(-1); }} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}>{Icons.back("#fff")}</button>
              <button onClick={(e) => { e.stopPropagation(); move(1); }} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(180deg)",
                width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)",
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
              }}>{Icons.back("#fff")}</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { LoginScreen, HomeScreen, CalendarScreen, BookScreen, MyTripsScreen, HouseInfoScreen, AdminScreen, SuppliesScreen, CheckoutScreen, GalleryScreen });
