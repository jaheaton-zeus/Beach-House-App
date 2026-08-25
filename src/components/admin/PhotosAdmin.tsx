"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { addPhotoSlot, removePhotoSlot, renamePhotoSlot } from "@/app/admin-actions";
import type { GalleryPhotoRow } from "@/lib/db";
import { PlusIcon } from "@/lib/icons";
import { photoUrl } from "@/lib/photo-url";
import { InlineMessage } from "@/components/ui";

/**
 * One gallery tile: the image area picks a file, and the caption underneath
 * doubles as the rename control.
 *
 * The upload posts to the Route Handler rather than a Server Action — real
 * photos are far bigger than the 1MB Server Action body cap.
 */
function PhotoTile({ slot }: { slot: GalleryPhotoRow }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [renaming, setRenaming] = useState(false);

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("slotKey", slot.slot_key);
      body.set("file", file);
      const res = await fetch("/api/photos/upload", { method: "POST", body });
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        setError(payload?.error ?? "That upload didn’t go through.");
        return;
      }
      router.refresh();
    } catch {
      setError("That upload didn’t go through.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      style={{
        position: "relative",
        gridColumn: `span ${slot.col_span}`,
        gridRow: `span ${slot.row_span}`,
      }}
    >
      <button
        type="button"
        className={slot.r2_key ? "sc-slot sc-admin-slot" : "sc-slot sc-slot--empty sc-admin-slot"}
        style={{
          width: "100%",
          height: "100%",
          backgroundImage: slot.r2_key ? `url('${photoUrl(slot.r2_key)}')` : undefined,
        }}
        onClick={() => input.current?.click()}
        disabled={busy}
        title={slot.r2_key ? "Replace this photo" : "Upload a photo"}
      >
        {busy ? (
          <span className="sc-slot__placeholder">Uploading…</span>
        ) : slot.r2_key ? null : (
          <span className="sc-slot__placeholder">Click to upload</span>
        )}
      </button>

      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.target.value = "";
        }}
      />

      {renaming ? (
        <form
          action={renamePhotoSlot}
          className="sc-slot__rename"
          onSubmit={() => setRenaming(false)}
        >
          <input type="hidden" name="id" value={slot.id} />
          <input
            name="label"
            type="text"
            defaultValue={slot.label}
            autoFocus
            required
            maxLength={60}
            aria-label="Photo description"
            onKeyDown={(e) => {
              if (e.key === "Escape") setRenaming(false);
            }}
          />
          <button type="submit" title="Save description" aria-label="Save description">
            ✓
          </button>
        </form>
      ) : (
        <button
          type="button"
          className="sc-slot__caption sc-slot__caption--edit"
          onClick={() => setRenaming(true)}
          title="Rename this photo"
        >
          {slot.label}
          <span aria-hidden>✎</span>
        </button>
      )}

      <form action={removePhotoSlot} style={{ position: "absolute", top: 8, right: 8, zIndex: 5 }}>
        <input type="hidden" name="id" value={slot.id} />
        <button
          type="submit"
          className="sc-tile-remove"
          title={`Remove ${slot.label}`}
          aria-label={`Remove ${slot.label}`}
        >
          ×
        </button>
      </form>

      {error ? (
        <div style={{ position: "absolute", left: 8, right: 8, bottom: 40, zIndex: 6 }}>
          <InlineMessage kind="err">{error}</InlineMessage>
        </div>
      ) : null}
    </div>
  );
}

/** The dashed "add" tile, which asks for the description up front. */
function AddTile() {
  const [adding, setAdding] = useState(false);

  if (!adding) {
    return (
      <button
        type="button"
        className="sc-addtile"
        style={{ gridColumn: "span 2", gridRow: "span 1" }}
        onClick={() => setAdding(true)}
      >
        <PlusIcon size={22} strokeWidth={2} />
        Add photo
      </button>
    );
  }

  return (
    <form
      action={addPhotoSlot}
      className="sc-addtile sc-addtile--form"
      style={{ gridColumn: "span 2", gridRow: "span 1" }}
      onSubmit={() => setAdding(false)}
    >
      <label className="sc-addtile__label" htmlFor="new-photo-label">
        Description
      </label>
      <input
        id="new-photo-label"
        name="label"
        type="text"
        placeholder="e.g. Sunset from the dock"
        autoFocus
        required
        maxLength={60}
        onKeyDown={(e) => {
          if (e.key === "Escape") setAdding(false);
        }}
      />
      <div className="sc-addtile__actions">
        <button type="submit" className="sc-btn sc-btn--sm">
          Add
        </button>
        <button
          type="button"
          className="sc-btn sc-btn--ghost sc-btn--sm"
          onClick={() => setAdding(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export function PhotosAdmin({ slots }: { slots: GalleryPhotoRow[] }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Photos</div>
        <a href="/house/photos" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontWeight: 600 }}>
          View gallery page ↗
        </a>
      </div>
      <p style={{ fontSize: 14, color: "var(--text-2)", margin: "0 0 20px", maxWidth: 560, lineHeight: 1.55 }}>
        This is the same gallery shown on the Photos page. Click a tile to set its image, click its
        description to rename it, add tiles for more photos, or remove one — changes appear on the
        public Photos page.
      </p>

      <div className="sc-gallery sc-gallery--admin">
        {slots.map((slot) => (
          <PhotoTile key={slot.id} slot={slot} />
        ))}
        <AddTile />
      </div>
    </div>
  );
}
