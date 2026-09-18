"use client";

import { useState } from "react";

import { castVote } from "@/app/admin-actions";
import type { Family, ReservationWithVotes } from "@/lib/db";
import { formatRange, nightsLabel } from "@/lib/format";
import { Avatar, StatusPill } from "@/components/ui";

export function ReservationsAdmin({
  reservations,
  firstPickFamily,
}: {
  reservations: ReservationWithVotes[];
  firstPickFamily: Family | null;
}) {
  // One row at a time asks for a denial reason.
  const [denyingId, setDenyingId] = useState<number | null>(null);
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
        Super Users can approve or deny incoming requests. A {firstPickFamily ?? "First Pick"} super user (First Pick) decides on their own; the other family&apos;s vote is advisory. Denials need a reason.
      </p>

      {sorted.length === 0 ? (
        <div className="sc-empty">No booking requests yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sorted.map((res) => (
            <div key={res.id} className="sc-admin-row sc-resv-row">
              <Avatar name={res.guest_name} family={res.family} />
              <div className="sc-resv-row__info">
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
                <div className="sc-resv-row__vote">
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    First Pick: {firstPickFamily ?? "—"} · waiting on a {firstPickFamily ?? "First Pick"} super user
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
                    {res.my_vote === "deny" ? (
                      // Clicking your own deny takes it back (no reason sent).
                      <form action={castVote}>
                        <input type="hidden" name="reservationId" value={res.id} />
                        <input type="hidden" name="vote" value="deny" />
                        <button type="submit" className="sc-btn sc-btn--sm sc-btn--denied">
                          ✓ Denied
                        </button>
                      </form>
                    ) : (
                      <button
                        type="button"
                        className="sc-btn sc-btn--sm sc-btn--ghost"
                        onClick={() => setDenyingId(denyingId === res.id ? null : res.id)}
                      >
                        Deny
                      </button>
                    )}
                  </div>
                  {denyingId === res.id ? (
                    <form
                      action={async (formData) => {
                        await castVote(formData);
                        setDenyingId(null);
                      }}
                      className="sc-deny-form"
                    >
                      <input type="hidden" name="reservationId" value={res.id} />
                      <input type="hidden" name="vote" value="deny" />
                      <textarea
                        name="comment"
                        required
                        rows={3}
                        maxLength={1000}
                        placeholder="Why is this being declined? The requestor will see this in their email."
                        className="sc-deny-form__reason"
                      />
                      <button type="submit" className="sc-btn sc-btn--sm sc-btn--denied">
                        Confirm deny
                      </button>
                    </form>
                  ) : null}
                </div>
              ) : (
                <div className="sc-resv-row__vote">
                  <StatusPill status={res.status} />
                  {res.status === "denied" && res.deny_reason ? (
                    <div className="sc-deny-note">“{res.deny_reason}”</div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
