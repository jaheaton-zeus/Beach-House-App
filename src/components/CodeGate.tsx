"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInWithCode, type SignInResult } from "@/app/auth-actions";
import { CloseIcon, LockIcon } from "@/lib/icons";

import { InlineMessage } from "./ui";

/**
 * The reservation-code prompt. This is the app's only sign-in surface: there
 * is no password anywhere. It is UI in front of a server-side check, never the
 * check itself — the page behind it verifies the cookie again on the server.
 */
export function CodeGate({
  title,
  lead,
  path,
  requireSuper = false,
}: {
  title: string;
  lead: string;
  path: string;
  requireSuper?: boolean;
}) {
  const [state, formAction, pending] = useActionState<SignInResult, FormData>(
    signInWithCode,
    null
  );

  return (
    <div className="sc-modal-backdrop">
      <form action={formAction} className="sc-modal">
        <input type="hidden" name="requireSuper" value={requireSuper ? "1" : "0"} />
        <input type="hidden" name="path" value={path} />

        {/* There is nothing to sign out of, so dismissing the prompt just
            returns to the home page. */}
        <Link href="/" className="sc-modal__close" aria-label="Close">
          <CloseIcon />
        </Link>

        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 11,
            background: "rgba(111,167,147,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <LockIcon />
        </div>

        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>{title}</div>
        <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--text-2)", margin: "8px 0 20px" }}>
          {lead}
        </p>

        <label className="sc-field-label" htmlFor="gate-code">
          Reservation code
        </label>
        <input
          id="gate-code"
          name="code"
          type="text"
          autoFocus
          autoComplete="off"
          className="sc-input sc-input--code"
          placeholder="e.g. PIERCE7"
          style={{ marginBottom: 16 }}
        />

        {state && !state.ok ? (
          <InlineMessage kind="err" style={{ marginBottom: 16 }}>
            {state.message}
          </InlineMessage>
        ) : null}

        <button type="submit" className="sc-btn sc-btn--block" disabled={pending}>
          {pending ? "Checking…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
