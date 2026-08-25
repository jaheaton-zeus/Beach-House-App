import { SiteHeader } from "@/components/SiteHeader";
import { HeroBackdrop, PageHeader } from "@/components/ui";
import { getHouseRules } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";

export default async function RulesPage() {
  const rules = await getHouseRules();

  return (
    <div className="sc-page sc-page--tall">
      <HeroBackdrop image="/tiles/house-rules.jpg" />
      <div className="sc-content">
        <SiteHeader />
        <PageHeader
          kicker="HOUSE INFO"
          title="House Rules"
          lead="Keep things smooth so both families can enjoy."
        />
        <div style={{ display: "grid", gap: 14, paddingBottom: 60 }}>
          {rules.map((rule, i) => (
            <div
              key={rule.id}
              className="sc-card"
              style={{ display: "flex", gap: 18, alignItems: "center" }}
            >
              <div className="sc-rule__num">{i + 1}</div>
              <div style={{ fontSize: 16, fontWeight: 600 }}>{rule.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
