import { SiteHeader } from "@/components/SiteHeader";
import { HeroBackdrop, PageHeader, RichText } from "@/components/ui";
import { SwitchIcon } from "@/lib/icons";
import { getLightsInfo } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function LightsPage() {
  const cards = await getLightsInfo();

  return (
    <div className="sc-page sc-page--tall">
      <HeroBackdrop image="/tiles/lights.jpg" />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="HOUSE INFO"
          title="Lights"
          lead="The house runs on Leviton Decora Smart Wi-Fi switches and dimmers. Control them at the wall like normal, or from your phone with the My Leviton app."
        />
        <div className="sc-lights">
          {cards.map((card) => (
            <div
              key={card.id}
              className="sc-card"
              style={{
                padding: 24,
                borderRadius: 16,
                gridColumn: card.full_width ? "1 / -1" : undefined,
              }}
            >
              {card.icon ? (
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div className="sc-lights__icon">
                    <SwitchIcon />
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{card.title}</div>
                </div>
              ) : (
                <div style={{ fontSize: 15.5, fontWeight: 700, marginBottom: 8 }}>{card.title}</div>
              )}
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.65)",
                  margin: 0,
                }}
              >
                <RichText text={card.body} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
