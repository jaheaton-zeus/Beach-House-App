import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { UserRow, PriorityPeriodRow, GalleryPhotoRow } from "@/lib/db";
import type { LocalRecRow } from "@/app/(app)/info/page";
import { THEMES } from "@/lib/theme";
import { AdminView } from "@/components/admin/AdminView";

export const dynamic = "force-dynamic";

export interface AdminReservationRow {
  id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  guests_json: string;
  status: "pending" | "approved" | "denied";
  notes: string | null;
  user_name: string;
  avatar: string;
  family: "Pierce" | "Thomas";
  approve_count: number;
  deny_count: number;
  my_vote: "approve" | "deny" | null;
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/home");

  const db = await getDB();

  const [reservationsRes, recsRes, usersRes, periodsRes, photosRes] = await Promise.all([
    db
      .prepare(
        `SELECT r.id, r.user_id, r.check_in, r.check_out, r.guest_count, r.guests_json, r.status, r.notes,
                u.name as user_name, u.avatar, u.family,
                (SELECT COUNT(*) FROM reservation_votes v WHERE v.reservation_id = r.id AND v.vote = 'approve') as approve_count,
                (SELECT COUNT(*) FROM reservation_votes v WHERE v.reservation_id = r.id AND v.vote = 'deny') as deny_count,
                (SELECT vote FROM reservation_votes v WHERE v.reservation_id = r.id AND v.user_id = ?) as my_vote
         FROM reservations r JOIN users u ON u.id = r.user_id
         ORDER BY r.check_in DESC`
      )
      .bind(user.id)
      .all<AdminReservationRow>(),
    db.prepare(`SELECT * FROM local_recs ORDER BY sort_order`).all<LocalRecRow>(),
    db.prepare(`SELECT * FROM users ORDER BY family, name`).all<UserRow>(),
    db.prepare(`SELECT * FROM priority_periods ORDER BY start_date`).all<PriorityPeriodRow>(),
    db.prepare(`SELECT * FROM gallery_photos ORDER BY sort_order`).all<GalleryPhotoRow>(),
  ]);

  return (
    <AdminView
      theme={THEMES.shore}
      currentUser={user}
      reservations={reservationsRes.results}
      localRecs={recsRes.results}
      users={usersRes.results}
      priorityPeriods={periodsRes.results}
      photos={photosRes.results}
    />
  );
}
