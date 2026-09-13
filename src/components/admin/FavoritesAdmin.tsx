"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { moveFavorite, removeFavorite, saveFavorite } from "@/app/admin-actions";
import type { LocalFavoriteRow } from "@/lib/db";
import { ChevronDown } from "@/lib/icons";
import { photoUrl } from "@/lib/photo-url";
import { InlineMessage } from "@/components/ui";

type FormState = { favorite: LocalFavoriteRow | null } | null;

/**
 * The photo tile for one favorite. Upload posts to a Route Handler rather
 * than the saveFavorite Server Action — same reason as the Photos gallery:
 * real photos are far bigger than the 1MB Server Action body cap.
 */
function FavoriteThumb({ favorite }: { favorite: LocalFavoriteRow }) {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const image = favorite.r2_key ? photoUrl(favorite.r2_key) : favorite.image_path || null;

  const upload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("favoriteId", String(favorite.id));
      body.set("file", file);
      const res = await fetch("/api/favorites/upload", { method: "POST", body });
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
    <div style={{ position: "relative", flex: "0 0 84px" }}>
      <button
        type="button"
        className={image ? "sc-slot sc-admin-slot" : "sc-slot sc-slot--empty sc-admin-slot"}
        style={{
          width: 84,
          height: 84,
          backgroundImage: image ? `url('${image}')` : undefined,
        }}
        onClick={() => input.current?.click()}
        disabled={busy}
        title={image ? "Replace this photo" : "Upload a photo"}
      >
        {busy ? (
          <span className="sc-slot__placeholder">Uploading…</span>
        ) : image ? null : (
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

      {error ? (
        <div style={{ position: "absolute", left: 0, top: "100%", marginTop: 6, width: 200, zIndex: 6 }}>
          <InlineMessage kind="err">{error}</InlineMessage>
        </div>
      ) : null}
    </div>
  );
}

export function FavoritesAdmin({ favorites }: { favorites: LocalFavoriteRow[] }) {
  const [form, setForm] = useState<FormState>(null);
  const editing = form?.favorite ?? null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
          marginBottom: 6,
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Local Favorites</div>
        <button
          type="button"
          className="sc-btn sc-btn--sm"
          style={{ padding: "10px 18px", fontSize: 13.5 }}
          onClick={() => setForm({ favorite: null })}
        >
          + Add favorite
        </button>
      </div>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", margin: "0 0 18px" }}>
        These show on the home page. Add as many as you like — visitors page through them four at a
        time.
      </p>

      {form ? (
        <form
          action={saveFavorite}
          className="sc-admin-form"
          key={editing?.id ?? "new"}
          onSubmit={() => setForm(null)}
        >
          <input type="hidden" name="id" value={editing?.id ?? 0} />
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>
            {editing ? "Edit favorite" : "Add favorite"}
          </div>
          <div className="sc-admin-form__grid">
            <div>
              <div className="sc-field-label">Name</div>
              <input
                name="name"
                type="text"
                className="sc-input"
                placeholder="e.g. The French Bakery"
                defaultValue={editing?.name ?? ""}
                required
              />
            </div>
            <div>
              <div className="sc-field-label">Subtitle</div>
              <input
                name="subtitle"
                type="text"
                className="sc-input"
                placeholder="e.g. Shelter Cove · Café"
                defaultValue={editing?.subtitle ?? ""}
                required
              />
            </div>
            <div>
              <div className="sc-field-label">Rating</div>
              <input
                name="rating"
                type="text"
                className="sc-input"
                placeholder="e.g. 4.7"
                defaultValue={editing?.rating ?? ""}
                required
              />
            </div>
            <div>
              <div className="sc-field-label">Website</div>
              <input
                name="url"
                type="url"
                className="sc-input"
                placeholder="https://…"
                defaultValue={editing?.url ?? ""}
                required
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
              onClick={() => setForm(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div style={{ display: "grid", gap: 10 }}>
        {favorites.map((favorite, i) => (
          <div
            key={favorite.id}
            className="sc-admin-row"
            style={{ alignItems: "center", padding: "14px 18px", gap: 16 }}
          >
            <FavoriteThumb favorite={favorite} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 700 }}>{favorite.name}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>
                {favorite.subtitle} · {favorite.rating}★
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <form action={moveFavorite}>
                <input type="hidden" name="id" value={favorite.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  className="sc-iconbtn sc-iconbtn--sm"
                  aria-label={`Move ${favorite.name} up`}
                  disabled={i === 0}
                >
                  <span style={{ display: "inline-flex", transform: "rotate(180deg)" }}>
                    <ChevronDown />
                  </span>
                </button>
              </form>
              <form action={moveFavorite}>
                <input type="hidden" name="id" value={favorite.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  className="sc-iconbtn sc-iconbtn--sm"
                  aria-label={`Move ${favorite.name} down`}
                  disabled={i === favorites.length - 1}
                >
                  <ChevronDown />
                </button>
              </form>
              <button
                type="button"
                className="sc-btn sc-btn--ghost sc-btn--sm"
                style={{ padding: "8px 14px", fontSize: 12.5 }}
                onClick={() => setForm({ favorite })}
              >
                Edit
              </button>
              <form action={removeFavorite}>
                <input type="hidden" name="id" value={favorite.id} />
                <button
                  type="submit"
                  className="sc-removebtn"
                  title={`Remove ${favorite.name}`}
                  aria-label={`Remove ${favorite.name}`}
                >
                  ×
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
