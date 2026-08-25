import { PlaceList } from "@/components/PlacesView";
import { SiteHeader } from "@/components/SiteHeader";
import { HeroBackdrop, PageHeader } from "@/components/ui";
import { getPlaces } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function BeachesPage() {
  const places = await getPlaces("Beach");

  return (
    <div className="sc-page sc-page--tall">
      <HeroBackdrop image="/tiles/beaches.jpg" />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="RECOMMENDATIONS"
          title="Beaches"
          lead="Our favorite stretches of sand near the beach house."
        />
        <PlaceList places={places} />
      </div>
    </div>
  );
}
