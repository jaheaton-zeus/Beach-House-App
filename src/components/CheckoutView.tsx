"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { SupplyRow } from "@/lib/db";
import type { ChecklistItemRow } from "@/app/(app)/checkout/page";
import { Icons } from "@/lib/icons";
import { Btn, Card, IconBtn, SectionLabel, TopBar, FONT_DISPLAY, FONT_SANS } from "@/components/ui";

export function CheckoutView({ theme, items, lowItems }: { theme: ThemeColors; items: ChecklistItemRow[]; lowItems: SupplyRow[] }) {
  const router = useRouter();
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  const completedCount = Object.values(checks).filter(Boolean).length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  const toggle = (i: number) => setChecks((c) => ({ ...c, [i]: !c[i] }));

  if (done) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "60vh", background: theme.bg, alignItems: "center", justifyContent: "center", padding: 32, textAlign: "center" }}>
        <div style={{ width: 96, height: 96, borderRadius: "50%", background: theme.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: theme.accent, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12L10 17L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            textTransform: "uppercase",
            fontSize: 28,
            color: theme.text,
            marginBottom: 10,
            letterSpacing: "-0.01em",
          }}
        >
          All set!
        </div>
        <div style={{ fontSize: 15, color: theme.textMuted, maxWidth: 280, lineHeight: 1.5, marginBottom: 28 }}>
          The next family will get a notification with the supply status and your handoff notes.
        </div>
        <Btn onClick={() => router.push("/home")} theme={theme} variant="primary" size="lg" full style={{ maxWidth: 280 }}>
          Back to home
        </Btn>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar
        title="Checkout"
        subtitle={`${completedCount}/${items.length} done`}
        theme={theme}
        left={
          <IconBtn theme={theme} onClick={() => router.push("/supplies")}>
            {Icons.back(theme.text)}
          </IconBtn>
        }
      />

      <div style={{ height: 3, background: theme.border, margin: "0 20px", borderRadius: 99, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: theme.accent, transition: "width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)", borderRadius: 99 }} />
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60 }}>
        <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: 24,
                color: theme.text,
                letterSpacing: "-0.01em",
                lineHeight: 1.1,
                marginBottom: 6,
              }}
            >
              Leave it better than you found it.
            </div>
            <div style={{ fontSize: 14, color: theme.textMuted }}>Quick check before you head out — takes 5 min.</div>
          </div>

          <Card theme={theme} style={{ padding: 0 }}>
            {items.map((item, i) => {
              const checked = !!checks[item.id];
              return (
                <button
                  key={item.id}
                  onClick={() => toggle(item.id)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    borderBottom: i < items.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none",
                    fontFamily: FONT_SANS,
                  }}
                >
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: checked ? theme.accent : "transparent",
                      border: `1.5px solid ${checked ? theme.accent : theme.border}`,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    {checked && Icons.check("#fff")}
                  </div>
                  <span style={{ fontSize: 14, color: checked ? theme.textMuted : theme.text, textDecoration: checked ? "line-through" : "none", transition: "all 0.15s", flex: 1 }}>
                    {item.text}
                  </span>
                </button>
              );
            })}
          </Card>

          {lowItems.length > 0 && (
            <div>
              <SectionLabel theme={theme}>Heads-up for the next family</SectionLabel>
              <Card theme={theme} style={{ background: theme.accentSoft, border: `0.5px solid ${theme.accent}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ color: theme.accentDeep }}>{Icons.alert(theme.accentDeep)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: theme.accentDeep, marginBottom: 2 }}>{lowItems.length} supplies need restocking</div>
                    <div style={{ fontSize: 12, color: theme.accentDeep, opacity: 0.8 }}>They&apos;ll see this when they arrive.</div>
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {lowItems.map((s) => (
                    <span
                      key={s.id}
                      style={{
                        padding: "3px 9px",
                        background: s.status === "out" ? theme.badge.denied : theme.badge.pending,
                        color: s.status === "out" ? theme.badge.deniedText : theme.badge.pendingText,
                        borderRadius: 99,
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      {s.status === "out" ? "● " : "○ "}
                      {s.name}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => router.push("/supplies")}
                  style={{ marginTop: 10, background: "none", border: "none", cursor: "pointer", color: theme.accentDeep, fontSize: 12, fontWeight: 600, fontFamily: FONT_SANS, padding: 0 }}
                >
                  Update supplies →
                </button>
              </Card>
            </div>
          )}

          <Btn onClick={() => setDone(true)} disabled={completedCount < items.length} theme={theme} variant="accent" size="lg" full style={{ marginTop: 4 }}>
            {completedCount < items.length ? `${items.length - completedCount} item${items.length - completedCount > 1 ? "s" : ""} to go` : "Finish checkout"}
          </Btn>
        </div>
      </div>
    </div>
  );
}
