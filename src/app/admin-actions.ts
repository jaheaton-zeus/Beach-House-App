"use server";

import { revalidatePath } from "next/cache";

import { requireSuperUser } from "@/lib/auth";
import { getDb, getPhotoBucket, type Family, type PlaceCategory, type ReservationStatus } from "@/lib/db";
import { notifyReservationDecision } from "@/lib/email";
import { getUserByCode } from "@/lib/queries";

export type AdminResult = { ok: boolean; message: string } | null;

/**
 * Every export in this file re-checks that the caller is a super user.
 * Server Actions are reachable by direct POST, so the code modal on /admin is
 * not a gate on its own — this is.
 */

function refresh() {
  revalidatePath("/admin");
}

/**
 * Re-derive a reservation's status from the votes that currently count.
 *
 * Only a super user from the First Pick family (rank 1 in family_priority)
 * decides: their approval approves the stay outright, their denial declines
 * it. Votes from the other family are recorded but never decide anything.
 * Votes from people who are no longer super users don't count, so demoting
 * someone (or swapping First Pick) reopens what their vote decided.
 */
async function resolveStatus(reservationId: number): Promise<void> {
  const db = await getDb();

  const reservation = await db
    .prepare(
      `SELECT status, user_id, code, guest_name, check_in, check_out, guest_count
         FROM reservations WHERE id = ?1`
    )
    .bind(reservationId)
    .first<{
      status: ReservationStatus;
      user_id: number | null;
      code: string;
      guest_name: string;
      check_in: string;
      check_out: string;
      guest_count: number;
    }>();
  if (!reservation) return;

  const tally = await db
    .prepare(
      `SELECT
         sum(CASE WHEN v.vote = 'approve' THEN 1 ELSE 0 END) AS approvals,
         sum(CASE WHEN v.vote = 'deny' THEN 1 ELSE 0 END) AS denials
       FROM reservation_votes v
       JOIN users u ON u.id = v.user_id AND u.super_user = 1
       JOIN family_priority fp ON fp.family = u.family AND fp.rank = 1
      WHERE v.reservation_id = ?1`
    )
    .bind(reservationId)
    .first<{ approvals: number | null; denials: number | null }>();

  const approvals = tally?.approvals ?? 0;
  const denials = tally?.denials ?? 0;

  const status: ReservationStatus =
    approvals > 0 ? "approved" : denials > 0 ? "denied" : "pending";

  if (status === reservation.status) return;

  await db
    .prepare("UPDATE reservations SET status = ?1 WHERE id = ?2")
    .bind(status, reservationId)
    .run();

  if (status === "approved" || status === "denied") {
    const email = reservation.user_id
      ? (
          await db
            .prepare("SELECT email FROM users WHERE id = ?1")
            .bind(reservation.user_id)
            .first<{ email: string }>()
        )?.email
      : (await getUserByCode(reservation.code))?.email;

    let reason: string | undefined;
    if (status === "denied") {
      const deciding = await db
        .prepare(
          `SELECT v.comment FROM reservation_votes v
             JOIN users u ON u.id = v.user_id AND u.super_user = 1
             JOIN family_priority fp ON fp.family = u.family AND fp.rank = 1
            WHERE v.reservation_id = ?1 AND v.vote = 'deny'
            ORDER BY v.voted_at DESC LIMIT 1`
        )
        .bind(reservationId)
        .first<{ comment: string | null }>();
      reason = deciding?.comment?.trim() || undefined;
    }

    if (email) {
      await notifyReservationDecision({
        email,
        guestName: reservation.guest_name,
        checkIn: reservation.check_in,
        checkOut: reservation.check_out,
        guestCount: reservation.guest_count,
        status,
        reason,
      });
    }
  }
}

export async function castVote(formData: FormData): Promise<void> {
  const voter = await requireSuperUser();
  const reservationId = Number(formData.get("reservationId"));
  const vote = String(formData.get("vote"));
  if (!Number.isFinite(reservationId) || (vote !== "approve" && vote !== "deny")) return;

  // A denial has to say why; the reason goes to the requestor in the email.
  const comment = String(formData.get("comment") ?? "").trim().slice(0, 1000);

  const db = await getDb();
  const existing = await db
    .prepare("SELECT vote FROM reservation_votes WHERE reservation_id = ?1 AND user_id = ?2")
    .bind(reservationId, voter.id)
    .first<{ vote: string }>();

  if (existing?.vote === vote && !comment) {
    // Clicking your own vote again takes it back.
    await db
      .prepare("DELETE FROM reservation_votes WHERE reservation_id = ?1 AND user_id = ?2")
      .bind(reservationId, voter.id)
      .run();
  } else {
    if (vote === "deny" && !comment) return;
    await db
      .prepare(
        `INSERT INTO reservation_votes (reservation_id, user_id, vote, comment)
         VALUES (?1, ?2, ?3, ?4)
         ON CONFLICT (reservation_id, user_id) DO UPDATE
           SET vote = excluded.vote, comment = excluded.comment, voted_at = datetime('now')`
      )
      .bind(reservationId, voter.id, vote, vote === "deny" ? comment : null)
      .run();
  }

  await resolveStatus(reservationId);
  refresh();
  revalidatePath("/mytrips");
  revalidatePath("/calendar");
}

export async function addPlace(formData: FormData): Promise<void> {
  await requireSuperUser();
  const category = String(formData.get("category") ?? "") as PlaceCategory;
  const name = String(formData.get("name") ?? "").trim();
  if (!name || !category) return;

  const db = await getDb();
  const last = await db
    .prepare("SELECT max(sort_order) AS n FROM places WHERE category = ?1")
    .bind(category)
    .first<{ n: number | null }>();

  await db
    .prepare(
      `INSERT INTO places (category, name, tag, drive, destination, description, sort_order)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    )
    .bind(
      category,
      name,
      String(formData.get("tag") ?? "").trim() || null,
      String(formData.get("drive") ?? "").trim() || null,
      String(formData.get("destination") ?? "").trim() || null,
      String(formData.get("description") ?? "").trim() || null,
      (last?.n ?? 0) + 1
    )
    .run();

  refresh();
  revalidatePath("/around");
  revalidatePath("/beaches");
  revalidatePath("/bike-trails");
}

export async function removePlace(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const db = await getDb();
  await db.prepare("DELETE FROM places WHERE id = ?1").bind(id).run();

  refresh();
  revalidatePath("/around");
  revalidatePath("/beaches");
  revalidatePath("/bike-trails");
}

export async function saveFavorite(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const rating = String(formData.get("rating") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!name || !subtitle || !rating || !url) return;

  const db = await getDb();
  if (Number.isFinite(id) && id > 0) {
    await db
      .prepare(
        `UPDATE local_favorites SET name = ?1, subtitle = ?2, rating = ?3, url = ?4 WHERE id = ?5`
      )
      .bind(name, subtitle, rating, url, id)
      .run();
  } else {
    const last = await db
      .prepare("SELECT max(sort_order) AS n FROM local_favorites")
      .first<{ n: number | null }>();

    await db
      .prepare(
        `INSERT INTO local_favorites (name, subtitle, rating, url, image_path, sort_order)
         VALUES (?1, ?2, ?3, ?4, '', ?5)`
      )
      .bind(name, subtitle, rating, url, (last?.n ?? 0) + 1)
      .run();
  }

  refresh();
  revalidatePath("/");
}

export async function removeFavorite(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const db = await getDb();
  const favorite = await db
    .prepare("SELECT r2_key FROM local_favorites WHERE id = ?1")
    .bind(id)
    .first<{ r2_key: string | null }>();

  await db.prepare("DELETE FROM local_favorites WHERE id = ?1").bind(id).run();

  if (favorite?.r2_key) {
    const bucket = await getPhotoBucket();
    await bucket.delete(favorite.r2_key);
  }

  refresh();
  revalidatePath("/");
}

export async function moveFavorite(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  const direction = String(formData.get("direction"));
  if (!Number.isFinite(id) || (direction !== "up" && direction !== "down")) return;

  const db = await getDb();
  const { results } = await db
    .prepare("SELECT id, sort_order FROM local_favorites ORDER BY sort_order")
    .all<{ id: number; sort_order: number }>();

  const index = results.findIndex((row) => row.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= results.length) return;

  const current = results[index];
  const neighbor = results[swapIndex];

  await db
    .prepare("UPDATE local_favorites SET sort_order = ?1 WHERE id = ?2")
    .bind(neighbor.sort_order, current.id)
    .run();
  await db
    .prepare("UPDATE local_favorites SET sort_order = ?1 WHERE id = ?2")
    .bind(current.sort_order, neighbor.id)
    .run();

  refresh();
  revalidatePath("/");
}

export async function saveUser(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const family = String(formData.get("family") ?? "Pierce") as Family;
  const superUser = formData.get("superUser") === "on" ? 1 : 0;

  if (!name || !email || !code) return;

  const db = await getDb();
  if (Number.isFinite(id) && id > 0) {
    await db
      .prepare(
        `UPDATE users SET name = ?1, email = ?2, code = ?3, family = ?4, super_user = ?5
          WHERE id = ?6`
      )
      .bind(name, email, code, family, superUser, id)
      .run();
  } else {
    await db
      .prepare(
        `INSERT INTO users (name, email, code, family, super_user) VALUES (?1, ?2, ?3, ?4, ?5)`
      )
      .bind(name, email, code, family, superUser)
      .run();
  }

  // Changing who can vote can change what the votes add up to.
  const { results } = await db
    .prepare("SELECT id FROM reservations WHERE status IN ('pending','approved','denied')")
    .all<{ id: number }>();
  for (const row of results) {
    await resolveStatus(row.id);
  }

  refresh();
  revalidatePath("/mytrips");
}

export async function removeUser(formData: FormData): Promise<void> {
  const actor = await requireSuperUser();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id) || id === actor.id) return;

  const db = await getDb();
  await db.prepare("DELETE FROM users WHERE id = ?1").bind(id).run();

  const { results } = await db.prepare("SELECT id FROM reservations").all<{ id: number }>();
  for (const row of results) {
    await resolveStatus(row.id);
  }

  refresh();
}

export async function swapPriority(): Promise<void> {
  await requireSuperUser();
  const db = await getDb();
  await db.prepare("UPDATE family_priority SET rank = CASE rank WHEN 1 THEN 2 ELSE 1 END").run();

  // Who is First Pick decides every reservation, so re-derive them all.
  const { results } = await db.prepare("SELECT id FROM reservations").all<{ id: number }>();
  for (const row of results) {
    await resolveStatus(row.id);
  }

  refresh();
  revalidatePath("/mytrips");
  revalidatePath("/calendar");
}

export async function addPhotoSlot(formData: FormData): Promise<void> {
  await requireSuperUser();
  const label = String(formData.get("label") ?? "").trim() || "Untitled photo";

  const db = await getDb();
  const last = await db
    .prepare("SELECT max(sort_order) AS n FROM gallery_photos")
    .first<{ n: number | null }>();

  await db
    .prepare(
      `INSERT INTO gallery_photos (slot_key, label, col_span, row_span, sort_order)
       VALUES (?1, ?2, 2, 1, ?3)`
    )
    .bind(`house-photo-${Date.now()}`, label, (last?.n ?? 0) + 1)
    .run();

  refresh();
  revalidatePath("/house/photos");
}

export async function renamePhotoSlot(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  const label = String(formData.get("label") ?? "").trim();
  if (!Number.isFinite(id) || !label) return;

  const db = await getDb();
  await db.prepare("UPDATE gallery_photos SET label = ?1 WHERE id = ?2").bind(label, id).run();

  refresh();
  revalidatePath("/house/photos");
}

export async function removePhotoSlot(formData: FormData): Promise<void> {
  await requireSuperUser();
  const id = Number(formData.get("id"));
  if (!Number.isFinite(id)) return;

  const db = await getDb();
  const slot = await db
    .prepare("SELECT r2_key FROM gallery_photos WHERE id = ?1")
    .bind(id)
    .first<{ r2_key: string | null }>();

  await db.prepare("DELETE FROM gallery_photos WHERE id = ?1").bind(id).run();

  // Removing the tile removes its photo — nothing else can reach it.
  if (slot?.r2_key) {
    const bucket = await getPhotoBucket();
    await bucket.delete(slot.r2_key);
  }

  refresh();
  revalidatePath("/house/photos");
}
