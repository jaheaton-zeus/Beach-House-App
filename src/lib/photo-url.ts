/**
 * Gallery images live in R2 and are served through our own route handler,
 * so a key like `gallery/house-photo-1-1724531200.jpg` becomes
 * `/api/photos/gallery/house-photo-1-1724531200.jpg`.
 */
export function photoUrl(key: string): string {
  return `/api/photos/${key.split("/").map(encodeURIComponent).join("/")}`;
}

/** Build the R2 key for a tile's upload. Timestamped so replacing busts caches. */
export function photoKeyFor(slotKey: string, filename: string): string {
  const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "jpg";
  const safeExt = /^[a-z0-9]{1,5}$/.test(ext) ? ext : "jpg";
  return `gallery/${slotKey}-${Date.now()}.${safeExt}`;
}

/** Build the R2 key for a Local Favorite's uploaded photo. */
export function favoriteKeyFor(id: number, filename: string): string {
  const ext = filename.includes(".") ? filename.split(".").pop()!.toLowerCase() : "jpg";
  const safeExt = /^[a-z0-9]{1,5}$/.test(ext) ? ext : "jpg";
  return `favorites/${id}-${Date.now()}.${safeExt}`;
}
