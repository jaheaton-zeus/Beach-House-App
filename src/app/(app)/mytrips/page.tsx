import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { MyTripsView } from "@/components/MyTripsView";

export const dynamic = "force-dynamic";

export interface MyTripRow {
  id: number;
  check_in: string;
  check_out: string;
  guests_json: string;
  guest_count: number;
  status: "pending" | "approved" | "denied";
  notes: string | null;
  approve_count: number;
}

export default async function MyTripsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDB();
  const { results } = await db
    .prepare(
      `SELECT r.id, r.check_in, r.check_out, r.guests_json, r.guest_count, r.status, r.notes,
              (SELECT COUNT(*) FROM reservation_votes v WHERE v.reservation_id = r.id AND v.vote = 'approve') as approve_count
       FROM reservations r
       WHERE r.user_id = ?
       ORDER BY r.check_in ASC`
    )
    .bind(user.id)
    .all<MyTripRow>();

  return <MyTripsView theme={THEMES.shore} reservations={results} />;
}
