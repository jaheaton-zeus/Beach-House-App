"use server";

import { redirect } from "next/navigation";
import { verifyLogin, setSessionCookie, clearSessionCookie } from "@/lib/auth";

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
