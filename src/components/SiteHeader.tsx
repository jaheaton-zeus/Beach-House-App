"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { UserRow } from "@/lib/db";
import { Icons } from "@/lib/icons";
import { Avatar, FONT_SANS, FONT_DISPLAY } from "./ui";
import { logoutAction } from "@/app/actions";

interface NavItem {
  href: string;
  icon: (c?: string) => React.ReactNode;
  label: string;
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
}: {
  currentUser: UserRow;
  theme: ThemeColors;
  showAdminBadge?: boolean;
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
          height: 62,
          gap: 20,
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
              borderRadius: 8,
              background: theme.accent,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontFamily: FONT_DISPLAY,
              fontWeight: 700,
              fontSize: 15,
              flexShrink: 0,
            }}
          >
            S
          </div>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 17, color: theme.text, whiteSpace: "nowrap" }}>
            Shelter Cove
          </span>
        </Link>

        <nav className="om-desktop-only" style={{ display: "flex", gap: 2 }}>
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                whiteSpace: "nowrap",
                background: isActive(it.href) ? theme.surfaceAlt : "transparent",
                color: isActive(it.href) ? theme.text : theme.textMuted,
                fontSize: 13,
                fontWeight: 600,
                fontFamily: FONT_SANS,
                textDecoration: "none",
              }}
            >
              {it.label}
            </Link>
          ))}
        </nav>

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
                  borderRadius: 99,
                  fontWeight: 600,
                  letterSpacing: "0.06em",
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
