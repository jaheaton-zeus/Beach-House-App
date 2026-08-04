"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { UserRow, PriorityPeriodRow, GalleryPhotoRow } from "@/lib/db";
import type { LocalRecRow } from "@/app/(app)/info/page";
import type { AdminReservationRow } from "@/app/(app)/admin/page";
import { Icons } from "@/lib/icons";
import { IconBtn, TopBar, FONT_SANS } from "@/components/ui";
import { ReservationsAdmin } from "./ReservationsAdmin";
import { AroundAdmin } from "./AroundAdmin";
import { UsersAdmin } from "./UsersAdmin";
import { PriorityAdmin } from "./PriorityAdmin";
import { PhotosAdmin } from "./PhotosAdmin";

type AdminTab = "reservations" | "around" | "users" | "priority" | "photos";

export function AdminView({
  theme,
  currentUser,
  reservations,
  localRecs,
  users,
  priorityPeriods,
  photos,
}: {
  theme: ThemeColors;
  currentUser: UserRow;
  reservations: AdminReservationRow[];
  localRecs: LocalRecRow[];
  users: UserRow[];
  priorityPeriods: PriorityPeriodRow[];
  photos: GalleryPhotoRow[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<AdminTab>("reservations");

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "reservations", label: "Reservations" },
    { id: "around", label: "Around the House" },
    { id: "users", label: "Users" },
    { id: "priority", label: "Priority" },
    { id: "photos", label: "Photos" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg, position: "relative" }}>
      <TopBar
        title="Admin"
        theme={theme}
        left={
          <IconBtn theme={theme} onClick={() => router.push("/home")}>
            {Icons.back(theme.text)}
          </IconBtn>
        }
      />

      <div style={{ margin: "8px 20px 0", display: "flex", background: theme.surfaceAlt, borderRadius: 10, padding: 3, overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "7px 8px",
              borderRadius: 8,
              background: tab === t.id ? theme.surface : "transparent",
              color: tab === t.id ? theme.text : theme.textMuted,
              boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              transition: "all 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "reservations" && <ReservationsAdmin theme={theme} currentUser={currentUser} reservations={reservations} />}
      {tab === "around" && <AroundAdmin theme={theme} items={localRecs} />}
      {tab === "users" && <UsersAdmin theme={theme} currentUser={currentUser} users={users} />}
      {tab === "priority" && <PriorityAdmin theme={theme} periods={priorityPeriods} />}
      {tab === "photos" && <PhotosAdmin theme={theme} photos={photos} />}
    </div>
  );
}
