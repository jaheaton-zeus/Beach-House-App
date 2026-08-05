"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import { FAMILY_COLORS } from "@/lib/theme";
import type { PriorityPeriodRow } from "@/lib/db";
import type { CalendarReservation } from "@/app/(app)/calendar/page";
import { MONTHS, MONTHS_SHORT, fmtRange, todayISO, parseLocalDate } from "@/lib/format";
import { Icons } from "@/lib/icons";
import { Avatar, Badge, Btn, Card, Screen, SectionLabel, FONT_DISPLAY, FONT_SANS } from "@/components/ui";

function fmtKey(d: Date) {
  return d.toISOString().split("T")[0];
}

export function CalendarView({
  theme,
  reservations,
  priorityPeriods,
}: {
  theme: ThemeColors;
  reservations: CalendarReservation[];
  priorityPeriods: PriorityPeriodRow[];
}) {
  const router = useRouter();
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState<{ start: string | null; end: string | null }>({
    start: null,
    end: null,
  });

  const today = todayISO();

  const goPrev = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const goNext = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };
  const goToday = () => {
    setViewMonth(now.getMonth());
    setViewYear(now.getFullYear());
  };

  const getFamilyForMonth = (year: number, month: number) => {
    const mid = `${year}-${String(month + 1).padStart(2, "0")}-15`;
    return priorityPeriods.find((p) => mid >= p.start_date && mid <= p.end_date) || null;
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const gridStart = new Date(viewYear, viewMonth, 1 - firstDay);
  const weeks = useMemo(() => {
    const w: Date[][] = [];
    for (let r = 0; r < 6; r++) {
      const row: Date[] = [];
      for (let c = 0; c < 7; c++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + r * 7 + c);
        row.push(d);
      }
      w.push(row);
    }
    return w;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewYear, viewMonth]);

  const handleDayClick = (key: string, isCurrentMonth: boolean) => {
    if (!isCurrentMonth || key < today) return;
    if (!selected.start || (selected.start && selected.end)) {
      setSelected({ start: key, end: null });
    } else if (key < selected.start) {
      setSelected({ start: key, end: selected.start });
    } else if (key === selected.start) {
      setSelected({ start: null, end: null });
    } else {
      setSelected({ start: selected.start, end: key });
    }
  };
  const inRange = (key: string) =>
    selected.start && selected.end && key > selected.start && key < selected.end;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <Screen>
        <div style={{ padding: "20px 0 0" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              marginBottom: 18,
            }}
          >
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 34, color: theme.text, letterSpacing: "-0.015em" }}>
              {MONTHS[viewMonth]} <span style={{ color: theme.textMuted }}>{viewYear}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button
                onClick={goToday}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  color: theme.text,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: FONT_SANS,
                }}
              >
                Today
              </button>
              <button
                onClick={goPrev}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: theme.text,
                }}
              >
                {Icons.back(theme.text)}
              </button>
              <button
                onClick={goNext}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: `1px solid ${theme.border}`,
                  background: theme.surface,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(180deg)",
                  color: theme.text,
                }}
              >
                {Icons.back(theme.text)}
              </button>
            </div>
          </div>

          {/* Year strip */}
          <div style={{ marginBottom: 20 }}>
            <SectionLabel theme={theme}>{viewYear} at a glance</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 5 }}>
              {Array.from({ length: 12 }).map((_, m) => {
                const f = getFamilyForMonth(viewYear, m);
                const fc = f ? FAMILY_COLORS[f.family] : null;
                const active = m === viewMonth;
                return (
                  <button
                    key={m}
                    onClick={() => setViewMonth(m)}
                    style={{
                      padding: "10px 2px",
                      borderRadius: 10,
                      cursor: "pointer",
                      background: active ? fc?.primary || theme.accent : fc?.soft || theme.surfaceAlt,
                      border: "none",
                      fontFamily: FONT_SANS,
                      color: active ? "#fff" : fc?.deep || theme.text,
                      transition: "all 0.15s",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>{MONTHS_SHORT[m]}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, marginTop: 1, fontFamily: FONT_DISPLAY }}>
                      {f ? f.family[0] : "—"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Month grid */}
          <div style={{ border: `1px solid ${theme.border}`, borderRadius: 12, overflow: "hidden", background: theme.surface }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${theme.border}` }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 11,
                    fontWeight: 600,
                    color: theme.textMuted,
                    padding: "8px 0",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>
            {weeks.map((week, wi) => {
              const segs: {
                r: CalendarReservation;
                startCol: number;
                endCol: number;
                isStart: boolean;
                isEnd: boolean;
                slot: number;
              }[] = [];
              reservations.forEach((r) => {
                const start = parseLocalDate(r.check_in);
                const end = parseLocalDate(r.check_out);
                if (end < week[0] || start > week[6]) return;
                const segStart = start < week[0] ? week[0] : start;
                const segEnd = end > week[6] ? week[6] : end;
                const startCol = Math.round((segStart.getTime() - week[0].getTime()) / 86400000) + 1;
                const endCol = Math.round((segEnd.getTime() - week[0].getTime()) / 86400000) + 1;
                segs.push({
                  r,
                  startCol,
                  endCol,
                  isStart: fmtKey(start) === fmtKey(segStart),
                  isEnd: fmtKey(end) === fmtKey(segEnd),
                  slot: 0,
                });
              });
              segs.sort((a, b) => a.startCol - b.startCol);
              const slots: number[] = [];
              segs.forEach((s) => {
                let slot = slots.findIndex((occupiedTo) => occupiedTo < s.startCol);
                if (slot === -1) {
                  slot = slots.length;
                  slots.push(s.endCol);
                } else {
                  slots[slot] = s.endCol;
                }
                s.slot = slot;
              });
              const maxSlots = Math.max(0, ...segs.map((s) => s.slot + 1));
              const rowMinHeight = 40 + maxSlots * 24;

              return (
                <div
                  key={wi}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, 1fr)",
                    gridAutoRows: 22,
                    position: "relative",
                    minHeight: rowMinHeight,
                    borderBottom: wi < weeks.length - 1 ? `1px solid ${theme.borderSoft}` : "none",
                  }}
                >
                  {week.map((d, ci) => {
                    const isCurrentMonth = d.getMonth() === viewMonth;
                    const key = fmtKey(d);
                    const isToday = key === today;
                    const isStart = key === selected.start;
                    const isEnd = key === selected.end;
                    const isBetween = inRange(key);
                    return (
                      <div
                        key={ci}
                        onClick={() => handleDayClick(key, isCurrentMonth)}
                        style={{
                          gridColumn: ci + 1,
                          gridRow: "1 / -1",
                          borderRight: ci < 6 ? `1px solid ${theme.borderSoft}` : "none",
                          background: isBetween ? theme.accentSoft : "transparent",
                          cursor: isCurrentMonth && key >= today ? "pointer" : "default",
                          opacity: isCurrentMonth ? 1 : 0.35,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "flex-end", padding: "5px 6px 0" }}>
                          <span
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: isToday ? 700 : 500,
                              background: isStart || isEnd ? theme.accent : isToday ? theme.text : "transparent",
                              color: isStart || isEnd || isToday ? "#fff" : theme.text,
                            }}
                          >
                            {d.getDate()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {segs.map((s, si) => {
                    const fc = s.r.family ? FAMILY_COLORS[s.r.family] : null;
                    const pending = s.r.status === "pending";
                    const bg = pending ? theme.accentSoft : fc?.soft || theme.surfaceAlt;
                    const color = pending ? theme.accentDeep : fc?.deep || theme.text;
                    return (
                      <div
                        key={si}
                        onClick={() => router.push("/mytrips")}
                        title={`${s.r.user_name} · ${fmtRange(s.r.check_in, s.r.check_out)}`}
                        style={{
                          gridColumn: `${s.startCol} / ${s.endCol + 1}`,
                          gridRow: s.slot + 2,
                          margin: "0 2px",
                          padding: "2px 8px",
                          background: bg,
                          color,
                          borderRadius: s.isStart && s.isEnd ? 6 : s.isStart ? "6px 0 0 6px" : s.isEnd ? "0 6px 6px 0" : 0,
                          fontSize: 11,
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          cursor: "pointer",
                          zIndex: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {s.r.user_name}
                      </div>
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
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.dot, border: `1px solid ${l.ring}` }} />
                <span style={{ fontSize: 11, color: theme.textMuted }}>{l.label}</span>
              </div>
            ))}
          </div>

          {/* Upcoming list */}
          <div style={{ marginTop: 28, paddingBottom: 40 }}>
            <SectionLabel theme={theme}>All Upcoming Stays</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {reservations
                .filter((r) => r.check_in >= today)
                .sort((a, b) => a.check_in.localeCompare(b.check_in))
                .map((r) => (
                  <Card key={r.id} theme={theme} style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar initials={r.avatar || "?"} size={36} family={r.family} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{r.user_name}</div>
                        <div style={{ fontSize: 12, color: theme.textMuted }}>
                          {fmtRange(r.check_in, r.check_out)} · {r.guest_count} guests
                        </div>
                      </div>
                      <Badge status={r.status} theme={theme} />
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </Screen>

      {selected.start && selected.end && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", width: "min(92%, 420px)", zIndex: 150 }}>
          <Btn
            onClick={() => router.push(`/book?start=${selected.start}&end=${selected.end}`)}
            theme={theme}
            variant="accent"
            size="lg"
            full
            style={{ boxShadow: "0 12px 30px rgba(201,100,66,0.3)" }}
          >
            Continue with {fmtRange(selected.start, selected.end)}
          </Btn>
        </div>
      )}
    </div>
  );
}
