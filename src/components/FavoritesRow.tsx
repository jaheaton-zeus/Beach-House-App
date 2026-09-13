"use client";

import { useState } from "react";

import type { LocalFavoriteRow } from "@/lib/db";
import { ChevronLeft, ChevronRight, StarIcon } from "@/lib/icons";
import { photoUrl } from "@/lib/photo-url";

const PAGE_SIZE = 4;

/**
 * The Local Favorites row. Favorites page in groups of four — the arrows
 * only render when there's more than one page, and wrap around at both ends.
 */
export function FavoritesRow({ favorites }: { favorites: LocalFavoriteRow[] }) {
  const [page, setPage] = useState(0);
  // A favorite an admin just added but hasn't uploaded a photo for yet has no
  // image to show — skip it on the public page rather than render a blank card.
  const shown = favorites.filter((fav) => fav.r2_key || fav.image_path);
  const pageCount = Math.ceil(shown.length / PAGE_SIZE);
  const hasMultiplePages = pageCount > 1;
  const visible = shown.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (direction: 1 | -1) => {
    setPage((current) => (current + direction + pageCount) % pageCount);
  };

  return (
    <div className="sc-fav-row">
      {hasMultiplePages ? (
        <button
          type="button"
          className="sc-iconbtn"
          aria-label="Previous favorites"
          onClick={() => go(-1)}
        >
          <ChevronLeft />
        </button>
      ) : null}

      <div className="sc-fav-cards">
        {visible.map((fav) => (
          <a
            key={fav.id}
            href={fav.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-fav-card sc-hover-lift"
            style={{
              backgroundImage: `url('${fav.r2_key ? photoUrl(fav.r2_key) : fav.image_path}')`,
            }}
          >
            <div className="sc-fav-card__scrim" />
            <div className="sc-fav-card__meta">
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{fav.name}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>{fav.subtitle}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                <StarIcon />
                {fav.rating}
              </div>
            </div>
          </a>
        ))}
      </div>

      {hasMultiplePages ? (
        <button
          type="button"
          className="sc-iconbtn sc-iconbtn--sage"
          aria-label="Next favorites"
          onClick={() => go(1)}
        >
          <ChevronRight />
        </button>
      ) : null}
    </div>
  );
}
