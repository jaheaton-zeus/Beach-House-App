"use client";

import { useState } from "react";

import { addPlace, removePlace } from "@/app/admin-actions";
import type { PlaceRow } from "@/lib/db";

const CATEGORIES = ["Dining", "Beach", "Bike & Trails", "Activities", "Groceries"] as const;

export function PlacesAdmin({ places }: { places: PlaceRow[] }) {
  const [adding, setAdding] = useState(false);

  const groups = CATEGORIES.map((cat) => ({
    cat,
    items: places.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div>
      {adding ? (
        <form action={addPlace} className="sc-admin-form" onSubmit={() => setAdding(false)}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>Add a place</div>
          <div className="sc-admin-form__grid">
            <div>
              <div className="sc-field-label">Name</div>
              <input name="name" type="text" className="sc-input" placeholder="Where is it?" required />
            </div>
            <div>
              <div className="sc-field-label">Category</div>
              <select name="category" className="sc-input" defaultValue="Dining">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="sc-field-label">Tag</div>
              <input name="tag" type="text" className="sc-input" placeholder="e.g. MARINA" />
            </div>
            <div>
              <div className="sc-field-label">Travel time</div>
              <input name="drive" type="text" className="sc-input" placeholder="e.g. 5 min walk" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="sc-field-label">Address for directions</div>
              <input
                name="destination"
                type="text"
                className="sc-input"
                placeholder="Name, street, Hilton Head Island, SC"
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <div className="sc-field-label">Description</div>
              <textarea
                name="description"
                className="sc-input"
                rows={2}
                placeholder="Why the family likes it"
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button type="submit" className="sc-btn sc-btn--sm" style={{ padding: "11px 22px" }}>
              Save
            </button>
            <button
              type="button"
              className="sc-btn sc-btn--ghost sc-btn--sm"
              style={{ padding: "11px 20px" }}
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className="sc-btn sc-btn--teal"
          style={{ width: "100%", borderRadius: 14, padding: 16, marginBottom: 26 }}
          onClick={() => setAdding(true)}
        >
          + Add a place
        </button>
      )}

      <div style={{ display: "grid", gap: 30 }}>
        {groups.map((group) => (
          <div key={group.cat}>
            <div className="sc-section-head">
              <span className="sc-section-head__diamond" />
              <span className="sc-section-head__title" style={{ fontSize: 16 }}>
                {group.cat}
              </span>
              <span className="sc-section-head__count">· {group.items.length}</span>
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              {group.items.map((place) => (
                <div
                  key={place.id}
                  className="sc-admin-row"
                  style={{ alignItems: "flex-start", padding: "16px 18px" }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15.5, fontWeight: 700 }}>{place.name}</div>
                    {place.description ? (
                      <div
                        style={{
                          fontSize: 13.5,
                          color: "var(--text-2)",
                          lineHeight: 1.5,
                          marginTop: 3,
                        }}
                      >
                        {place.description}
                      </div>
                    ) : null}
                    {place.drive ? (
                      <div
                        style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 5 }}
                      >
                        {place.drive}
                      </div>
                    ) : null}
                  </div>
                  <form action={removePlace}>
                    <input type="hidden" name="id" value={place.id} />
                    <button
                      type="submit"
                      className="sc-removebtn"
                      title={`Remove ${place.name}`}
                      aria-label={`Remove ${place.name}`}
                    >
                      ×
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
