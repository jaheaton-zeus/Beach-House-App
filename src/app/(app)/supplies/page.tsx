import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { SupplyRow } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { SuppliesView } from "@/components/SuppliesView";

export const dynamic = "force-dynamic";

export default async function SuppliesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDB();
  const [suppliesRes, myStay] = await Promise.all([
    db
      .prepare(
        `SELECT s.*, u.name as updated_by_name
         FROM supplies s LEFT JOIN users u ON u.id = s.updated_by
         ORDER BY s.category, s.name`
      )
      .all<SupplyRow & { updated_by_name: string | null }>(),
    db
      .prepare(
        `SELECT check_out FROM reservations
         WHERE user_id = ? AND status = 'approved'
           AND julianday(check_out) - julianday('now') BETWEEN -7 AND 1
         LIMIT 1`
      )
      .bind(user.id)
      .first<{ check_out: string }>(),
  ]);

  return <SuppliesView theme={THEMES.shore} supplies={suppliesRes.results} showCheckoutPrompt={!!myStay} />;
}
