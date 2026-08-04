"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { GalleryPhotoRow } from "@/lib/db";
import { uploadPhoto, deletePhoto } from "@/app/admin-actions";
import { photoUrl } from "@/lib/photo-url";
import { Icons } from "@/lib/icons";
import { Btn, Card, Input, Screen } from "@/components/ui";

const CATS = ["Views", "Living", "Kitchen", "Bedrooms", "Bathrooms", "Parking & Access"];

export function PhotosAdmin({ theme, photos }: { theme: ThemeColors; photos: GalleryPhotoRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [category, setCategory] = useState(CATS[0]);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 1400);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const resetForm = () => {
    setCategory(CATS[0]);
    setCaption("");
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submit = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose an image first.");
      return;
    }
    if (!caption.trim()) {
      setError("Add a caption.");
      return;
    }
    setError("");

    const formData = new FormData();
    formData.set("file", file);
    formData.set("category", category);
    formData.set("caption", caption.trim());

    startTransition(async () => {
      const result = await uploadPhoto(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      resetForm();
      setShowForm(false);
      flash("Photo added");
      router.refresh();
    });
  };

  const remove = (id: number) => {
    startTransition(async () => {
      await deletePhoto(id);
      flash("Photo removed");
      router.refresh();
    });
  };

  return (
    <Screen>
      <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 10 }}>
        {toast && (
          <div style={{ position: "absolute", top: 70, left: "50%", transform: "translateX(-50%)", background: theme.text, color: "#fff", padding: "10px 18px", borderRadius: 99, fontSize: 13, fontWeight: 500, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
            {toast}
          </div>
        )}

        <Btn
          onClick={() => {
            setShowForm((s) => !s);
            setError("");
          }}
          theme={theme}
          variant={showForm ? "secondary" : "primary"}
          full
        >
          {showForm ? "Cancel" : "+ Add a photo"}
        </Btn>

        {showForm && (
          <Card theme={theme} style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 99,
                    background: category === c ? theme.text : theme.surfaceAlt,
                    color: category === c ? "#fff" : theme.text,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted }}>Photo</label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileChange} style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: theme.text }} />
            </div>

            <Input label="Caption" value={caption} onChange={setCaption} placeholder="What this photo shows" theme={theme} />

            {previewUrl && (
              <div style={{ borderRadius: 10, overflow: "hidden", height: 160, background: theme.surfaceAlt }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            )}

            {error && <div style={{ fontSize: 13, color: theme.accentDeep }}>{error}</div>}

            <Btn onClick={submit} theme={theme} variant="primary" full disabled={isPending}>
              {isPending ? "Uploading…" : "Save photo"}
            </Btn>
          </Card>
        )}

        {CATS.map((c) => {
          const catPhotos = photos.filter((p) => p.category === c);
          if (catPhotos.length === 0) return null;
          return (
            <div key={c}>
              <div style={{ fontSize: 13, fontWeight: 600, color: theme.text, margin: "8px 4px 6px" }}>
                {c} <span style={{ color: theme.textSubtle, fontWeight: 400 }}>· {catPhotos.length}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
                {catPhotos.map((p) => (
                  <div key={p.id} style={{ position: "relative", borderRadius: 12, overflow: "hidden", background: theme.surfaceAlt, aspectRatio: "4/3" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl(p.file_path)} alt={p.caption ?? ""} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: "16px 8px 6px",
                        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                    >
                      {p.caption}
                    </div>
                    <button
                      onClick={() => remove(p.id)}
                      disabled={isPending}
                      style={{ position: "absolute", top: 6, right: 6, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {Icons.close("#fff")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {photos.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: theme.textMuted, fontSize: 14 }}>
            No photos yet — add the first one above.
          </div>
        )}
      </div>
    </Screen>
  );
}
