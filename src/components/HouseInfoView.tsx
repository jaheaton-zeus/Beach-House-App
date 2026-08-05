"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ThemeColors } from "@/lib/theme";
import type { HouseInfoRow } from "@/lib/db";
import type { HouseRuleRow, LocalRecRow } from "@/app/(app)/info/page";
import { Icons } from "@/lib/icons";
import { Card, Screen, SectionLabel, TopBar, FONT_DISPLAY, FONT_SANS } from "@/components/ui";

type IconFn = (c?: string) => React.ReactNode;

const CATS: { id: string; icon: IconFn }[] = [
  { id: "Dining", icon: Icons.fork },
  { id: "Beach", icon: Icons.wave },
  { id: "Bike & Trails", icon: Icons.bike },
  { id: "Activities", icon: Icons.sun },
  { id: "Groceries", icon: Icons.cart },
];

export function HouseInfoView({
  theme,
  houseInfo,
  rules,
  recs,
  galleryCount,
  initialTab = "info",
  initialCategory = "All",
}: {
  theme: ThemeColors;
  houseInfo: HouseInfoRow;
  rules: HouseRuleRow[];
  recs: LocalRecRow[];
  galleryCount: number;
  initialTab?: "info" | "rules" | "recs";
  initialCategory?: string;
}) {
  const [tab, setTab] = useState<"info" | "rules" | "recs">(initialTab);
  const tabs = [
    { id: "info" as const, label: "House" },
    { id: "rules" as const, label: "Rules" },
    { id: "recs" as const, label: "Around" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: theme.bg }}>
      <TopBar title="The House" theme={theme} />

      <div style={{ padding: "0 20px 8px" }}>
        <div style={{ display: "flex", background: theme.surfaceAlt, borderRadius: 12, padding: 3 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1,
                padding: "8px 0",
                fontSize: 13,
                fontWeight: 500,
                background: tab === t.id ? theme.surface : "transparent",
                boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                border: "none",
                borderRadius: 9,
                cursor: "pointer",
                color: tab === t.id ? theme.text : theme.textMuted,
                fontFamily: FONT_SANS,
                transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Screen>
        <div style={{ padding: "12px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
          {tab === "info" && <InfoTab info={houseInfo} theme={theme} galleryCount={galleryCount} />}
          {tab === "rules" && <RulesTab theme={theme} rules={rules} />}
          {tab === "recs" && <RecsTab theme={theme} recs={recs} address={houseInfo.address ?? ""} initialCategory={initialCategory} />}
        </div>
      </Screen>
    </div>
  );
}

function InfoTab({ info, theme, galleryCount }: { info: HouseInfoRow; theme: ThemeColors; galleryCount: number }) {
  const router = useRouter();
  const [copied, setCopied] = useState<string | null>(null);
  const amenities: string[] = JSON.parse(info.amenities_json || "[]");

  const copy = (key: string, val: string | null) => {
    if (!val) return;
    try {
      navigator.clipboard.writeText(val);
    } catch {
      // clipboard may be unavailable; not critical
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 1400);
  };

  const access: {
    key: string;
    icon: IconFn;
    label: string;
    value: string | null;
    mono?: boolean;
    copyable?: boolean;
    highlight?: boolean;
  }[] = [
    { key: "gate", icon: Icons.key, label: "Community gate code", value: info.gate_code, mono: true, copyable: true, highlight: true },
    { key: "unit", icon: Icons.pin, label: "Unit", value: info.unit, mono: true },
    { key: "ssid", icon: Icons.wifi, label: "WiFi network", value: info.wifi_name, mono: true, copyable: true },
    { key: "wpw", icon: Icons.key, label: "WiFi password", value: info.wifi_password, mono: true, copyable: true },
    { key: "park", icon: Icons.car, label: "Parking", value: info.parking },
    { key: "addr", icon: Icons.pin, label: "Address", value: info.address },
  ];

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {[
          { icon: Icons.bed, label: "Bedrooms", value: info.bedrooms },
          { icon: Icons.bath, label: "Bathrooms", value: info.bathrooms },
          { icon: Icons.guests, label: "Sleeps", value: info.max_guests },
        ].map((s) => (
          <div key={s.label} style={{ background: theme.surface, border: `0.5px solid ${theme.border}`, borderRadius: 14, padding: "14px 8px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 6, color: theme.accent }}>{s.icon(theme.accent)}</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: theme.text, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/gallery")}
        style={{
          position: "relative",
          border: "none",
          padding: 0,
          cursor: "pointer",
          borderRadius: 18,
          overflow: "hidden",
          width: "100%",
          aspectRatio: "16/7",
          backgroundColor: theme.surfaceAlt,
          fontFamily: FONT_SANS,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(31,27,22,0.7) 0%, rgba(31,27,22,0.15) 70%)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "0 20px", color: "#fff", textAlign: "left" }}>
          <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", fontWeight: 500, marginBottom: 3, whiteSpace: "nowrap" }}>Photo Gallery</div>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, lineHeight: 1.1 }}>Take a look inside</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 5, display: "flex", alignItems: "center", gap: 5 }}>
            {galleryCount} photos · View all {Icons.chevron("rgba(255,255,255,0.85)")}
          </div>
        </div>
      </button>

      <div>
        <SectionLabel theme={theme}>Access</SectionLabel>
        <Card theme={theme} style={{ padding: 0 }}>
          {access.map((row, i, arr) => (
            <div
              key={row.key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "13px 18px",
                background: row.highlight ? theme.accentSoft : "transparent",
                borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none",
              }}
            >
              <div style={{ color: row.highlight ? theme.accentDeep : theme.textMuted, marginTop: 1 }}>
                {row.icon(row.highlight ? theme.accentDeep : theme.textMuted)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: row.highlight ? theme.accentDeep : theme.textMuted, fontWeight: 500, letterSpacing: "0.02em", marginBottom: 2 }}>
                  {row.label}
                </div>
                <div
                  style={{
                    fontSize: row.highlight ? 18 : 14,
                    color: row.highlight ? theme.accentDeep : theme.text,
                    fontFamily: row.mono ? "'SF Mono', Monaco, monospace" : FONT_SANS,
                    fontWeight: row.highlight ? 700 : 500,
                    letterSpacing: row.mono ? "0.04em" : 0,
                  }}
                >
                  {row.value ?? "—"}
                </div>
              </div>
              {row.copyable && (
                <button
                  onClick={() => copy(row.key, row.value)}
                  style={{
                    flexShrink: 0,
                    border: `0.5px solid ${row.highlight ? theme.accentDeep + "55" : theme.border}`,
                    background: copied === row.key ? (row.highlight ? theme.accentDeep : theme.text) : "transparent",
                    color: copied === row.key ? "#fff" : row.highlight ? theme.accentDeep : theme.textMuted,
                    borderRadius: 99,
                    padding: "5px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: FONT_SANS,
                    transition: "all 0.15s",
                  }}
                >
                  {copied === row.key ? "Copied" : "Copy"}
                </button>
              )}
            </div>
          ))}
        </Card>
      </div>

      <div>
        <SectionLabel theme={theme}>Amenities</SectionLabel>
        <Card theme={theme}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {amenities.map((a) => (
              <span key={a} style={{ padding: "5px 12px", background: theme.accentSoft, color: theme.accentDeep, borderRadius: 99, fontSize: 12, fontWeight: 500 }}>
                {a}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function RulesTab({ theme, rules }: { theme: ThemeColors; rules: HouseRuleRow[] }) {
  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: theme.text, letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.1 }}>House Rules</div>
        <div style={{ fontSize: 14, color: theme.textMuted }}>Keep things smooth so both families can enjoy.</div>
      </div>
      <Card theme={theme} style={{ padding: 0 }}>
        {rules.map((rule, i, arr) => (
          <div
            key={rule.id}
            style={{
              display: "flex",
              gap: 14,
              padding: "14px 18px",
              alignItems: "flex-start",
              borderBottom: i < arr.length - 1 ? `0.5px solid ${theme.borderSoft}` : "none",
            }}
          >
            <div
              style={{
                minWidth: 28,
                height: 28,
                borderRadius: "50%",
                background: theme.accentSoft,
                color: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 700,
                fontFamily: FONT_SANS,
              }}
            >
              {i + 1}
            </div>
            <span style={{ fontSize: 14, color: theme.text, lineHeight: 1.45, paddingTop: 4 }}>{rule.text}</span>
          </div>
        ))}
      </Card>
    </>
  );
}

function RecsTab({
  theme,
  recs,
  address,
  initialCategory = "All",
}: {
  theme: ThemeColors;
  recs: LocalRecRow[];
  address: string;
  initialCategory?: string;
}) {
  const [filter, setFilter] = useState(initialCategory);
  const cats: { id: string; icon: IconFn | null }[] = [{ id: "All", icon: null }, ...CATS];

  const filtered = filter === "All" ? recs : recs.filter((r) => r.category === filter);

  return (
    <>
      <div style={{ marginBottom: 4 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, color: theme.text, letterSpacing: "-0.01em", marginBottom: 4, lineHeight: 1.1 }}>Around the House</div>
        <div style={{ fontSize: 14, color: theme.textMuted }}>Family favorites within walking or short drive of Shelter Cove.</div>
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", margin: "0 -20px", padding: "0 20px 4px" }}>
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            style={{
              padding: "7px 13px",
              borderRadius: 99,
              background: filter === c.id ? theme.text : theme.surface,
              color: filter === c.id ? "#fff" : theme.text,
              border: filter === c.id ? "none" : `0.5px solid ${theme.border}`,
              fontSize: 13,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: FONT_SANS,
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "all 0.15s",
            }}
          >
            {c.id}
          </button>
        ))}
      </div>

      {filter === "All"
        ? CATS.map((c) => {
            const items = recs.filter((r) => r.category === c.id);
            if (items.length === 0) return null;
            return (
              <div key={c.id}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 4px 10px" }}>
                  <div style={{ color: theme.accent }}>{c.icon(theme.accent)}</div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: theme.text }}>{c.id}</span>
                  <span style={{ fontSize: 12, color: theme.textSubtle }}>· {items.length}</span>
                </div>
                <RecList items={items} theme={theme} address={address} />
                {c.id === "Bike & Trails" && (
                  <div style={{ marginTop: 8 }}>
                    <BikeMap theme={theme} />
                  </div>
                )}
              </div>
            );
          })
        : (
            <>
              {filter === "Bike & Trails" && <BikeMap theme={theme} />}
              <RecList items={filtered} theme={theme} address={address} />
            </>
          )}
    </>
  );
}

function BikeMap({ theme }: { theme: ThemeColors }) {
  const MAP_URL = "https://hiltonhead.maps.arcgis.com/apps/instant/interactivelegend/index.html?appid=8f2036039c5e471c96cbdd3664af9052";
  const [loaded, setLoaded] = useState(false);
  return (
    <Card theme={theme} style={{ padding: 0, overflow: "hidden", marginBottom: 10 }}>
      <div style={{ padding: "14px 16px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <div style={{ color: theme.accent }}>{Icons.bike(theme.accent)}</div>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, color: theme.text, lineHeight: 1.1 }}>Island Trail Map</span>
        </div>
        <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.45 }}>
          Hilton Head has 60+ miles of public bike paths. Tap a layer in the legend to see routes, then pinch to zoom around Shelter Cove.
        </div>
      </div>
      <div style={{ position: "relative", height: 300, background: theme.surfaceAlt }}>
        {!loaded && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: theme.textSubtle, fontSize: 13, fontFamily: FONT_SANS }}>
            Loading map…
          </div>
        )}
        <iframe
          src={MAP_URL}
          title="Hilton Head Island Trail Map"
          loading="lazy"
          onLoad={() => setLoaded(true)}
          allowFullScreen
          style={{ position: "relative", width: "100%", height: "100%", border: "none", display: "block" }}
        />
      </div>
      <a
        href={MAP_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "13px 16px",
          borderTop: `0.5px solid ${theme.borderSoft}`,
          color: theme.accentDeep,
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
          fontFamily: FONT_SANS,
        }}
      >
        Open full map ↗
      </a>
    </Card>
  );
}

function RecList({ items, theme, address }: { items: LocalRecRow[]; theme: ThemeColors; address: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item) => (
        <Card key={item.id} theme={theme} style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>{item.name}</span>
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, lineHeight: 1.45, marginBottom: 8 }}>{item.note}</div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(address)}&destination=${encodeURIComponent(item.name + ", Hilton Head Island, SC")}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, color: theme.accent, textDecoration: "none" }}
              >
                {Icons.pin(theme.accent)}
                Directions{item.walk ? ` · ${item.walk}` : ""}
              </a>
            </div>
            <span style={{ padding: "3px 9px", background: theme.surfaceAlt, color: theme.textMuted, borderRadius: 99, fontSize: 10, fontWeight: 600, flexShrink: 0, letterSpacing: "0.02em", textTransform: "uppercase" }}>
              {item.tag}
            </span>
          </div>
        </Card>
      ))}
    </div>
  );
}
