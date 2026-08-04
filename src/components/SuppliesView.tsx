"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { SupplyRow } from "@/lib/db";
import { updateSupplyStatus } from "@/app/supplies-actions";
import { Icons } from "@/lib/icons";
import { Card, IconBtn, TopBar, FONT_DISPLAY, FONT_SANS } from "@/components/ui";

type SupplyWithUpdater = SupplyRow & { updated_by_name: string | null };
type StatusFilter = "all" | "needs" | "good" | "low" | "out";

const STATUS_META = {
  good: { colorKey: "approvedText" as const, bgKey: "approved" as const, dot: "#6B9E4F", label: "Stocked" },
  low: { colorKey: "pendingText" as const, bgKey: "pending" as const, dot: "#D49432", label: "Low" },
  out: { colorKey: "deniedText" as const, bgKey: "denied" as const, dot: "#C73E3E", label: "Out" },
};

export function SuppliesView({
  theme,
  supplies,
  showCheckoutPrompt,
}: {
  theme: ThemeColors;
  supplies: SupplyWithUpdater[];
  showCheckoutPrompt: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [toast, setToast] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const counts = {
    good: supplies.filter((s) => s.status === "good").length,
    low: supplies.filter((s) => s.status === "low").length,
    out: supplies.filter((s) => s.status === "out").length,
  };

  const filtered = filter === "all" ? supplies : filter === "needs" ? supplies.filter((s) => s.status !== "good") : supplies.filter((s) => s.status === filter);

  const categories = [...new Set(filtered.map((s) => s.category))];

  const setStatus = (id: number, status: "good" | "low" | "out") => {
    startTransition(async () => {
      await updateSupplyStatus(id, status);
      setToast("Updated");
      setTimeout(() => setToast(""), 1400);
      router.refresh();
    });
  };

  const fmtAgo = (d: string) => {
    const diff = Math.floor((new Date(today).getTime() - new Date(d).getTime()) / 86400000);
    if (diff <= 0) return "today";
    if (diff === 1) return "yesterday";
    if (diff < 7) return `${diff} days ago`;
    return `${Math.floor(diff / 7)}w ago`;
  };

  const colorFor = (key: "good" | "low" | "out", part: "color" | "bg") => {
    const meta = STATUS_META[key];
    return part === "color" ? theme.badge[meta.colorKey] : theme.badge[meta.bgKey];
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg, position: "relative" }}>
      <TopBar
        title="Supplies"
        subtitle={`${counts.out + counts.low} need attention`}
        theme={theme}
        left={
          <IconBtn theme={theme} onClick={() => router.push("/home")}>
            {Icons.back(theme.text)}
          </IconBtn>
        }
      />

      {toast && (
        <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: theme.text, color: "#fff", padding: "8px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60 }}>
        <div style={{ padding: "8px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          {showCheckoutPrompt && (
            <Card theme={theme} onClick={() => router.push("/checkout")} style={{ background: theme.accent, color: "#fff", border: "none" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
            {(["good", "low", "out"] as const).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key === "good" ? "all" : "needs")}
                style={{ background: colorFor(key, "bg"), border: "none", borderRadius: 14, padding: "14px 8px", cursor: "pointer", fontFamily: FONT_SANS, textAlign: "center" }}
              >
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: colorFor(key, "color"), lineHeight: 1 }}>{counts[key]}</div>
                <div style={{ fontSize: 11, color: colorFor(key, "color"), marginTop: 4, fontWeight: 600, letterSpacing: "0.02em" }}>{STATUS_META[key].label}</div>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 6, overflowX: "auto", margin: "0 -20px", padding: "0 20px" }}>
            {(
              [
                { id: "all", label: "All" },
                { id: "needs", label: "Needs attention" },
                { id: "out", label: "Out" },
                { id: "low", label: "Low" },
                { id: "good", label: "Stocked" },
              ] as { id: StatusFilter; label: string }[]
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: "6px 13px",
                  borderRadius: 99,
                  background: filter === f.id ? theme.text : theme.surface,
                  color: filter === f.id ? "#fff" : theme.text,
                  border: filter === f.id ? "none" : `0.5px solid ${theme.border}`,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: FONT_SANS,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {categories.map((cat) => (
            <div key={cat}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: theme.textSubtle, margin: "4px 4px 8px" }}>{cat}</div>
              <Card theme={theme} style={{ padding: 0 }}>
                {filtered
                  .filter((s) => s.category === cat)
                  .map((item, i, arr) => {
                    const meta = STATUS_META[item.status];
                    return (
                      <div
                        key={item.id}
                        style={{ padding: "13px 16px", borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none", display: "flex", alignItems: "center", gap: 12 }}
                      >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.dot, flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>{item.name}</span>
                            {!!item.essential && (
                              <span style={{ fontSize: 9, padding: "1px 6px", background: theme.accentSoft, color: theme.accent, borderRadius: 99, fontWeight: 600, letterSpacing: "0.04em" }}>
                                ESSENTIAL
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: 12, color: theme.textMuted }}>
                            {item.count_label} · updated {fmtAgo(item.updated_at)}
                            {item.updated_by_name ? ` by ${item.updated_by_name.split(" ")[0]}` : ""}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 3 }}>
                          {(["good", "low", "out"] as const).map((s) => (
                            <button
                              key={s}
                              disabled={isPending}
                              onClick={() => setStatus(item.id, s)}
                              style={{
                                width: 26,
                                height: 26,
                                borderRadius: "50%",
                                background: item.status === s ? STATUS_META[s].dot : "transparent",
                                border: `1.5px solid ${item.status === s ? STATUS_META[s].dot : theme.border}`,
                                cursor: isPending ? "default" : "pointer",
                                padding: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.12s",
                              }}
                            >
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
            Tap a circle to update:{" "}
            <span style={{ color: colorFor("good", "color"), fontWeight: 600 }}>● stocked</span> ·{" "}
            <span style={{ color: colorFor("low", "color"), fontWeight: 600 }}>● low</span> ·{" "}
            <span style={{ color: colorFor("out", "color"), fontWeight: 600 }}>● out</span>
          </div>
        </div>
      </div>
    </div>
  );
}
