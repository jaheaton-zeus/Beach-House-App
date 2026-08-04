import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { PriorityPeriodRow } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { CalendarView } from "@/components/CalendarView";

export const dynamic = "force-dynamic";

export interface CalendarReservation {
  id: number;
  user_id: number;
  check_in: string;
  check_out: string;
  guest_count: number;
  status: "pending" | "approved" | "denied";
  user_name: string;
  avatar: string;
  family: "Pierce" | "Thomas";
}

export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDB();

  const [reservationsRes, periodsRes] = await Promise.all([
    db
      .prepare(
        `SELECT r.id, r.user_id, r.check_in, r.check_out, r.guest_count, r.status,
                u.name as user_name, u.avatar, u.family
         FROM reservations r JOIN users u ON u.id = r.user_id
         WHERE r.status != 'denied'
         ORDER BY r.check_in ASC`
      )
      .all<CalendarReservation>(),
    db.prepare(`SELECT * FROM priority_periods ORDER BY start_date ASC`).all<PriorityPeriodRow>(),
  ]);

  return (
    <CalendarView
      theme={THEMES.shore}
      reservations={reservationsRes.results}
      priorityPeriods={periodsRes.results}
    />
  );
}
