"use client";

import { useRef } from "react";

import type { LocalFavoriteRow } from "@/lib/db";
import { ChevronLeft, ChevronRight, StarIcon } from "@/lib/icons";

/**
 * The Local Favorites row. The arrows scroll the strip — on a wide screen all
 * four cards fit and there is nothing to scroll, but on a narrow one they are
 * the way through the list.
 */
export function FavoritesRow({ favorites }: { favorites: LocalFavoriteRow[] }) {
  const strip = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const el = strip.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(220, el.clientWidth * 0.6), behavior: "smooth" });
  };

  return (
    <div className="sc-fav-row">
      <button
        type="button"
        className="sc-iconbtn"
        aria-label="Previous favorites"
        onClick={() => scrollBy(-1)}
      >
        <ChevronLeft />
      </button>

      <div className="sc-fav-cards sc-scroll-x" ref={strip}>
        {favorites.map((fav) => (
          <a
            key={fav.id}
            href={fav.url}
            target="_blank"
            rel="noopener noreferrer"
            className="sc-fav-card sc-hover-lift"
            style={{ backgroundImage: `url('${fav.image_path}')` }}
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

      <button
        type="button"
        className="sc-iconbtn sc-iconbtn--sage"
        aria-label="Next favorites"
        onClick={() => scrollBy(1)}
      >
        <ChevronRight />
      </button>
    </div>
  );
}
