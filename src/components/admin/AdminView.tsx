"use client";

import { useState } from "react";

import type {
  FamilyPriorityRow,
  GalleryPhotoRow,
  PlaceRow,
  ReservationWithVotes,
  UserRow,
} from "@/lib/db";

import { PhotosAdmin } from "./PhotosAdmin";
import { PlacesAdmin } from "./PlacesAdmin";
import { PriorityAdmin } from "./PriorityAdmin";
import { ReservationsAdmin } from "./ReservationsAdmin";
import { UsersAdmin } from "./UsersAdmin";

const TABS = ["Reservations", "Around the House", "Users", "Priority", "Photos"] as const;
type Tab = (typeof TABS)[number];

export function AdminView({
  reservations,
  users,
  places,
  priority,
  photoSlots,
  needed,
  superCount,
  viewerId,
}: {
  reservations: ReservationWithVotes[];
  users: UserRow[];
  places: PlaceRow[];
  priority: FamilyPriorityRow[];
  photoSlots: GalleryPhotoRow[];
  needed: number;
  superCount: number;
  viewerId: number;
}) {
  const [tab, setTab] = useState<Tab>("Reservations");

  return (
    <>
      <div className="sc-tabs sc-scroll-x">
        {TABS.map((name) => (
          <button
            key={name}
            type="button"
            className={name === tab ? "sc-chip sc-chip--on" : "sc-chip"}
            onClick={() => setTab(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px 0 80px" }}>
        {tab === "Reservations" ? (
          <ReservationsAdmin
            reservations={reservations}
            needed={needed}
            superCount={superCount}
          />
        ) : null}
        {tab === "Around the House" ? <PlacesAdmin places={places} /> : null}
        {tab === "Users" ? <UsersAdmin users={users} viewerId={viewerId} /> : null}
        {tab === "Priority" ? <PriorityAdmin priority={priority} /> : null}
        {tab === "Photos" ? <PhotosAdmin slots={photoSlots} /> : null}
      </div>
    </>
  );
}
