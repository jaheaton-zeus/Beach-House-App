"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { UserRow } from "@/lib/db";
import type { AdminReservationRow } from "@/app/(app)/admin/page";
import { castReservationVote } from "@/app/admin-actions";
import { fmtRange, nightsBetween } from "@/lib/format";
import { Avatar, Badge, Btn, Card, Screen } from "@/components/ui";

type Filter = "pending" | "approved" | "denied" | "all";

export function ReservationsAdmin({
  theme,
  currentUser,
  reservations,
}: {
  theme: ThemeColors;
  currentUser: UserRow;
  reservations: AdminReservationRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<Filter>("pending");
  const [toast, setToast] = useState("");

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    approved: reservations.filter((r) => r.status === "approved").length,
    denied: reservations.filter((r) => r.status === "denied").length,
  };

  const filtered = filter === "all" ? reservations : reservations.filter((r) => r.status === filter);

  const vote = (id: number, v: "approve" | "deny") => {
    startTransition(async () => {
      await castReservationVote(id, v);
      setToast(v === "approve" ? "Approved 👍" : "Voted to deny");
      setTimeout(() => setToast(""), 1800);
      router.refresh();
    });
  };

  return (
    <>
      <div style={{ margin: "8px 20px 4px", display: "flex", background: theme.surfaceAlt, borderRadius: 10, padding: 3 }}>
        {(
          [
            { id: "pending", label: "Pending", n: counts.pending, color: theme.badge.pendingText },
            { id: "approved", label: "Approved", n: counts.approved, color: theme.badge.approvedText },
            { id: "denied", label: "Denied", n: counts.denied, color: theme.badge.deniedText },
            { id: "all", label: "All", n: counts.all, color: theme.text },
          ] as { id: Filter; label: string; n: number; color: string }[]
        ).map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              flex: 1,
              padding: "7px 0",
              borderRadius: 8,
              background: filter === f.id ? f.color : "transparent",
              color: filter === f.id ? "#fff" : theme.textMuted,
              boxShadow: filter === f.id ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
              border: "none",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              whiteSpace: "nowrap",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
          >
            {f.label}
            <span style={{ opacity: 0.75, fontSize: 11 }}>{f.n}</span>
          </button>
        ))}
      </div>

      {toast && (
        <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
          {toast}
        </div>
      )}

      <Screen>
        <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", color: theme.textMuted, fontSize: 14 }}>Nothing here.</div>}
          {filtered.map((r) => {
            const guests: string[] = JSON.parse(r.guests_json);
            return (
              <Card key={r.id} theme={theme}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                  <Avatar initials={r.avatar || "?"} size={42} family={r.family} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{r.user_name}</span>
                      <Badge status={r.status} theme={theme} />
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: theme.text, letterSpacing: "-0.005em", lineHeight: 1.1, marginBottom: 4 }}>
                      {fmtRange(r.check_in, r.check_out)}
                    </div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>
                      {nightsBetween(r.check_in, r.check_out)} nights · {r.guest_count} guests
                    </div>
                    {r.notes && (
                      <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8, padding: "8px 12px", background: theme.surfaceAlt, borderRadius: 8, fontStyle: "italic" }}>
                        &quot;{r.notes}&quot;
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                  {guests.map((g, i) => (
                    <span key={i} style={{ padding: "3px 9px", background: theme.surfaceAlt, borderRadius: 99, fontSize: 11, color: theme.textMuted }}>
                      {g}
                    </span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 10, borderTop: `0.5px solid ${theme.border}` }}>
                  <div style={{ fontSize: 12, color: theme.textMuted, display: "flex", gap: 12 }}>
                    <span>👍 {r.approve_count}</span>
                    <span>👎 {r.deny_count}</span>
                  </div>
                  {r.status === "pending" && r.user_id !== currentUser.id && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <Btn onClick={() => vote(r.id, "approve")} theme={theme} variant={r.my_vote === "approve" ? "accent" : "secondary"} size="sm" disabled={isPending}>
                        {r.my_vote === "approve" ? "✓ Approved" : "Approve"}
                      </Btn>
                      <Btn onClick={() => vote(r.id, "deny")} theme={theme} variant={r.my_vote === "deny" ? "primary" : "ghost"} size="sm" disabled={isPending}>
                        Deny
                      </Btn>
                    </div>
                  )}
                  {r.user_id === currentUser.id && <span style={{ fontSize: 11, color: theme.textSubtle, fontStyle: "italic" }}>your stay</span>}
                </div>
              </Card>
            );
          })}
        </div>
      </Screen>
    </>
  );
}
