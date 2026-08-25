import { SiteHeader } from "@/components/SiteHeader";
import { PageHeader } from "@/components/ui";
import { ExternalLinkIcon } from "@/lib/icons";

const MAP_URL =
  "https://hiltonhead.maps.arcgis.com/apps/instant/interactivelegend/index.html?appid=8f2036039c5e471c96cbdd3664af9052";

export default function PathwaysPage() {
  return (
    <div className="sc-page sc-page--tall">
      <div className="sc-content sc-content--wide">
        <SiteHeader />
        <PageHeader
          kicker="ISLAND TRAIL MAP"
          title="Public Pathways"
          lead="Hilton Head has 60+ miles of public bike paths. Tap a layer in the legend to see routes, then pinch to zoom around Shelter Cove."
          wideLead
        />

        <div
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(12,19,22,0.6)",
            boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
          }}
        >
          <iframe
            src={MAP_URL}
            title="Hilton Head Island Public Pathways"
            style={{ display: "block", width: "100%", height: 640, border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div style={{ display: "flex", justifyContent: "center", padding: "22px 0 60px" }}>
          <a
            href={MAP_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 14, fontWeight: 600 }}
          >
            Open full map
            <ExternalLinkIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
