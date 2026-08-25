"use client";

import { useCallback, useEffect, useState } from "react";

import type { GalleryPhotoRow } from "@/lib/db";
import { ChevronLeft, ChevronRight, CloseIcon } from "@/lib/icons";
import { photoUrl } from "@/lib/photo-url";

export function PhotoGallery({ slots }: { slots: GalleryPhotoRow[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const hasMultiple = slots.filter((slot) => slot.r2_key).length > 1;

  const step = useCallback(
    (from: number, dir: 1 | -1) => {
      const n = slots.length;
      for (let i = 1; i <= n; i++) {
        const idx = (from + dir * i + n) % n;
        if (slots[idx].r2_key) return idx;
      }
      return from;
    },
    [slots]
  );

  const close = useCallback(() => setOpenIndex(null), []);

  const prev = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : step(current, -1)));
  }, [step]);

  const next = useCallback(() => {
    setOpenIndex((current) => (current === null ? current : step(current, 1)));
  }, [step]);

  useEffect(() => {
    if (openIndex === null) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close, prev, next]);

  const openSlot = openIndex !== null ? slots[openIndex] : null;

  return (
    <>
      <div className="sc-gallery">
        {slots.map((slot, i) =>
          slot.r2_key ? (
            <button
              key={slot.id}
              type="button"
              className="sc-slot"
              style={{
                gridColumn: `span ${slot.col_span}`,
                gridRow: `span ${slot.row_span}`,
                backgroundImage: `url('${photoUrl(slot.r2_key)}')`,
              }}
              onClick={() => setOpenIndex(i)}
            >
              <span className="sc-slot__caption">{slot.label}</span>
            </button>
          ) : (
            <div
              key={slot.id}
              className="sc-slot sc-slot--empty"
              style={{
                gridColumn: `span ${slot.col_span}`,
                gridRow: `span ${slot.row_span}`,
              }}
            >
              <span className="sc-slot__placeholder">{slot.label}</span>
            </div>
          )
        )}
      </div>

      {openSlot && openSlot.r2_key ? (
        <div className="sc-lightbox-backdrop" onClick={close}>
          <div
            className="sc-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={openSlot.label}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={photoUrl(openSlot.r2_key)} alt={openSlot.label} className="sc-lightbox__img" />
            {openSlot.label ? <div className="sc-lightbox__caption">{openSlot.label}</div> : null}
          </div>

          <button
            className="sc-iconbtn sc-lightbox__close"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          >
            <CloseIcon />
          </button>

          {hasMultiple ? (
            <>
              <button
                className="sc-iconbtn sc-lightbox__nav sc-lightbox__nav--prev"
                aria-label="Previous photo"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronLeft />
              </button>
              <button
                className="sc-iconbtn sc-lightbox__nav sc-lightbox__nav--next"
                aria-label="Next photo"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
              >
                <ChevronRight />
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
