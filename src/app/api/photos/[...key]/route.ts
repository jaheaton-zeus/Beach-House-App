import { getPhotoBucket } from "@/lib/db";

/**
 * Serves a gallery image out of R2. Keys are timestamped when uploaded, so a
 * replaced photo gets a new URL and these can be cached hard.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> }
): Promise<Response> {
  const { key } = await params;
  const objectKey = key.map(decodeURIComponent).join("/");

  const bucket = await getPhotoBucket();
  const object = await bucket.get(objectKey);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", object.httpMetadata?.contentType ?? "application/octet-stream");
  headers.set("Cache-Control", "public, max-age=31536000, immutable");
  headers.set("ETag", object.httpEtag);

  return new Response(object.body as ReadableStream, { headers });
}
