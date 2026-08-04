import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { LoginForm } from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const existing = await getCurrentUser();
  if (existing) {
    redirect("/home");
  }

  const db = await getDB();
  const { results } = await db
    .prepare("SELECT name, email, password, family FROM users ORDER BY id LIMIT 3")
    .all<{ name: string; email: string; password: string; family: string }>();

  const heroPhoto = await db
    .prepare("SELECT file_path FROM gallery_photos ORDER BY sort_order LIMIT 1")
    .first<{ file_path: string }>();

  return <LoginForm theme={THEMES.shore} demoUsers={results} heroPhotoPath={heroPhoto?.file_path ?? null} />;
}
