"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors, FamilyColor } from "@/lib/theme";
import { FAMILY_COLORS } from "@/lib/theme";
import type { PriorityPeriodRow } from "@/lib/db";
import { setPriorityFamily } from "@/app/admin-actions";
import { fmtDate } from "@/lib/format";
import { Card, Screen } from "@/components/ui";

export function PriorityAdmin({ theme, periods }: { theme: ThemeColors; periods: PriorityPeriodRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState("");
  const families = Object.keys(FAMILY_COLORS) as (keyof typeof FAMILY_COLORS)[];

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  };

  const setFamily = (periodId: number, family: "Pierce" | "Thomas") => {
    startTransition(async () => {
      await setPriorityFamily(periodId, family);
      flash("Priority updated");
      router.refresh();
    });
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            {toast}
          </div>
        )}
        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 4 }}>Set which family has priority for each period of the year.</div>
        {periods.map((p) => (
          <Card key={p.id} theme={theme} style={{ padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>
                {fmtDate(p.start_date, { month: "short", day: "numeric" })} – {fmtDate(p.end_date, { month: "short", day: "numeric" })}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {families.map((f) => {
                  const fc: FamilyColor = FAMILY_COLORS[f];
                  return (
                    <button
                      key={f}
                      disabled={isPending}
                      onClick={() => setFamily(p.id, f)}
                      style={{
                        padding: "6px 14px",
                        borderRadius: 99,
                        border: "none",
                        cursor: "pointer",
                        background: p.family === f ? fc.primary : theme.surfaceAlt,
                        color: p.family === f ? "#fff" : theme.text,
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {f}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
