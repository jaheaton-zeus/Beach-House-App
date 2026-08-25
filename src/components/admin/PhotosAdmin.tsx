"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { addPhotoSlot, removePhotoSlot } from "@/app/admin-actions";
import type { GalleryPhotoRow } from "@/lib/db";
import { PlusIcon } from "@/lib/icons";
import { photoUrl } from "@/lib/photo-url";
import { InlineMessage } from "@/components/ui";

/**
 * One gallery tile. The upload posts to the Route Handler rather than a Server
 * Action — real photos are far bigger than the 1MB Server Action body cap.
 */
function PhotoTile({ slot }: { slot: GalleryPhotoRow }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      >
        <span className={slot.r2_key ? "sc-slot__caption" : "sc-slot__placeholder"}>
          {busy ? "Uploading…" : slot.label}
        </span>
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
        <div style={{ position: "absolute", left: 8, right: 8, bottom: 8, zIndex: 6 }}>
          <InlineMessage kind="err">{error}</InlineMessage>
        </div>
      ) : null}
    </div>
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
        This is the same gallery shown on the Photos page. Click a tile to set its image, add tiles
        for more photos, or remove one — changes appear on the public Photos page.
      </p>

      <div className="sc-gallery sc-gallery--admin">
        {slots.map((slot) => (
          <PhotoTile key={slot.id} slot={slot} />
        ))}

        <form action={addPhotoSlot} style={{ gridColumn: "span 2", gridRow: "span 1" }}>
          <input type="hidden" name="label" value="New photo" />
          <button type="submit" className="sc-addtile">
            <PlusIcon size={22} strokeWidth={2} />
            Add photo
          </button>
        </form>
      </div>
    </div>
  );
}
