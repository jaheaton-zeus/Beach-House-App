import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { buildDecisionEmail, buildRequestedEmail } from "./email-templates";
import { getUsers } from "./queries";

const FROM_ADDRESS = "notifications@sheltercove.aheaton.com";

async function getEmailContext() {
  const { env } = await getCloudflareContext({ async: true });
  return { email: env.EMAIL, override: env.NOTIFY_OVERRIDE_EMAIL };
}

/** Sends to `override` instead of the real recipients when one is set. */
function resolveRecipients(recipients: string[], override: string | undefined): string[] {
  return override ? [override] : recipients;
}

async function send(to: string[], subject: string, text: string, html: string) {
  if (to.length === 0) return;
  try {
    const { email } = await getEmailContext();
    await email.send({ from: FROM_ADDRESS, to, subject, text, html });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

export async function notifyReservationRequested(input: {
  guestName: string;
  family: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
}): Promise<void> {
  const { override } = await getEmailContext();

  const superUsers = await getUsers();
  const approverEmails = superUsers.filter((u) => u.super_user).map((u) => u.email);
  const to = resolveRecipients(approverEmails, override);

  const { subject, text, html } = buildRequestedEmail(input);
  await send(to, subject, text, html);
}

export async function notifyReservationDecision(input: {
  email: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: "approved" | "denied";
}): Promise<void> {
  const { override } = await getEmailContext();
  const to = resolveRecipients([input.email], override);

  const { subject, text, html } = buildDecisionEmail(input);
  await send(to, subject, text, html);
}
