"use server";

import { revalidatePath } from "next/cache";

import { setCodeCookie } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { notifyReservationRequested } from "@/lib/email";
import { isValidDateString, rangesOverlap } from "@/lib/format";
import { getBlockingReservations, getUserByCode } from "@/lib/queries";

export type BookingResult = { ok: boolean; message: string } | null;

/**
 * The one path that creates a reservation. The home page's booking card and
 * the calendar's selection bar both submit here, so the rules — valid code,
 * sane dates, no double-booking — live in exactly one place.
 *
 * Validation is server-side on purpose: the prototype's client-side checks
 * only illustrated the intent.
 */
export async function requestBooking(
  _prev: BookingResult,
  formData: FormData
): Promise<BookingResult> {
  const code = String(formData.get("code") ?? "").trim();
  const checkIn = String(formData.get("checkIn") ?? "").trim();
  const checkOut = String(formData.get("checkOut") ?? "").trim();
  const guests = Number(formData.get("guests") ?? 1);

  if (!code) {
    return { ok: false, message: "Enter your reservation code to continue." };
  }

  const user = await getUserByCode(code);
  if (!user) {
    return {
      ok: false,
      message: "That reservation code wasn’t recognized. Check with the house admins.",
    };
  }

  if (!isValidDateString(checkIn) || !isValidDateString(checkOut)) {
    return { ok: false, message: "Pick your check-in and check-out dates." };
  }

  if (checkOut <= checkIn) {
    return { ok: false, message: "Check-out has to be after check-in." };
  }

  const blocking = await getBlockingReservations();
  const conflict = blocking.find((r) =>
    rangesOverlap(checkIn, checkOut, r.check_in, r.check_out)
  );
  if (conflict) {
    const label = conflict.status === "approved" ? "booked" : "pending";
    return {
      ok: false,
      message: `Those dates are already ${label} for the ${conflict.family} family. Try different dates.`,
    };
  }

  const guestCount = Math.min(6, Math.max(1, Number.isFinite(guests) ? guests : 1));

  const db = await getDb();
  await db
    .prepare(
      `INSERT INTO reservations
         (user_id, guest_name, family, code, check_in, check_out, guest_count, status)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'pending')`
    )
    .bind(user.id, user.name, user.family, user.code, checkIn, checkOut, guestCount)
    .run();

  // Booking is also how someone identifies themselves — this is what makes
  // My Trips show their stays without a login.
  await setCodeCookie(user.code);

  await notifyReservationRequested({
    guestName: user.name,
    family: user.family,
    checkIn,
    checkOut,
    guestCount,
  });

  revalidatePath("/calendar");
  revalidatePath("/mytrips");
  revalidatePath("/admin");

  return {
    ok: true,
    message: `Thanks ${user.name.split(" ")[0]} — your request was sent to the house admins for approval. Track it under My Trips.`,
  };
}
