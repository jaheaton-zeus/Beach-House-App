import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import type { HouseInfoRow } from "@/lib/db";
import { THEMES } from "@/lib/theme";
import { HouseInfoView } from "@/components/HouseInfoView";

export const dynamic = "force-dynamic";

export interface HouseRuleRow {
  id: number;
  text: string;
  sort_order: number;
}

export interface LocalRecRow {
  id: number;
  category: string;
  name: string;
  note: string | null;
  tag: string | null;
  walk: string | null;
  sort_order: number;
}

export default async function InfoPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const db = await getDB();
  const [houseInfo, rulesRes, recsRes, galleryCount] = await Promise.all([
    db.prepare(`SELECT * FROM house_info WHERE id = 1`).first<HouseInfoRow>(),
    db.prepare(`SELECT * FROM house_rules ORDER BY sort_order`).all<HouseRuleRow>(),
    db.prepare(`SELECT * FROM local_recs ORDER BY sort_order`).all<LocalRecRow>(),
    db.prepare(`SELECT COUNT(*) as count FROM gallery_photos`).first<{ count: number }>(),
  ]);

  if (!houseInfo) {
    return <div style={{ padding: 40 }}>House info hasn&apos;t been set up yet.</div>;
  }

  return (
    <HouseInfoView
      theme={THEMES.shore}
      houseInfo={houseInfo}
      rules={rulesRes.results}
      recs={recsRes.results}
      galleryCount={galleryCount?.count ?? 0}
    />
  );
}
