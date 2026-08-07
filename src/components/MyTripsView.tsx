"use client";

import { useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { MyTripRow } from "@/app/(app)/mytrips/page";
import { fmtRange, nightsBetween, todayISO } from "@/lib/format";
import { Icons } from "@/lib/icons";
import { Badge, Btn, Card, Screen, TopBar, FONT_DISPLAY } from "@/components/ui";

export function MyTripsView({ theme, reservations }: { theme: ThemeColors; reservations: MyTripRow[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<number | null>(null);
  const today = todayISO();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title="My Trips"
        subtitle={`${reservations.length} reservation${reservations.length !== 1 ? "s" : ""}`}
        theme={theme}
      />
      <Screen>
        <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {reservations.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: theme.accentSoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                {Icons.trips(theme.accent)}
              </div>
              <div
                style={{
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  fontSize: 22,
                  color: theme.text,
                  marginBottom: 6,
                  letterSpacing: "-0.01em",
                }}
              >
                No trips yet
              </div>
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 24 }}>Plan your next stay at the house.</div>
              <Btn onClick={() => router.push("/book")} theme={theme} variant="accent" size="lg">
                Book a Stay
              </Btn>
            </div>
          )}

          {reservations.map((r) => {
            const isPast = r.check_out < today;
            const guests: string[] = JSON.parse(r.guests_json);
            return (
              <Card
                key={r.id}
                theme={theme}
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                style={{ opacity: isPast ? 0.65 : 1 }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <Badge status={r.status} theme={theme} />
                      <span style={{ fontSize: 12, color: theme.textSubtle }}>{nightsBetween(r.check_in, r.check_out)} nights</span>
                      {isPast && <span style={{ fontSize: 11, color: theme.textSubtle, fontStyle: "italic" }}>Past</span>}
                    </div>
                    <div
                      style={{
                        fontFamily: FONT_DISPLAY,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: 22,
                        color: theme.text,
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                      }}
                    >
                      {fmtRange(r.check_in, r.check_out)}
                    </div>
                    <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
                      {r.guest_count} guest{r.guest_count > 1 ? "s" : ""}
                    </div>
                  </div>
                  <div
                    style={{
                      color: theme.textSubtle,
                      transition: "transform 0.2s",
                      transform: expanded === r.id ? "rotate(90deg)" : "none",
                    }}
                  >
                    {Icons.chevron(theme.textSubtle)}
                  </div>
                </div>

                {expanded === r.id && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `0.5px solid ${theme.border}` }}>
                    {r.notes && (
                      <div style={{ marginBottom: 14 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: theme.textSubtle,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            marginBottom: 5,
                          }}
                        >
                          Note
                        </div>
                        <div style={{ fontSize: 14, color: theme.text }}>&quot;{r.notes}&quot;</div>
                      </div>
                    )}
                    <div style={{ marginBottom: 14 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: theme.textSubtle,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        Guests
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {guests.map((g, i) => (
                          <span
                            key={i}
                            className="pill-badge"
                            style={
                              {
                                padding: "4px 11px",
                                background: theme.surfaceAlt,
                                borderRadius: 99,
                                fontSize: 12,
                                color: theme.text,
                                "--pc": theme.text,
                              } as CSSProperties
                            }
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                    {r.status === "pending" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 12px",
                          background: theme.surfaceAlt,
                          borderRadius: 10,
                        }}
                      >
                        <span style={{ fontSize: 12, color: theme.textMuted }}>Family chime-ins</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{r.approve_count} 👍</span>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}

          {reservations.length > 0 && (
            <Btn onClick={() => router.push("/book")} theme={theme} variant="light" full style={{ marginTop: 10 }}>
              + Plan another stay
            </Btn>
          )}
        </div>
      </Screen>
    </div>
  );
}
