import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { GalleryPhotoRow, PriorityPeriodRow } from "@/lib/db";
import { THEMES, FAMILY_COLORS } from "@/lib/theme";
import { fmtRange, todayISO } from "@/lib/format";
import { Icons } from "@/lib/icons";
import { Avatar, Badge, Card, CardLink, Screen, SectionLabel, FONT_DISPLAY } from "@/components/ui";

export const dynamic = "force-dynamic";

interface UpcomingReservation {
  id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  status: "pending" | "approved" | "denied";
  user_name: string;
  avatar: string;
  family: "Pierce" | "Thomas";
}

export default async function HomePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const theme = THEMES.shore;
  const db = await getDB();
  const today = todayISO();

  const [upcomingRes, priorityRes, galleryRes, outRes] = await Promise.all([
    db
      .prepare(
        `SELECT r.id, r.user_id, r.check_in, r.check_out, r.guest_count, r.status,
                u.name as user_name, u.avatar, u.family
         FROM reservations r JOIN users u ON u.id = r.user_id
         WHERE r.check_in >= ? AND r.status != 'denied'
         ORDER BY r.check_in ASC`
      )
      .bind(today)
      .all<UpcomingReservation>(),
    db
      .prepare(`SELECT * FROM priority_periods WHERE ? BETWEEN start_date AND end_date LIMIT 1`)
      .bind(today)
      .first<PriorityPeriodRow>(),
    db.prepare(`SELECT * FROM gallery_photos ORDER BY sort_order LIMIT 7`).all<GalleryPhotoRow>(),
    db.prepare(`SELECT COUNT(*) as count FROM supplies WHERE status = 'out'`).first<{ count: number }>(),
  ]);

  const upcoming = upcomingRes.results;
  const myNext = upcoming.find((r) => r.user_id === user.id);
  const currentSlot = priorityRes;
  const gallery = galleryRes.results;
  const outCount = outRes?.count ?? 0;

  const now = new Date();
  const daysUntil = (d: string) => Math.ceil((new Date(d + "T12:00:00").getTime() - now.getTime()) / 86400000);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <Screen>
        <div className="home-dashboard grid">
          <div className="home-col">
            {/* Greeting */}
            <div style={{ padding: "20px 20px 12px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2, fontWeight: 500 }}>
                    {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                  </div>
                  <div
                    style={{
                      fontFamily: FONT_DISPLAY,
                      fontSize: 32,
                      color: theme.text,
                      letterSpacing: "-0.015em",
                      lineHeight: 1.1,
                    }}
                  >
                    Hi, {user.name.split(" ")[0]}
                  </div>
                </div>
                <Avatar initials={user.avatar} size={44} family={user.family} />
              </div>
            </div>

            {/* Priority period */}
            <div style={{ padding: "14px 20px 0" }}>
              <SectionLabel theme={theme}>Family Schedule</SectionLabel>
              {currentSlot && (
                <Card
                  theme={theme}
                  style={{
                    padding: "16px 18px",
                    marginBottom: 10,
                    background: FAMILY_COLORS[currentSlot.family].soft,
                    border: `0.5px solid ${FAMILY_COLORS[currentSlot.family].primary}33`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: FAMILY_COLORS[currentSlot.family].deep,
                          marginBottom: 4,
                        }}
                      >
                        Priority To
                      </div>
                      <div
                        style={{
                          fontFamily: FONT_DISPLAY,
                          fontSize: 19,
                          color: FAMILY_COLORS[currentSlot.family].deep,
                          lineHeight: 1.1,
                        }}
                      >
                        {currentSlot.family}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: FAMILY_COLORS[currentSlot.family].deep,
                          opacity: 0.7,
                          marginTop: 3,
                        }}
                      >
                        {currentSlot.label}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: FAMILY_COLORS[currentSlot.family].primary,
                        color: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: FONT_DISPLAY,
                        fontSize: 22,
                      }}
                    >
                      {currentSlot.family[0]}
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Hero house card */}
            <div style={{ padding: "12px 20px 4px" }}>
              <CardLink
                href="/info"
                theme={theme}
                style={{
                  position: "relative",
                  borderRadius: 22,
                  overflow: "hidden",
                  backgroundImage: "url('/photos/IMG_3260.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: theme.surfaceAlt,
                  aspectRatio: "16/10",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  padding: 0,
                  border: "none",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(31,27,22,0) 40%, rgba(31,27,22,0.85) 100%)",
                  }}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 20px 18px", color: "#fff" }}>
                  <div
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.7)",
                      marginBottom: 4,
                      fontWeight: 500,
                    }}
                  >
                    The Beach House
                  </div>
                  <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, lineHeight: 1.1, marginBottom: 4 }}>
                    Shelter Cove
                  </div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", gap: 4 }}>
                    {Icons.pin("rgba(255,255,255,0.85)")}
                    Unit 7557 · Shelter Cove, Hilton Head
                  </div>
                </div>
              </CardLink>
            </div>

            {/* My next trip / plan a stay */}
            {myNext ? (
              <div style={{ padding: "20px 20px 0" }}>
                <CardLink href="/mytrips" theme={theme} style={{ background: theme.text, color: "#fff", border: "none" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.55)",
                          fontWeight: 500,
                          marginBottom: 6,
                        }}
                      >
                        Your next stay
                      </div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                        {fmtRange(myNext.check_in, myNext.check_out)}
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginTop: 8 }}>
                        {daysUntil(myNext.check_in) === 0
                          ? "Today"
                          : daysUntil(myNext.check_in) === 1
                          ? "Tomorrow"
                          : `In ${daysUntil(myNext.check_in)} days`}{" "}
                        · {myNext.guest_count} guests
                      </div>
                    </div>
                    <Badge status={myNext.status} theme={theme} />
                  </div>
                </CardLink>
              </div>
            ) : (
              <div style={{ padding: "20px 20px 0" }}>
                <CardLink href="/book" theme={theme} style={{ background: theme.accent, color: "#fff", border: "none" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, letterSpacing: "-0.01em", lineHeight: 1.1 }}>
                        Plan a stay
                      </div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                        Pick your dates and we&apos;ll let the family know.
                      </div>
                    </div>
                    {Icons.chevron("#fff")}
                  </div>
                </CardLink>
              </div>
            )}
          </div>

          <div className="home-col">
            {/* Photo strip */}
            <div style={{ padding: "22px 0 0" }}>
              <div style={{ padding: "0 20px" }}>
                <SectionLabel theme={theme}>A Look Inside</SectionLabel>
              </div>
              <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 20px 4px" }}>
                {gallery.map((p, idx) => (
                  <a
                    key={p.file_path}
                    href="/gallery"
                    style={{
                      flexShrink: 0,
                      padding: 0,
                      width: idx === 0 ? 220 : 150,
                      height: 130,
                      borderRadius: 16,
                      overflow: "hidden",
                      position: "relative",
                      background: theme.surfaceAlt,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      display: "block",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/${p.file_path}`}
                      alt={p.caption ?? ""}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "18px 10px 8px",
                        background: "linear-gradient(180deg, rgba(31,27,22,0) 0%, rgba(31,27,22,0.72) 100%)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 500,
                        textAlign: "left",
                        lineHeight: 1.25,
                      }}
                    >
                      {p.caption}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Supplies alert */}
            {outCount > 0 && (
              <div style={{ padding: "20px 20px 0" }}>
                <CardLink
                  href="/supplies"
                  theme={theme}
                  style={{ background: theme.accentSoft, border: `0.5px solid ${theme.accent}` }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: theme.accentSoft,
                        color: theme.accentDeep,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {Icons.alert(theme.accentDeep)}
                    </div>
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
                </CardLink>
              </div>
            )}

            {/* Upcoming stays */}
            {upcoming.length > 0 && (
              <div style={{ padding: "20px 20px 0" }}>
                <SectionLabel theme={theme}>Upcoming Stays</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {upcoming.slice(0, 3).map((r) => (
                    <CardLink key={r.id} href="/calendar" theme={theme} style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Avatar initials={r.avatar || "?"} size={38} family={r.family} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{r.user_name}</span>
                            {r.status === "pending" && <Badge status="pending" theme={theme} />}
                          </div>
                          <div style={{ fontSize: 13, color: theme.textMuted }}>
                            {fmtRange(r.check_in, r.check_out)} · {r.guest_count} guests
                          </div>
                        </div>
                        {Icons.chevron(theme.textSubtle)}
                      </div>
                    </CardLink>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div style={{ padding: "24px 20px 0" }}>
              <SectionLabel theme={theme}>Quick Access</SectionLabel>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                  { icon: Icons.supplies, label: "House Supplies", href: "/supplies" },
                  { icon: Icons.photos, label: "Photo Gallery", href: "/gallery" },
                  { icon: Icons.key, label: "Access & WiFi", href: "/info" },
                  { icon: Icons.bike, label: "Bike Trails", href: "/info" },
                  { icon: Icons.wave, label: "Beaches", href: "/info" },
                  { icon: Icons.fork, label: "Dining", href: "/info" },
                  { icon: Icons.rules, label: "House Rules", href: "/info" },
                ].map((item) => (
                  <CardLink key={item.label} href={item.href} theme={theme} style={{ padding: "16px" }}>
                    <div style={{ marginBottom: 8, color: theme.accent }}>{item.icon(theme.accent)}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>
                      {item.label}
                    </div>
                  </CardLink>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Screen>
    </div>
  );
}
