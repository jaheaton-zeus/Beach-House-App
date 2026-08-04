import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { GalleryPhotoRow } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { GalleryView } from "@/components/GalleryView";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDB();
  const { results } = await db.prepare(`SELECT * FROM gallery_photos ORDER BY sort_order`).all<GalleryPhotoRow>();

  return <GalleryView theme={THEMES.shore} photos={results} />;
}
