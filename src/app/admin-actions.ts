"use server";

import { getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { getCloudflareContext } from "@opennextjs/cloudflare";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") return null;
  return user;
}

// ── Reservations: voting ────────────────────────────────────
export async function castReservationVote(reservationId: number, vote: "approve" | "deny"): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { error: "Not signed in." };

  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO reservation_votes (reservation_id, user_id, vote, voted_at)
       VALUES (?, ?, ?, datetime('now'))
       ON CONFLICT(reservation_id, user_id) DO UPDATE SET vote = excluded.vote, voted_at = excluded.voted_at`
    )
    .bind(reservationId, user.id, vote)
    .run();

  const counts = await db
    .prepare(
      `SELECT
         SUM(CASE WHEN vote = 'approve' THEN 1 ELSE 0 END) as approves,
         SUM(CASE WHEN vote = 'deny' THEN 1 ELSE 0 END) as denies
       FROM reservation_votes WHERE reservation_id = ?`
    )
    .bind(reservationId)
    .first<{ approves: number; denies: number }>();

  if (counts) {
    let status: "pending" | "approved" | "denied" | null = null;
    if (counts.approves >= 2) status = "approved";
    if (counts.denies >= 2) status = "denied";
    if (status) {
      await db.prepare(`UPDATE reservations SET status = ? WHERE id = ?`).bind(status, reservationId).run();
    }
  }

  return {};
}

// ── Around the House (local_recs) ───────────────────────────
export interface LocalRecInput {
  category: string;
  name: string;
  note: string;
  tag: string;
  walk: string;
}

export async function addLocalRec(input: LocalRecInput): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };
  if (!input.name.trim()) return { error: "Name is required." };

  const db = await getDB();
  const maxOrder = await db.prepare(`SELECT COALESCE(MAX(sort_order), -1) as m FROM local_recs`).first<{ m: number }>();
  await db
    .prepare(`INSERT INTO local_recs (category, name, note, tag, walk, sort_order) VALUES (?, ?, ?, ?, ?, ?)`)
    .bind(input.category, input.name, input.note || null, input.tag || null, input.walk || null, (maxOrder?.m ?? -1) + 1)
    .run();

  return {};
}

export async function removeLocalRec(id: number): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };

  const db = await getDB();
  await db.prepare(`DELETE FROM local_recs WHERE id = ?`).bind(id).run();
  return {};
}

// ── Users ────────────────────────────────────────────────────
export interface AddUserInput {
  name: string;
  email: string;
  family: "Pierce" | "Thomas";
  role: "admin" | "member";
}

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export async function addUser(input: AddUserInput): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };
  if (!input.name.trim() || !input.email.trim()) return { error: "Name and email are required." };

  const db = await getDB();
  try {
    await db
      .prepare(`INSERT INTO users (name, email, password, role, avatar, family) VALUES (?, ?, ?, ?, ?, ?)`)
      .bind(input.name.trim(), input.email.trim(), "welcome123", input.role, initialsOf(input.name), input.family)
      .run();
  } catch {
    return { error: "That email is already in use." };
  }

  return {};
}

export async function toggleUserRole(id: number): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };

  const db = await getDB();
  const target = await db.prepare(`SELECT role FROM users WHERE id = ?`).bind(id).first<{ role: string }>();
  if (!target) return { error: "User not found." };
  const newRole = target.role === "admin" ? "member" : "admin";
  await db.prepare(`UPDATE users SET role = ? WHERE id = ?`).bind(newRole, id).run();
  return {};
}

export async function removeUser(id: number): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };
  if (admin.id === id) return { error: "Can't remove yourself." };

  const db = await getDB();
  await db.prepare(`DELETE FROM users WHERE id = ?`).bind(id).run();
  return {};
}

// ── Priority periods ─────────────────────────────────────────
export async function setPriorityFamily(periodId: number, family: "Pierce" | "Thomas"): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };

  const db = await getDB();
  await db
    .prepare(`UPDATE priority_periods SET family = ?, label = ? WHERE id = ?`)
    .bind(family, `${family} Family`, periodId)
    .run();
  return {};
}

// ── Photos (R2 + gallery_photos) ────────────────────────────
// Photo upload now goes through /api/photos/upload (a Route Handler) instead
// of a Server Action — Server Actions cap request bodies at 1MB by default,
// which real photos routinely exceed, and the documented workaround for
// raising that limit is unreliable in production. Route Handlers don't have
// this restriction.
export async function deletePhoto(id: number): Promise<{ error?: string }> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Admins only." };

  const db = await getDB();
  const row = await db.prepare(`SELECT file_path FROM gallery_photos WHERE id = ?`).bind(id).first<{ file_path: string }>();
  await db.prepare(`DELETE FROM gallery_photos WHERE id = ?`).bind(id).run();

  if (row) {
    const { env } = await getCloudflareContext({ async: true });
    try {
      await env.PHOTOS.delete(row.file_path);
    } catch {
      // best-effort cleanup; the D1 row is already gone either way
    }
  }

  return {};
}
