// All gallery images are served through our own R2-backed route, whether
// they're legacy seed placeholders (which won't resolve until real files
// are uploaded) or freshly admin-uploaded photos.
export function photoUrl(filePath: string) {
  return `/api/photos/${filePath}`;
}
