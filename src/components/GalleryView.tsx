"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { GalleryPhotoRow } from "@/lib/db";
import { photoUrl } from "@/lib/photo-url";
import { Icons } from "@/lib/icons";
import { IconBtn, TopBar, FONT_SANS } from "@/components/ui";

export function GalleryView({ theme, photos }: { theme: ThemeColors; photos: GalleryPhotoRow[] }) {
  const router = useRouter();
  const cats = ["All", ...Array.from(new Set(photos.map((p) => p.category)))];
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shown = filter === "All" ? photos : photos.filter((p) => p.category === filter);

  const move = (dir: number) => setLightbox((i) => (i === null ? null : (i + dir + shown.length) % shown.length));

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, shown.length]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg, position: "relative" }}>
      <TopBar
        title="Gallery"
        subtitle={`${shown.length} photo${shown.length !== 1 ? "s" : ""}`}
        theme={theme}
        left={
          <IconBtn theme={theme} onClick={() => router.push("/info")}>
            {Icons.back(theme.text)}
          </IconBtn>
        }
      />

      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "0 20px 10px" }}>
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            style={{
              padding: "7px 14px",
              borderRadius: 99,
              background: filter === c ? theme.text : theme.surface,
              color: filter === c ? "#fff" : theme.text,
              border: filter === c ? "none" : `0.5px solid ${theme.border}`,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60 }}>
        {shown.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px", color: theme.textMuted, fontSize: 14 }}>
            No photos in this category yet.
          </div>
        ) : (
          <div style={{ padding: "4px 16px 0", columnCount: 2, columnGap: 10 }}>
            {shown.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setLightbox(i)}
                style={{
                  border: "none",
                  padding: 0,
                  background: theme.surfaceAlt,
                  cursor: "pointer",
                  width: "100%",
                  marginBottom: 10,
                  borderRadius: 14,
                  overflow: "hidden",
                  display: "inline-block",
                  position: "relative",
                  breakInside: "avoid",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl(p.file_path)} alt={p.caption ?? ""} loading="lazy" style={{ width: "100%", display: "block" }} />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: "20px 10px 8px",
                    background: "linear-gradient(180deg, rgba(31,27,22,0) 0%, rgba(31,27,22,0.7) 100%)",
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 500,
                    textAlign: "left",
                    lineHeight: 1.3,
                    fontFamily: FONT_SANS,
                  }}
                >
                  {p.caption}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && shown[lightbox] && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 200,
            background: "rgba(15,13,10,0.96)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 2 }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, fontWeight: 500, fontFamily: FONT_SANS }}>
              {lightbox + 1} / {shown.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightbox(null);
              }}
              style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {Icons.close("#fff")}
            </button>
          </div>

          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", padding: "0 12px", textAlign: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl(shown[lightbox].file_path)}
              alt={shown[lightbox].caption ?? ""}
              style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 12, objectFit: "contain" }}
            />
            <div style={{ color: "#fff", fontSize: 14, marginTop: 16, fontFamily: FONT_SANS }}>{shown[lightbox].caption}</div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginTop: 4, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
              {shown[lightbox].category}
            </div>
          </div>

          {shown.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  move(-1);
                }}
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {Icons.back("#fff")}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  move(1);
                }}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%) rotate(180deg)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                {Icons.back("#fff")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
