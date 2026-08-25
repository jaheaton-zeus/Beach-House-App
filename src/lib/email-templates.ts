import "server-only";

import { formatEmailDateRange, guestsLabel, nightsLabel } from "./format";

const SITE_URL = "https://sheltercove.aheaton.com";

const NAVY = "#0E2A4D";
const NAVY_KICKER = "#8CA6C6";
const PAGE_BG = "#EEF2F6";
const CARD_BG = "#F5F8FB";
const CARD_BORDER = "#E2E9F0";
const BODY_TEXT = "#5C6B7A";
const MUTED = "#93A2B0";
const BLUE_CTA = "#1D63E0";

const PENDING_BG = "#FFF1C7";
const PENDING_FG = "#8A6100";
const APPROVED_BG = "#D3F3EE";
const APPROVED_FG = "#0B6F63";
const DENIED_BG = "#FCE1DC";
const DENIED_FG = "#B23B26";

const PIERCE_AVATAR = "#FF6B4A";
const THOMAS_AVATAR = "#6fa793";

const HEADING_FONT = "'Plus Jakarta Sans',Arial,Helvetica,sans-serif";
const BODY_FONT = "'DM Sans',Arial,Helvetica,sans-serif";

function initials(name: string): string {
  const parts = (name || "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

function pill(text: string, bg: string, fg: string): string {
  return `<span style="display:inline-block;font-size:11px;font-weight:700;letter-spacing:0.06em;color:${fg};background:${bg};padding:6px 13px;border-radius:999px">${text}</span>`;
}

function ctaButton(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px">
  <tr><td bgcolor="${BLUE_CTA}" style="background:${BLUE_CTA};border-radius:999px">
    <a href="${href}" style="display:block;padding:14px 28px;font-family:${HEADING_FONT};font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">${label}</a>
  </td></tr>
</table>`;
}

function dateCard(dateRange: string, detail: string, bg: string, labelFg: string, detailFg: string, strike: boolean): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:${bg};border-radius:12px">
  <tr><td style="padding:18px 20px">
    <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;color:${labelFg};margin-bottom:8px">${strike ? "REQUESTED DATES" : "YOUR DATES"}</div>
    <div style="font-family:${HEADING_FONT};font-weight:800;font-size:20px;color:${NAVY};letter-spacing:-0.01em${strike ? ";text-decoration:line-through;text-decoration-color:#C9B5B0" : ""}">${dateRange}</div>
    <div style="font-size:14px;color:${detailFg};margin-top:6px">${detail}</div>
  </td></tr>
</table>`;
}

function emailShell(kicker: string, preheaderText: string, cardBodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light only">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box}html,body{margin:0}body{background:${PAGE_BG};font-family:${BODY_FONT};-webkit-font-smoothing:antialiased}</style>
</head>
<body style="margin:0;background:${PAGE_BG}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${PAGE_BG};font-size:1px">${preheaderText}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAGE_BG}"><tr><td align="center" style="padding:40px 16px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background:${CARD_BG};border-radius:18px;overflow:hidden;box-shadow:0 8px 30px rgba(14,42,77,0.12)">
    <tr><td style="padding:0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%">
        <tr><td style="background:${NAVY};padding:22px 32px" bgcolor="${NAVY}">
          <div style="font-family:${HEADING_FONT};font-weight:800;font-size:19px;color:#ffffff;letter-spacing:-0.01em">Shelter Cove</div>
          <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;color:${NAVY_KICKER};margin-top:3px">${kicker}</div>
        </td></tr>
      </table>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%">
        <tr><td style="padding:28px 24px 34px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;background:#ffffff;border:1px solid ${CARD_BORDER};border-radius:16px">
            <tr><td style="padding:28px 28px 30px">
              ${cardBodyHtml}
            </td></tr>
          </table>
          <div style="text-align:center;font-size:12px;line-height:1.5;color:${MUTED};padding:22px 16px 0">
            Automated message from the Shelter Cove family reservation app — no reply needed.
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</td></tr></table>
</body>
</html>`;
}

export function buildRequestedEmail(input: {
  guestName: string;
  family: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
}): { subject: string; text: string; html: string } {
  const { guestName, family, checkIn, checkOut, guestCount } = input;
  const dateRange = formatEmailDateRange(checkIn, checkOut);
  const detail = `${nightsLabel(checkIn, checkOut)} · ${guestsLabel(guestCount)}`;
  const avatarColor = family === "Pierce" ? PIERCE_AVATAR : THOMAS_AVATAR;

  const cardBody = `${pill("PENDING REVIEW", PENDING_BG, PENDING_FG)}
<div style="font-family:${HEADING_FONT};font-weight:800;font-size:24px;line-height:1.15;color:${NAVY};letter-spacing:-0.02em;margin:16px 0 4px">${guestName} requested the house</div>
<div style="font-size:15px;line-height:1.5;color:${BODY_TEXT};margin-bottom:22px">Two admin approvals confirm this stay; two denials decline it. Cast your vote in the app.</div>
${dateCard(dateRange, detail, CARD_BG, MUTED, BODY_TEXT, false)}
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;margin-top:16px">
  <tr>
    <td style="vertical-align:middle;width:34px">
      <span style="display:inline-block;width:26px;height:26px;border-radius:50%;background:${avatarColor};color:#ffffff;font-size:11px;font-weight:700;text-align:center;line-height:26px;font-family:${BODY_FONT}">${initials(guestName)}</span>
    </td>
    <td style="vertical-align:middle;padding-left:10px">
      <div style="font-size:14px;font-weight:700;color:${NAVY}">${guestName}</div>
      <div style="font-size:12px;color:${MUTED}">${family} family</div>
    </td>
  </tr>
</table>
${ctaButton(`${SITE_URL}/admin`, "Review this request")}`;

  return {
    subject: `New stay request from ${guestName} (${family})`,
    text: `${guestName} (${family}) requested ${dateRange} — ${detail}.\n\nReview it: ${SITE_URL}/admin`,
    html: emailShell(
      "RESERVATION REQUEST",
      `${guestName} requested the house for ${dateRange}. Two admin approvals confirm it.`,
      cardBody
    ),
  };
}

export function buildDecisionEmail(input: {
  guestName: string;
  checkIn: string;
  checkOut: string;
  guestCount: number;
  status: "approved" | "denied";
}): { subject: string; text: string; html: string } {
  const { guestName, checkIn, checkOut, guestCount, status } = input;
  const dateRange = formatEmailDateRange(checkIn, checkOut);
  const detail = `${nightsLabel(checkIn, checkOut)} · ${guestsLabel(guestCount)}`;
  const firstName = guestName.split(" ")[0];
  const approved = status === "approved";

  const cardBody = approved
    ? `${pill("APPROVED", APPROVED_BG, APPROVED_FG)}
<div style="font-family:${HEADING_FONT};font-weight:800;font-size:24px;line-height:1.15;color:${NAVY};letter-spacing:-0.02em;margin:16px 0 4px">Your stay is confirmed</div>
<div style="font-size:15px;line-height:1.5;color:${BODY_TEXT};margin-bottom:22px">Hi ${firstName} — the admins approved your request. The dates below are yours.</div>
${dateCard(dateRange, detail, APPROVED_BG, APPROVED_FG, "#12735F", false)}
<div style="border-top:1px solid ${CARD_BORDER};margin:20px 0 0;padding-top:16px">
  <div style="font-size:14px;line-height:1.55;color:${BODY_TEXT}">Before you go, check the <a href="${SITE_URL}/house/rules" style="color:${BLUE_CTA};text-decoration:none;font-weight:600">house rules</a>. Gate code and Wi-Fi are on the <a href="${SITE_URL}/house/access" style="color:${BLUE_CTA};text-decoration:none;font-weight:600">Access</a> page.</div>
</div>
${ctaButton(`${SITE_URL}/mytrips`, "View your trips")}`
    : `${pill("NOT APPROVED", DENIED_BG, DENIED_FG)}
<div style="font-family:${HEADING_FONT};font-weight:800;font-size:24px;line-height:1.15;color:${NAVY};letter-spacing:-0.02em;margin:16px 0 4px">Your request wasn't approved this time</div>
<div style="font-size:15px;line-height:1.5;color:${BODY_TEXT};margin-bottom:22px">Hi ${firstName} — the admins couldn't confirm the dates below. Often another family already had priority that week.</div>
${dateCard(dateRange, detail, CARD_BG, MUTED, BODY_TEXT, true)}
<div style="border-top:1px solid ${CARD_BORDER};margin:20px 0 0;padding-top:16px">
  <div style="font-size:14px;line-height:1.55;color:${BODY_TEXT}">Check the <a href="${SITE_URL}/calendar" style="color:${BLUE_CTA};text-decoration:none;font-weight:600">calendar</a> for open weeks and send a new request — the family can always talk it through together.</div>
</div>
${ctaButton(`${SITE_URL}/calendar`, "Find open dates")}`;

  return {
    subject: `Your Shelter Cove stay request was ${status}`,
    text: `Hi ${firstName} — your stay request for ${dateRange} was ${status}.\n\nSee it in My Trips: ${SITE_URL}/mytrips`,
    html: emailShell(
      "BOOKING UPDATE",
      approved
        ? `Good news — your stay ${dateRange} is confirmed at the beach house.`
        : `An update on your request for ${dateRange} at the beach house.`,
      cardBody
    ),
  };
}
