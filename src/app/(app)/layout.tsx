import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { THEMES } from "@/lib/theme";
import { SiteHeader } from "@/components/SiteHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const theme = THEMES.shore;

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, display: "flex", flexDirection: "column" }}>
      <SiteHeader currentUser={user} theme={theme} />
      <div style={{ display: "flex", flex: 1, width: "100%" }}>
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ maxWidth: 1250, margin: "0 auto", padding: "0 24px" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
