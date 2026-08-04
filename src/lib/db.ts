import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDB() {
  const { env } = await getCloudflareContext({ async: true });
  return env.DB;
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
  avatar: string;
  family: "Pierce" | "Thomas";
  created_at: string;
}

export interface ReservationRow {
  id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guests_json: string;
  guest_count: number;
  status: "pending" | "approved" | "denied";
  notes: string | null;
  created_at: string;
}

export interface PriorityPeriodRow {
  id: number;
  family: "Pierce" | "Thomas";
  start_date: string;
  end_date: string;
  label: string | null;
}

export interface HouseInfoRow {
  id: number;
  house_name: string;
  location: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  unit: string | null;
  gate_code: string | null;
  wifi_name: string | null;
  wifi_password: string | null;
  parking: string | null;
  address: string | null;
  amenities_json: string;
}

export interface GalleryPhotoRow {
  id: number;
  category: string;
  file_path: string;
  caption: string | null;
  sort_order: number;
}

export interface SupplyRow {
  id: number;
  name: string;
  category: string;
  status: "good" | "low" | "out";
  count_label: string | null;
  essential: number;
  updated_by: number | null;
  updated_at: string;
}
