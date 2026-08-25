"use server";

import { revalidatePath } from "next/cache";

import { clearCodeCookie, isSuperUser, setCodeCookie } from "@/lib/auth";
import { getUserByCode } from "@/lib/queries";

export type SignInResult = { ok: boolean; message: string } | null;

/**
 * Identify by reservation code. `requireSuper` is what the Admin gate passes:
 * a valid code that isn't a super user's gets a different, honest message
 * rather than being told the code is wrong.
 */
export async function signInWithCode(
  _prev: SignInResult,
  formData: FormData
): Promise<SignInResult> {
  const code = String(formData.get("code") ?? "").trim();
  const requireSuper = formData.get("requireSuper") === "1";
  const path = String(formData.get("path") ?? "/");

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

  if (requireSuper && !isSuperUser(user)) {
    return {
      ok: false,
      message: `That code belongs to ${user.name}, who isn’t a super user. Only super users can open Admin.`,
    };
  }

  await setCodeCookie(user.code);
  revalidatePath(path);
  return { ok: true, message: "" };
}

export async function signOut(formData: FormData): Promise<void> {
  await clearCodeCookie();
  revalidatePath(String(formData.get("path") ?? "/"));
}
