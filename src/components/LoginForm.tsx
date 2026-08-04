"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/actions";
import type { ThemeColors } from "@/lib/theme";
import { photoUrl } from "@/lib/photo-url";
import { FONT_SANS, FONT_DISPLAY } from "./ui";

interface DemoUser {
  name: string;
  email: string;
  password: string;
  family: string;
}

const initialState: LoginState = { error: "" };

export function LoginForm({
  theme,
  demoUsers,
  heroPhotoPath,
}: {
  theme: ThemeColors;
  demoUsers: DemoUser[];
  heroPhotoPath: string | null;
}) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        backgroundImage: heroPhotoPath ? `url('${photoUrl(heroPhotoPath)}')` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: theme.headerBg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(31,27,22,0.3) 0%, rgba(31,27,22,0.6) 60%, rgba(31,27,22,0.85) 100%)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 24px 40px",
          color: "#fff",
          maxWidth: 440,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 13,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Shelter Cove
          </div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 38, lineHeight: 1.05, letterSpacing: "-0.015em" }}>
            The Pierce/Thomas
            <br />
            Beach House
          </div>
        </div>

        <form
          action={formAction}
          style={{
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "0.5px solid rgba(255,255,255,0.18)",
            borderRadius: 24,
            padding: 22,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              id="login-email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "13px 16px",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: FONT_SANS,
                outline: "none",
              }}
            />
            <input
              id="login-password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "0.5px solid rgba(255,255,255,0.2)",
                color: "#fff",
                padding: "13px 16px",
                borderRadius: 12,
                fontSize: 15,
                fontFamily: FONT_SANS,
                outline: "none",
              }}
            />
            {state.error && <div style={{ fontSize: 12, color: "#F2A382" }}>{state.error}</div>}
            <button
              type="submit"
              disabled={pending}
              style={{
                background: "#fff",
                color: theme.text,
                border: "none",
                padding: "14px",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                cursor: "pointer",
                opacity: pending ? 0.5 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </div>

          {demoUsers.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "0.5px solid rgba(255,255,255,0.15)" }}>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.55)",
                  marginBottom: 8,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                Demo
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {demoUsers.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => {
                      const emailEl = document.getElementById("login-email") as HTMLInputElement | null;
                      const passEl = document.getElementById("login-password") as HTMLInputElement | null;
                      if (emailEl) emailEl.value = u.email;
                      if (passEl) passEl.value = u.password;
                    }}
                    style={{
                      background: "rgba(255,255,255,0.10)",
                      color: "#fff",
                      border: "0.5px solid rgba(255,255,255,0.2)",
                      borderRadius: 99,
                      padding: "5px 11px",
                      fontSize: 11,
                      cursor: "pointer",
                      fontFamily: FONT_SANS,
                    }}
                  >
                    {u.name.split(" ")[0]} · {u.family}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: 18,
            fontSize: 11,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          UNIT 7557 · SHELTER COVE · HILTON HEAD ISLAND, SC
        </div>
      </div>
    </div>
  );
}
