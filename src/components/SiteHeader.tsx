"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { UserRow } from "@/lib/db";
import { Icons } from "@/lib/icons";
import { Avatar, Badge, FONT_SANS } from "./ui";
import { logoutAction } from "@/app/actions";
import { fmtRange } from "@/lib/format";

interface NavItem {
  href: string;
  icon: (c?: string) => React.ReactNode;
  label: string;
}

export interface NextStay {
  check_in: string;
  check_out: string;
  status: "approved" | "pending" | "denied";
}

function navLinks(currentUser: UserRow): NavItem[] {
  const base: NavItem[] = [
    { href: "/home", icon: Icons.home, label: "Home" },
    { href: "/calendar", icon: Icons.calendar, label: "Calendar" },
    { href: "/book", icon: Icons.plus, label: "Book a Stay" },
    { href: "/mytrips", icon: Icons.trips, label: "My Trips" },
    { href: "/info", icon: Icons.house, label: "House Info" },
  ];
  if (currentUser.role === "admin") {
    base.push({ href: "/admin", icon: Icons.rules, label: "Admin" });
  }
  return base;
}

export function SiteHeader({
  currentUser,
  theme,
  showAdminBadge = true,
  nextStay,
}: {
  currentUser: UserRow;
  theme: ThemeColors;
  showAdminBadge?: boolean;
  nextStay?: NextStay | null;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const items = navLinks(currentUser);
  const isActive = (href: string) =>
    pathname === href || (href === "/info" && ["/rules", "/recs"].includes(pathname));

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: `${theme.surface}CC`,
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: `0.5px solid ${theme.border}`,
      }}
    >
      <div
        style={{
          maxWidth: 1250,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 56,
          gap: 20,
          position: "relative",
        }}
      >
        <Link
          href="/home"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 4,
              background: theme.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: "'Titillium Web', sans-serif",
              fontWeight: 900,
              fontSize: 15,
              flexShrink: 0,
            }}
          >
            S
          </div>
          <span
            style={{
              fontFamily: "'Titillium Web', sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.03em",
              fontSize: 16,
              color: theme.text,
              whiteSpace: "nowrap",
            }}
          >
            Shelter Cove
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div className="om-desktop-only" style={{ alignItems: "center", gap: 8 }}>
            <Avatar initials={currentUser.avatar} size={26} family={currentUser.family} />
            <span style={{ fontSize: 12, color: theme.textMuted, fontWeight: 500, whiteSpace: "nowrap" }}>
              {currentUser.family} family
            </span>
            {currentUser.role === "admin" && showAdminBadge && (
              <span
                style={{
                  fontSize: 9,
                  padding: "2px 7px",
                  background: theme.text,
                  color: "#fff",
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                ADMIN
              </span>
            )}
            <form action={logoutAction}>
              <button
                type="submit"
                style={{
                  fontSize: 12,
                  color: theme.textMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: FONT_SANS,
                  padding: 0,
                  marginLeft: 6,
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                Sign out
              </button>
            </form>
          </div>
          <button
            className="om-mobile-only"
            onClick={() => setMobileOpen((o) => !o)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: theme.text,
              alignItems: "center",
            }}
          >
            {mobileOpen ? Icons.close(theme.text) : Icons.menu(theme.text)}
          </button>
        </div>
      </div>

      <nav
        className="om-desktop-only"
        style={{
          maxWidth: 1250,
          margin: "0 auto",
          padding: "0 24px",
          gap: 2,
          height: 42,
          background: theme.text,
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", height: "100%" }}>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                padding: "0 16px",
                height: "100%",
                display: "flex",
                alignItems: "center",
                borderRadius: 0,
                whiteSpace: "nowrap",
                background: "transparent",
                position: "relative",
                color: isActive(it.href) ? "#fff" : "rgba(255,255,255,0.6)",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'Titillium Web', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
              }}
            >
              {it.label}
              {isActive(it.href) && (
                <span
                  style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: 0,
                    height: 3,
                    background: theme.accent,
                    clipPath: "polygon(6% 0,100% 0,94% 100%,0 100%)",
                  }}
                />
              )}
            </Link>
          ))}
        </div>
        {nextStay && (
          <Link
            href="/mytrips"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: theme.accent,
              border: "none",
              padding: "5px 12px",
              borderRadius: 4,
              margin: "8px 0",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.75)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontWeight: 700,
              }}
            >
              Next Stay
            </span>
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>
              {fmtRange(nextStay.check_in, nextStay.check_out)}
            </span>
            <Badge status={nextStay.status} theme={theme} />
          </Link>
        )}
      </nav>

      {mobileOpen && (
        <div
          className="om-mobile-only"
          style={{
            flexDirection: "column",
            borderTop: `0.5px solid ${theme.border}`,
            padding: "10px 20px 18px",
            background: `${theme.surface}F2`,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                textAlign: "left",
                padding: "11px 4px",
                background: "none",
                color: isActive(it.href) ? theme.accent : theme.text,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                borderBottom: `1px solid ${theme.borderSoft}`,
                textDecoration: "none",
              }}
            >
              {it.icon(isActive(it.href) ? theme.accent : theme.textMuted)}
              {it.label}
            </Link>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 4px 0",
            }}
          >
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              {currentUser.name} · {currentUser.family}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                style={{
                  fontSize: 13,
                  color: theme.accentDeep,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: FONT_SANS,
                  fontWeight: 600,
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
