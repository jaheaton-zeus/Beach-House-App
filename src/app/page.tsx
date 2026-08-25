import Link from "next/link";

import { BookingCard } from "@/components/BookingCard";
import { FavoritesRow } from "@/components/FavoritesRow";
import { SiteHeader } from "@/components/SiteHeader";
import { Kicker } from "@/components/ui";
import { ArrowRight, BathIcon, BeachIcon, BedIcon, BikeIcon, RulesIcon, SleepsIcon, WifiIcon } from "@/lib/icons";
import { getHouseInfo, getLocalFavorites } from "@/lib/queries";

// Everything on this page comes out of D1 and is editable from Admin, so it
// renders per request rather than being baked in at deploy time.
export const dynamic = "force-dynamic";
const TILES = [
  { href: "/house/rules", label: ["House", "Rules"], image: "/tiles/house-rules.jpg", Icon: RulesIcon },
  { href: "/house/access", label: ["Wi-Fi", "Access"], image: "/tiles/wifi-access.jpg", Icon: WifiIcon },
  { href: "/bike-trails", label: ["Bike", "Trails"], image: "/tiles/bike-trails.jpg", Icon: BikeIcon },
  { href: "/beaches", label: ["Beaches"], image: "/tiles/beaches.jpg", Icon: BeachIcon },
];

export default async function HomePage() {
  const [favorites, house] = await Promise.all([getLocalFavorites(), getHouseInfo()]);

  const stats = [
    { Icon: BedIcon, value: house?.bedrooms ?? 2, label: "Bedrooms" },
    { Icon: BathIcon, value: house?.bathrooms ?? 2, label: "Bathrooms" },
    { Icon: SleepsIcon, value: house?.max_guests ?? 6, label: "Sleeps" },
  ];

  return (
    <div className="sc-page">
      <section className="sc-hero">
        <div className="sc-hero__media" />
        <div className="sc-hero__scrim-v" />
        <div className="sc-hero__scrim-h" />

        <div className="sc-hero__inner">
          <SiteHeader />

          <div className="sc-hero__grid">
            <div className="sc-hero__copy">
              <Kicker>THE WORLD IS YOURS</Kicker>
              <h1 className="sc-hero__title">
                Welcome to the
                <br />
                P/T Beach
                <br />
                House
              </h1>
              <p className="sc-hero__lead">
                Looking to schedule a break to get away for a while?
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
                <Link href="/around" className="sc-btn" style={{ gap: 11 }}>
                  Explore Hilton Head
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: "rgba(12,19,22,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowRight stroke="#0c1316" />
                  </span>
                </Link>
              </div>
            </div>

            <BookingCard />
          </div>
        </div>
      </section>

      <div className="sc-below-hero">
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 20 }}>
          <h2 className="sc-serif-heading">Local Favorites</h2>
          <Link href="/around" style={{ fontSize: 13, fontWeight: 600, color: "var(--accent)" }}>
            View all
          </Link>
        </div>

        <div className="sc-favorites">
          <FavoritesRow favorites={favorites} />

          <div className="sc-tiles">
            {TILES.map(({ href, label, image, Icon }) => (
              <Link
                key={href}
                href={href}
                className="sc-tile"
                style={{ ["--tile-image" as string]: `url('${image}')` }}
              >
                <div className="sc-tile__icon">
                  <Icon />
                </div>
                <div className="sc-tile__label">
                  {label.map((line, i) => (
                    <span key={line}>
                      {i > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="sc-stats">
          {stats.map(({ Icon, value, label }) => (
            <div key={label} className="sc-stat">
              <Icon />
              <div style={{ textAlign: "left" }}>
                <div className="sc-stat__number">{value}</div>
                <div className="sc-stat__label">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
