import { CodeGate } from "@/components/CodeGate";
import { SiteHeader } from "@/components/SiteHeader";
import { Kicker, SectionHeading, StatusPill } from "@/components/ui";
import { signOut } from "@/app/auth-actions";
import { getCurrentUser } from "@/lib/auth";
import type { ReservationWithVotes } from "@/lib/db";
import { dateChip, formatRange, nightsLabel, todayString } from "@/lib/format";
import { getReservationsByCode, getSuperUserIds, majorityNeeded } from "@/lib/queries";

function TripRow({ trip, needed }: { trip: ReservationWithVotes; needed: number }) {
  const chip = dateChip(trip.check_in);
  return (
    <div className="sc-trip">
      <div className="sc-trip__chip">
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "var(--accent)" }}>
          {chip.month}
        </span>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{chip.day}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16.5, fontWeight: 700 }}>
          {formatRange(trip.check_in, trip.check_out)}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 3 }}>
          {nightsLabel(trip.check_in, trip.check_out)} · {trip.family} family
        </div>
        {trip.status === "pending" ? (
          <div style={{ fontSize: 12, color: "var(--pending-text)", marginTop: 8 }}>
            Awaiting review · {trip.approvals} of {needed} approvals so far
          </div>
        ) : null}
      </div>
      <StatusPill status={trip.status} />
    </div>
  );
}

export default async function MyTripsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="sc-page sc-page--tall">
        <div className="sc-content">
          <SiteHeader />
        </div>
        <CodeGate
          title="Whose trips?"
          lead="Enter your reservation code and we’ll show the stays booked with it."
          path="/mytrips"
        />
      </div>
    );
  }

  const [trips, superIds] = await Promise.all([
    getReservationsByCode(user.code),
    getSuperUserIds(),
  ]);
  const needed = majorityNeeded(superIds.length);
  const today = todayString();

  const pending = trips.filter((t) => t.status === "pending");
  const upcoming = trips.filter((t) => t.status === "approved" && t.check_out >= today);
  const past = trips
    .filter((t) => t.status === "denied" || (t.status === "approved" && t.check_out < today))
    .reverse();

  const groups = [
    { title: "Pending review", items: pending, empty: "No requests waiting on the house admins." },
    {
      title: "Upcoming",
      items: upcoming,
      empty: "No approved stays coming up. Book one from the home page.",
    },
    { title: "Past & declined", items: past, empty: "Nothing here yet." },
  ];

  return (
    <div className="sc-page sc-page--tall">
      <div className="sc-mytrips-glow" aria-hidden />
      <div className="sc-content">
        <SiteHeader />

        <div style={{ padding: "44px 0 22px" }}>
          <Kicker>YOUR STAYS</Kicker>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <h1 className="sc-h1">My Trips</h1>
            <form action={signOut} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input type="hidden" name="path" value="/mytrips" />
              <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.5)" }}>
                Viewing as <strong style={{ color: "#fff", fontWeight: 700 }}>{user.name}</strong>
              </span>
              <button
                type="submit"
                className="sc-btn sc-btn--ghost sc-btn--sm"
                style={{ padding: "8px 16px" }}
              >
                Not you?
              </button>
            </form>
          </div>
        </div>

        <div style={{ display: "grid", gap: 34, paddingBottom: 80 }}>
          {groups.map((group) => (
            <div key={group.title}>
              <SectionHeading title={group.title} count={group.items.length} />
              {group.items.length === 0 ? (
                <div className="sc-empty">{group.empty}</div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {group.items.map((trip) => (
                    <TripRow key={trip.id} trip={trip} needed={needed} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
