import { CalendarView } from "@/components/CalendarView";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHeader } from "@/components/ui";
import { getBlockingReservations } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const reservations = await getBlockingReservations();
  const booked = reservations.map(({ check_in, check_out }) => ({ check_in, check_out }));

  return (
    <div className="sc-page sc-page--tall">
      <div className="sc-hero-backdrop sc-hero-backdrop--top" aria-hidden>
        <div
          className="sc-hero-backdrop__image"
          style={{ backgroundImage: "url('/hero-calendar.jpg')" }}
        />
        <div className="sc-hero-backdrop__scrim" />
      </div>

      <div className="sc-content sc-content--wide">
        <SiteHeader />
        <PageHeader
          kicker="AVAILABILITY"
          title="Booking Calendar"
          lead="Check open dates for the P/T Beach House and pick the days you'd like to stay."
          serif
        />
        <CalendarView booked={booked} />
      </div>
    </div>
  );
}
