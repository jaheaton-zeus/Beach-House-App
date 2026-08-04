import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admins only." }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const category = String(formData.get("category") || "").trim();
  const caption = String(formData.get("caption") || "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose an image first." }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: "Pick a category." }, { status: 400 });
  }
  if (!caption) {
    return NextResponse.json({ error: "Add a caption." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "That file isn't an image." }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Image is too large (10MB max)." }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const key = `gallery/${crypto.randomUUID()}.${ext}`;

  await env.PHOTOS.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type },
  });

  const db = await getDB();
  const maxOrder = await db.prepare(`SELECT COALESCE(MAX(sort_order), -1) as m FROM gallery_photos`).first<{ m: number }>();
  await db
    .prepare(`INSERT INTO gallery_photos (category, file_path, caption, sort_order) VALUES (?, ?, ?, ?)`)
    .bind(category, key, caption, (maxOrder?.m ?? -1) + 1)
    .run();

  return NextResponse.json({ success: true });
}
