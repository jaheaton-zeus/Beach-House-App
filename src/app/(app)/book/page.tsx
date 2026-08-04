import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { HouseInfoRow } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { BookForm } from "@/components/BookForm";

export const dynamic = "force-dynamic";

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { start, end } = await searchParams;

  const db = await getDB();
  const houseInfo = await db.prepare(`SELECT * FROM house_info WHERE id = 1`).first<HouseInfoRow>();
  const maxGuests = houseInfo?.max_guests ?? 6;

  return (
    <BookForm
      theme={THEMES.shore}
      currentUserName={user.name}
      currentUserFamily={user.family}
      maxGuests={maxGuests}
      initialCheckIn={start || ""}
      initialCheckOut={end || ""}
    />
  );
}
