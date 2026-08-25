import { PlacesView } from "@/components/PlacesView";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroBackdrop, PageHeader } from "@/components/ui";
import { getPlaces } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";
// Beaches and Bike & Trails have their own pages, so they are not offered here.
const CATEGORIES = ["All", "Dining", "Activities", "Groceries"];

export default async function AroundPage() {
  const all = await getPlaces();
  const places = all.filter((p) => CATEGORIES.includes(p.category));

  return (
    <div className="sc-page sc-page--tall">
      <HeroBackdrop image="/tiles/activities.jpg" />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="RECOMMENDATIONS"
          title="Around the House"
          lead="Family favorites within walking or a short drive of Shelter Cove."
        />
        <PlacesView places={places} categories={CATEGORIES} />
      </div>
    </div>
  );
}
