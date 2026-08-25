"use client";

import { castVote } from "@/app/admin-actions";
import type { ReservationWithVotes } from "@/lib/db";
import { formatRange, nightsLabel } from "@/lib/format";
import { Avatar, StatusPill } from "@/components/ui";

export function ReservationsAdmin({
  reservations,
  needed,
  superCount,
}: {
  reservations: ReservationWithVotes[];
  needed: number;
  superCount: number;
}) {
  const rank = { pending: 0, approved: 1, denied: 2 } as const;
  const sorted = [...reservations].sort(
    (a, b) => rank[a.status] - rank[b.status] || a.check_in.localeCompare(b.check_in)
  );
  const pendingCount = reservations.filter((r) => r.status === "pending").length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Booking Requests</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--pending-text)" }}>
          {pendingCount === 0 ? "All caught up" : `${pendingCount} pending`}
        </span>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 18px" }}>
        Super Users can approve or deny incoming requests.
      </p>

      {sorted.length === 0 ? (
        <div className="sc-empty">No booking requests yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sorted.map((res) => (
            <div key={res.id} className="sc-admin-row">
              <Avatar name={res.guest_name} family={res.family} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{res.guest_name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>
                    {res.family} family
                  </span>
                </div>
                <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>
                  {formatRange(res.check_in, res.check_out)} ·{" "}
                  {nightsLabel(res.check_in, res.check_out)}
                </div>
              </div>

              {res.status === "pending" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 7,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.5)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {res.approvals} of {needed} approvals needed · {superCount} super users
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <form action={castVote}>
                      <input type="hidden" name="reservationId" value={res.id} />
                      <input type="hidden" name="vote" value="approve" />
                      <button
                        type="submit"
                        className={
                          res.my_vote === "approve"
                            ? "sc-btn sc-btn--sm sc-btn--voted"
                            : "sc-btn sc-btn--sm"
                        }
                      >
                        {res.my_vote === "approve" ? "✓ Approved" : "Approve"}
                      </button>
                    </form>
                    <form action={castVote}>
                      <input type="hidden" name="reservationId" value={res.id} />
                      <input type="hidden" name="vote" value="deny" />
                      <button
                        type="submit"
                        className={
                          res.my_vote === "deny"
                            ? "sc-btn sc-btn--sm sc-btn--denied"
                            : "sc-btn sc-btn--sm sc-btn--ghost"
                        }
                      >
                        {res.my_vote === "deny" ? "✓ Denied" : "Deny"}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <StatusPill status={res.status} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
