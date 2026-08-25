import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { formatRange, nightsLabel } from "./format";
import { getUsers } from "./queries";

const FROM_ADDRESS = "notifications@sheltercove.aheaton.com";
const SITE_URL = "https://sheltercove.aheaton.com";

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
  const { guestName, family, checkIn, checkOut, guestCount } = input;
  const { override } = await getEmailContext();

  const superUsers = await getUsers();
  const approverEmails = superUsers.filter((u) => u.super_user).map((u) => u.email);
  const to = resolveRecipients(approverEmails, override);

  const dateRange = formatRange(checkIn, checkOut);
  const guests = `${guestCount} ${guestCount === 1 ? "guest" : "guests"}`;

  const text = `${guestName} (${family}) requested ${dateRange} — ${nightsLabel(checkIn, checkOut)}, ${guests}.\n\nReview it: ${SITE_URL}/admin`;
  const html = `<p><strong>${guestName}</strong> (${family}) requested <strong>${dateRange}</strong> — ${nightsLabel(checkIn, checkOut)}, ${guests}.</p><p><a href="${SITE_URL}/admin">Review it in Admin</a></p>`;

  await send(to, `New stay request from ${guestName} (${family})`, text, html);
}

export async function notifyReservationDecision(input: {
  email: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "approved" | "denied";
}): Promise<void> {
  const { email, guestName, checkIn, checkOut, status } = input;
  const { override } = await getEmailContext();
  const to = resolveRecipients([email], override);

  const dateRange = formatRange(checkIn, checkOut);
  const firstName = guestName.split(" ")[0];

  const text = `Hi ${firstName} — your stay request for ${dateRange} was ${status}.\n\nSee it in My Trips: ${SITE_URL}/mytrips`;
  const html = `<p>Hi ${firstName} — your stay request for <strong>${dateRange}</strong> was <strong>${status}</strong>.</p><p><a href="${SITE_URL}/mytrips">See it in My Trips</a></p>`;

  await send(to, `Your Shelter Cove stay request was ${status}`, text, html);
}
