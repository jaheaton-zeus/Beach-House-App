"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ChevronDown, MenuIcon, WaveMark } from "@/lib/icons";

import { WeatherPill } from "./WeatherPill";

const HOUSE_INFO = [
  { href: "/house/rules", label: "Rules" },
  { href: "/house/access", label: "Access" },
  { href: "/around", label: "Around the House" },
  { href: "/house/lights", label: "Lights" },
  { href: "/house/photos", label: "Photos" },
];

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const on = (prefix: string) => pathname === prefix || pathname.startsWith(`${prefix}/`);
  const cls = (active: boolean) => (active ? "sc-nav__link sc-nav__link--on" : "sc-nav__link");

  return (
    <header className="sc-hdr">
      <Link href="/" className="sc-hdr__brand">
        <WaveMark />
        <div style={{ lineHeight: 1 }}>
          <div className="sc-hdr__wordmark">SHELTER COVE</div>
        </div>
      </Link>

      <nav className="sc-nav">
        <Link href="/calendar" className={cls(on("/calendar"))}>
          Calendar
        </Link>

        <div
          style={{ position: "relative" }}
          onMouseEnter={() => setMenuOpen(true)}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <Link href="/house/rules" className={cls(on("/house"))}>
            House Info <ChevronDown />
          </Link>
          {menuOpen ? (
            <div className="sc-menu">
              <div className="sc-menu__panel">
                {HOUSE_INFO.map((item) => (
                  <Link key={item.href} href={item.href} className="sc-menu__item">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <Link href="/mytrips" className={cls(on("/mytrips"))}>
          My Trips
        </Link>
        <Link href="/pathways" className={cls(on("/pathways"))}>
          Pathways
        </Link>
        {/*
          Admin is visible to everyone by design — clicking it asks for a
          reservation code, and only a super user's code gets in.
        */}
        <Link href="/admin" className={cls(on("/admin"))}>
          Admin
        </Link>
      </nav>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <WeatherPill />
        <button
          type="button"
          className="sc-hdr__burger"
          aria-label="Menu"
          aria-expanded={sheetOpen}
          onClick={() => setSheetOpen((v) => !v)}
        >
          <MenuIcon />
        </button>
      </div>

      {sheetOpen ? (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 40,
            paddingTop: 10,
          }}
        >
          <div className="sc-menu__panel">
            <Link href="/calendar" className="sc-menu__item" onClick={() => setSheetOpen(false)}>
              Calendar
            </Link>
            {HOUSE_INFO.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="sc-menu__item"
                onClick={() => setSheetOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/mytrips" className="sc-menu__item" onClick={() => setSheetOpen(false)}>
              My Trips
            </Link>
            <Link href="/pathways" className="sc-menu__item" onClick={() => setSheetOpen(false)}>
              Pathways
            </Link>
            <Link href="/admin" className="sc-menu__item" onClick={() => setSheetOpen(false)}>
              Admin
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
