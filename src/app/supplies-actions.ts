"use server";

import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { todayISO } from "@/lib/format";

export async function updateSupplyStatus(id: number, status: "good" | "low" | "out"): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };

  const countLabel = status === "out" ? "0" : status === "low" ? "Running low" : "Restocked";

  const db = await getDB();
  await db
    .prepare(`UPDATE supplies SET status = ?, count_label = ?, updated_by = ?, updated_at = ? WHERE id = ?`)
    .bind(status, countLabel, user.id, todayISO(), id)
    .run();

  return {};
}
