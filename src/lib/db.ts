import { getCloudflareContext } from "@opennextjs/cloudflare";

/** The D1 binding, from the Worker env. Server-side only. */
export async function getDb(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

/** The R2 gallery bucket. Server-side only. */
export async function getPhotoBucket(): Promise<R2Bucket> {
  const { env } = await getCloudflareContext({ async: true });
  return env.PHOTOS;
}

export type Family = "Pierce" | "Thomas";
export type ReservationStatus = "pending" | "approved" | "denied";
export type PlaceCategory = "Dining" | "Beach" | "Bike & Trails" | "Activities" | "Groceries";

export type UserRow = {
  id: number;
  name: string;
  email: string;
  family: Family;
  code: string;
  super_user: number;
  site_admin: number;
  created_at: string;
};

export type ReservationRow = {
  id: number;
  user_id: number | null;
  guest_name: string;
  family: Family;
  code: string;
  check_in: string;
  check_out: string;
  guest_count: number;
  status: ReservationStatus;
  created_at: string;
};

/** A reservation joined with its vote tallies, as the UI needs it. */
export type ReservationWithVotes = ReservationRow & {
  approvals: number;
  denials: number;
  my_vote: "approve" | "deny" | null;
};

export type PlaceRow = {
  id: number;
  category: PlaceCategory;
  name: string;
  tag: string | null;
  drive: string | null;
  destination: string | null;
  description: string | null;
  sort_order: number;
};

export type LocalFavoriteRow = {
  id: number;
  name: string;
  subtitle: string;
  rating: string;
  url: string;
  image_path: string;
  sort_order: number;
};

export type HouseRuleRow = { id: number; text: string; sort_order: number };

export type AccessDetailRow = {
  id: number;
  label: string;
  value: string;
  note: string | null;
  /** "detail" renders a label/value row; "wifi_qr" renders the join code. */
  kind: "detail" | "wifi_qr";
  sort_order: number;
};

export type LightsInfoRow = {
  id: number;
  title: string;
  body: string;
  icon: string | null;
  full_width: number;
  sort_order: number;
};

export type GalleryPhotoRow = {
  id: number;
  slot_key: string;
  label: string;
  col_span: number;
  row_span: number;
  r2_key: string | null;
  sort_order: number;
};

export type HouseInfoRow = {
  id: number;
  house_name: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
};

export type FamilyPriorityRow = { family: Family; rank: number };
