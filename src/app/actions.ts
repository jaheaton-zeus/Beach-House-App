"use server";

import { redirect } from "next/navigation";
import { verifyLogin, setSessionCookie, clearSessionCookie, getCurrentUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { todayISO } from "@/lib/format";

export interface LoginState {
  error: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return { error: "Email or password didn't match." };
  }

  await setSessionCookie(user.id);
  redirect("/home");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}

export interface CreateReservationInput {
  checkIn: string;
  checkOut: string;
  guests: string[];
  notes: string;
}

export async function createReservation(input: CreateReservationInput): Promise<{ error?: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "You're not signed in." };
  }
  if (!input.checkIn || !input.checkOut || input.guests.length === 0) {
    return { error: "Missing required fields." };
  }

  const db = await getDB();
  await db
    .prepare(
      `INSERT INTO reservations (user_id, check_in, check_out, guests_json, guest_count, status, notes, created_at)
       VALUES (?, ?, ?, ?, ?, 'pending', ?, ?)`
    )
    .bind(
      user.id,
      input.checkIn,
      input.checkOut,
      JSON.stringify(input.guests),
      input.guests.length,
      input.notes || null,
      todayISO()
    )
    .run();

  return {};
}
