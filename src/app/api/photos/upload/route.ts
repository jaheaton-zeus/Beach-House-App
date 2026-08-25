import { revalidatePath } from "next/cache";

import { isSuperUser, getCurrentUser } from "@/lib/auth";
import { getDb, getPhotoBucket } from "@/lib/db";
import { photoKeyFor } from "@/lib/photo-url";

const MAX_BYTES = 15 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic"];

/**
 * Photo upload deliberately lives in a Route Handler, not a Server Action:
 * Server Actions cap request bodies at 1MB by default and real photos blow
 * straight past that. An earlier version of this app tried the Server Action
 * route and had to revert it.
 */
export async function POST(request: Request): Promise<Response> {
  const user = await getCurrentUser();
  if (!isSuperUser(user)) {
    return Response.json({ error: "Not authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const slotKey = String(form.get("slotKey") ?? "").trim();
  const file = form.get("file");

  if (!slotKey || !(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Pick a photo to upload." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "That photo is larger than 15MB." }, { status: 413 });
  }
  if (file.type && !ALLOWED.includes(file.type)) {
    return Response.json({ error: "That file isn’t an image." }, { status: 415 });
  }

  const db = await getDb();
  const slot = await db
    .prepare("SELECT id, r2_key FROM gallery_photos WHERE slot_key = ?1")
    .bind(slotKey)
    .first<{ id: number; r2_key: string | null }>();
  if (!slot) {
    return Response.json({ error: "Unknown gallery tile." }, { status: 404 });
  }

  const bucket = await getPhotoBucket();
  const key = photoKeyFor(slotKey, file.name);
  await bucket.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type || "image/jpeg" },
  });

  await db.prepare("UPDATE gallery_photos SET r2_key = ?1 WHERE id = ?2").bind(key, slot.id).run();

  // The photo this tile used to hold is now unreachable — don't leave it behind.
  if (slot.r2_key && slot.r2_key !== key) {
    await bucket.delete(slot.r2_key);
  }

  revalidatePath("/house/photos");
  revalidatePath("/admin");

  return Response.json({ ok: true, key });
}
