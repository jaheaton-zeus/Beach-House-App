import { revalidatePath } from "next/cache";

import { isSuperUser, getCurrentUser } from "@/lib/auth";
import { getDb, getPhotoBucket } from "@/lib/db";
import { favoriteKeyFor } from "@/lib/photo-url";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic"];

/**
 * Same reasoning as /api/photos/upload: this lives in a Route Handler, not a
 * Server Action, because real photos blow past the 1MB Server Action body cap.
 */
export async function POST(request: Request): Promise<Response> {
  const user = await getCurrentUser();
  if (!isSuperUser(user)) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const favoriteId = Number(form.get("favoriteId"));
  const file = form.get("file");

  if (!Number.isFinite(favoriteId) || !(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Pick a photo to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "That photo is larger than 15MB." }, { status: 413 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return Response.json({ error: "That file isn’t an image." }, { status: 415 });
  }

  const db = await getDb();
  const favorite = await db
    .prepare("SELECT id, r2_key FROM local_favorites WHERE id = ?1")
    .bind(favoriteId)
    .first<{ id: number; r2_key: string | null }>();
  if (!favorite) {
    return Response.json({ error: "Unknown favorite." }, { status: 404 });
  }

  const bucket = await getPhotoBucket();
  const key = favoriteKeyFor(favoriteId, file.name);
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });

  await db.prepare("UPDATE local_favorites SET r2_key = ?1 WHERE id = ?2").bind(key, favorite.id).run();

  // The photo this favorite used to hold is now unreachable — don't leave it behind.
  if (favorite.r2_key && favorite.r2_key !== key) {
    await bucket.delete(favorite.r2_key);
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return Response.json({ ok: true, key });
}
