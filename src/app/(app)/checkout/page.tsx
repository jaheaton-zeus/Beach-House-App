import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { SupplyRow } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { CheckoutView } from "@/components/CheckoutView";

export const dynamic = "force-dynamic";

export interface ChecklistItemRow {
  id: number;
  text: string;
  sort_order: number;
}

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDB();
  const [itemsRes, lowRes] = await Promise.all([
    db.prepare(`SELECT * FROM checkout_checklist_items ORDER BY sort_order`).all<ChecklistItemRow>(),
    db.prepare(`SELECT * FROM supplies WHERE status != 'good' ORDER BY category, name`).all<SupplyRow>(),
  ]);

  return <CheckoutView theme={THEMES.shore} items={itemsRes.results} lowItems={lowRes.results} />;
}
