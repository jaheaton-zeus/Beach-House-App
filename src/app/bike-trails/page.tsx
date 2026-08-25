import { PlaceList } from "@/components/PlacesView";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroBackdrop, PageHeader } from "@/components/ui";
import { getPlaces } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function BikeTrailsPage() {
  const places = await getPlaces("Bike & Trails");

  return (
    <div className="sc-page sc-page--tall">
      <HeroBackdrop image="/tiles/bike-trails.jpg" />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="RECOMMENDATIONS"
          title="Bike & Trails"
          lead="Where to ride and walk around the island."
        />
        <PlaceList places={places} />
      </div>
    </div>
  );
}
