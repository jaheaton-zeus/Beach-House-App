import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { todayISO } from "@/lib/format";
import { SiteHeader, type NextStay } from "@/components/SiteHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const theme = THEMES.shore;
  const db = await getDB();
  const nextStay = await db
    .prepare(
      `SELECT check_in, check_out, status FROM reservations
       WHERE user_id = ? AND check_in >= ? AND status != 'denied'
       ORDER BY check_in ASC LIMIT 1`
    )
    .bind(user.id, todayISO())
    .first<NextStay>();

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", flexDirection: "column" }}>
      <SiteHeader currentUser={user} theme={theme} nextStay={nextStay} />
      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 24px" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
