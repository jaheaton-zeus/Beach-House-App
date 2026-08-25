"use client";

import { useState } from "react";

import type { PlaceRow } from "@/lib/db";
import { PinIcon } from "@/lib/icons";

const ORIGIN = encodeURIComponent("Unit 7557, Shelter Cove, Hilton Head Island, SC");

function directionsUrl(destination: string | null): string | null {
  if (!destination) return null;
  return `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN}&destination=${encodeURIComponent(destination)}`;
}

export function PlaceCard({ place }: { place: PlaceRow }) {
  const url = directionsUrl(place.destination);
  return (
    <div className="sc-card" style={{ padding: "22px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>{place.name}</div>
        {place.tag ? <div className="sc-tag">{place.tag}</div> : null}
      </div>
      {place.description ? (
        <div style={{ fontSize: 14, lineHeight: 1.55, color: "rgba(255,255,255,0.62)" }}>
          {place.description}
        </div>
      ) : null}
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginTop: 14,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <PinIcon />
          Directions{place.drive ? ` · ${place.drive}` : ""}
        </a>
      ) : null}
    </div>
  );
}

/** Flat list — Beaches and Bike & Trails, which are single-category pages. */
export function PlaceList({ places }: { places: PlaceRow[] }) {
  return (
    <div style={{ display: "grid", gap: 14, paddingBottom: 70 }}>
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}

/** Around the House — filter chips over categories, grouped headings. */
export function PlacesView({ places, categories }: { places: PlaceRow[]; categories: string[] }) {
  const [filter, setFilter] = useState("All");
  const shown = filter === "All" ? categories.filter((c) => c !== "All") : [filter];

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingBottom: 30 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={cat === filter ? "sc-chip sc-chip--on" : "sc-chip"}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 34, paddingBottom: 70 }}>
        {shown.map((cat) => {
          const items = places.filter((p) => p.category === cat);
          return (
            <div key={cat}>
              <div className="sc-section-head">
                <span className="sc-section-head__diamond" />
                <span className="sc-section-head__title">{cat}</span>
                <span className="sc-section-head__count">· {items.length}</span>
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                {items.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
