import { cookies } from "next/headers";
import { getDB, type UserRow } from "./db";

// NOTE: this is a deliberately simple, interim session mechanism — a plain
// (unsigned) cookie holding the user's id. It exists only to make the app
// usable before Cloudflare Access is wired up as the real authentication
// layer. Once Access is in place, this whole module goes away.

const COOKIE_NAME = "sc_user";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function getCurrentUser(): Promise<UserRow | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE_NAME)?.value;
  if (!id) return null;

  const db = await getDB();
  const user = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(id)
    .first<UserRow>();
  return user ?? null;
}

export async function verifyLogin(email: string, password: string): Promise<UserRow | null> {
  const db = await getDB();
  const user = await db
    .prepare("SELECT * FROM users WHERE email = ? AND password = ?")
    .bind(email, password)
    .first<UserRow>();
  return user ?? null;
}

export async function setSessionCookie(userId: number) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, String(userId), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: THIRTY_DAYS,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}
