import "server-only";

import { cookies } from "next/headers";

import type { UserRow } from "./db";
import { getUserByCode } from "./queries";

/**
 * Identity in this app is a reservation code, and nothing else — there is no
 * login page and no password.
 *
 * The cookie stores the code itself rather than a signed session, which is
 * safe here precisely because it is not a bearer token: every request looks
 * the code up in D1 again, so a cookie somebody forges resolves to no user at
 * all. What it must not be is readable or writable from page scripts, hence
 * httpOnly.
 */
const CODE_COOKIE = "sc_code";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

export async function setCodeCookie(code: string): Promise<void> {
  const store = await cookies();
  store.set(CODE_COOKIE, code.trim(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearCodeCookie(): Promise<void> {
  const store = await cookies();
  store.delete(CODE_COOKIE);
}

/** The person whose code is in the cookie, or null. */
export async function getCurrentUser(): Promise<UserRow | null> {
  const store = await cookies();
  const code = store.get(CODE_COOKIE)?.value;
  if (!code) return null;
  return getUserByCode(code);
}

export function isSuperUser(user: UserRow | null): boolean {
  return !!user && user.super_user === 1;
}

/**
 * The real admin gate. The code modal on /admin is only the UI in front of
 * this: Server Actions are reachable by direct POST, so every admin mutation
 * calls this too rather than trusting that the page rendered.
 */
export async function requireSuperUser(): Promise<UserRow> {
  const user = await getCurrentUser();
  if (!isSuperUser(user)) {
    throw new Error("Not authorized");
  }
  return user as UserRow;
}
