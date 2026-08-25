import "server-only";

import {
  getDb,
  type AccessDetailRow,
  type FamilyPriorityRow,
  type GalleryPhotoRow,
  type HouseInfoRow,
  type HouseRuleRow,
  type LightsInfoRow,
  type LocalFavoriteRow,
  type PlaceCategory,
  type PlaceRow,
  type ReservationRow,
  type ReservationWithVotes,
  type UserRow,
} from "./db";

export async function getUsers(): Promise<UserRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM users ORDER BY super_user DESC, name")
    .all<UserRow>();
  return results;
}

export async function getUserByCode(code: string): Promise<UserRow | null> {
  const trimmed = code.trim();
  if (!trimmed) return null;
  const db = await getDb();
  return db
    .prepare("SELECT * FROM users WHERE lower(code) = lower(?1)")
    .bind(trimmed)
    .first<UserRow>();
}

/** Ids of everyone who can currently vote. Drives the majority threshold. */
export async function getSuperUserIds(): Promise<number[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT id FROM users WHERE super_user = 1")
    .all<{ id: number }>();
  return results.map((row: { id: number }) => row.id);
}

/** Majority of the current super users: 1 of 1, 2 of 2-3, 3 of 4-5. */
export function majorityNeeded(superCount: number): number {
  return Math.floor(superCount / 2) + 1;
}

/**
 * Every reservation with its vote tallies. Only votes from people who are
 * still super users count, so demoting someone re-opens what they decided.
 */
export async function getReservationsWithVotes(viewerId?: number): Promise<ReservationWithVotes[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT r.*,
              (SELECT count(*) FROM reservation_votes v JOIN users u ON u.id = v.user_id
                WHERE v.reservation_id = r.id AND v.vote = 'approve' AND u.super_user = 1) AS approvals,
              (SELECT count(*) FROM reservation_votes v JOIN users u ON u.id = v.user_id
                WHERE v.reservation_id = r.id AND v.vote = 'deny' AND u.super_user = 1) AS denials,
              (SELECT v.vote FROM reservation_votes v
                WHERE v.reservation_id = r.id AND v.user_id = ?1) AS my_vote
         FROM reservations r
        ORDER BY r.check_in`
    )
    .bind(viewerId ?? -1)
    .all<ReservationWithVotes>();
  return results;
}

export async function getReservationsByCode(code: string): Promise<ReservationWithVotes[]> {
  const all = await getReservationsWithVotes();
  return all.filter((r) => r.code.toLowerCase() === code.trim().toLowerCase());
}

/** Stays that block a date: pending requests hold the dates too. */
export async function getBlockingReservations(): Promise<ReservationRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT * FROM reservations
        WHERE status IN ('pending', 'approved')
        ORDER BY check_in`
    )
    .all<ReservationRow>();
  return results;
}

export async function getPlaces(category?: PlaceCategory): Promise<PlaceRow[]> {
  const db = await getDb();
  if (category) {
    const { results } = await db
      .prepare("SELECT * FROM places WHERE category = ?1 ORDER BY sort_order, name")
      .bind(category)
      .all<PlaceRow>();
    return results;
  }
  const { results } = await db
    .prepare("SELECT * FROM places ORDER BY category, sort_order, name")
    .all<PlaceRow>();
  return results;
}

export async function getLocalFavorites(): Promise<LocalFavoriteRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM local_favorites ORDER BY sort_order")
    .all<LocalFavoriteRow>();
  return results;
}

export async function getHouseRules(): Promise<HouseRuleRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM house_rules ORDER BY sort_order")
    .all<HouseRuleRow>();
  return results;
}

export async function getAccessDetails(): Promise<AccessDetailRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM access_details ORDER BY sort_order")
    .all<AccessDetailRow>();
  return results;
}

export async function getLightsInfo(): Promise<LightsInfoRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM lights_info ORDER BY sort_order")
    .all<LightsInfoRow>();
  return results;
}

export async function getGalleryPhotos(): Promise<GalleryPhotoRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM gallery_photos ORDER BY sort_order, id")
    .all<GalleryPhotoRow>();
  return results;
}

export async function getHouseInfo(): Promise<HouseInfoRow | null> {
  const db = await getDb();
  return db.prepare("SELECT * FROM house_info WHERE id = 1").first<HouseInfoRow>();
}

export async function getFamilyPriority(): Promise<FamilyPriorityRow[]> {
  const db = await getDb();
  const { results } = await db
    .prepare("SELECT * FROM family_priority ORDER BY rank")
    .all<FamilyPriorityRow>();
  return results;
}
