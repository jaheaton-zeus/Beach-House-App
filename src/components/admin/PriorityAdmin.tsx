"use client";

import { swapPriority } from "@/app/admin-actions";
import type { FamilyPriorityRow } from "@/lib/db";

export function PriorityAdmin({ priority }: { priority: FamilyPriorityRow[] }) {
  return (
    <div>
      <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4, marginBottom: 6 }}>
        Booking Priority
      </div>
      <p
        style={{
          fontSize: 14,
          color: "var(--text-2)",
          margin: "0 0 20px",
          maxWidth: 520,
          lineHeight: 1.55,
        }}
      >
        When both families request overlapping dates, the family with priority is approved first.
        Rotate it each season.
      </p>

      <div style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        {priority.map((fam, i) => (
          <div key={fam.family} className="sc-admin-row" style={{ padding: "16px 20px" }}>
            <div className="sc-priority__rank">{fam.rank}</div>
            <div style={{ flex: 1, fontSize: 16, fontWeight: 700 }}>{fam.family} family</div>
            <span className={i === 0 ? "sc-priority__tag sc-priority__tag--first" : "sc-priority__tag"}>
              {i === 0 ? "First pick" : "Second"}
            </span>
          </div>
        ))}
      </div>

      <form action={swapPriority}>
        <button type="submit" className="sc-btn sc-btn--ghost sc-btn--sm" style={{ marginTop: 18, padding: "11px 20px" }}>
          Swap priority
        </button>
      </form>
    </div>
  );
}
