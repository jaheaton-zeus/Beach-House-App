import { SiteHeader } from "@/components/SiteHeader";
import { PageHeader } from "@/components/ui";
import { photoUrl } from "@/lib/photo-url";
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

        <div className="sc-gallery">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className={slot.r2_key ? "sc-slot" : "sc-slot sc-slot--empty"}
              style={{
                gridColumn: `span ${slot.col_span}`,
                gridRow: `span ${slot.row_span}`,
                backgroundImage: slot.r2_key ? `url('${photoUrl(slot.r2_key)}')` : undefined,
              }}
            >
              {slot.r2_key ? (
                <span className="sc-slot__caption">{slot.label}</span>
              ) : (
                <span className="sc-slot__placeholder">{slot.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
