import { PhotoGallery } from "@/components/PhotoGallery";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHeader } from "@/components/ui";
import { getGalleryPhotos } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function PhotosPage() {
  const slots = await getGalleryPhotos();

  return (
    <div className="sc-page sc-page--tall">
      <div className="sc-mytrips-glow" aria-hidden />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="HOUSE INFO"
          title="Photos"
          lead="A look around the P/T Beach House."
        />

        <PhotoGallery slots={slots} />
      </div>
    </div>
  );
}
