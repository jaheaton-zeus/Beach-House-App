import Image from "next/image";

import { SiteHeader } from "@/components/SiteHeader";
import { HeroBackdrop, PageHeader } from "@/components/ui";
import { getAccessDetails } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const items = await getAccessDetails();

  return (
    <div className="sc-page sc-page--tall">
      <HeroBackdrop image="/tiles/wifi-access.jpg" />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="HOUSE INFO"
          title="Access"
          lead="Codes and details to get you in and connected during your stay."
        />
        <div style={{ display: "grid", gap: 14, paddingBottom: 60 }}>
          {items.map((item) =>
            item.kind === "wifi_qr" ? (
              <div key={item.id} className="sc-card sc-wifi">
                <div className="sc-wifi__body">
                  <div className="sc-summary__label">{item.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{item.value}</div>
                  {item.note ? <p className="sc-wifi__note">{item.note}</p> : null}
                </div>
                <div className="sc-wifi__code">
                  <Image
                    src="/wifi-qr.png"
                    alt={`Wi-Fi join code for the ${item.value} network`}
                    width={148}
                    height={148}
                    priority
                  />
                </div>
              </div>
            ) : (
              <div
                key={item.id}
                className="sc-card"
                style={{
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 24px",
                }}
              >
                <div>
                  <div className="sc-summary__label">{item.label}</div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>{item.value}</div>
                </div>
                {item.note ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(255,255,255,0.55)",
                      maxWidth: 320,
                      textAlign: "right",
                    }}
                  >
                    {item.note}
                  </div>
                ) : null}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
