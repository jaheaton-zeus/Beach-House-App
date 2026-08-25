import type { CSSProperties, ReactNode } from "react";

import type { Family, ReservationStatus } from "@/lib/db";

/** The 34px rule + tracked uppercase label that opens every inner page. */
export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div className="sc-kicker">
      <span className="sc-kicker__label">{children}</span>
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  lead,
  serif = false,
  wideLead = false,
}: {
  kicker: string;
  title: string;
  lead?: string;
  serif?: boolean;
  wideLead?: boolean;
}) {
  return (
    <div className="sc-pagehead">
      <Kicker>{kicker}</Kicker>
      <h1 className={serif ? "sc-h1 sc-h1--serif" : "sc-h1"}>{title}</h1>
      {lead ? <p className={wideLead ? "sc-lead sc-lead--wide" : "sc-lead"}>{lead}</p> : null}
    </div>
  );
}

/** The faded photo sitting behind an inner page's header. */
export function HeroBackdrop({ image }: { image: string }) {
  return (
    <div className="sc-hero-backdrop" aria-hidden>
      <div className="sc-hero-backdrop__image" style={{ backgroundImage: `url('${image}')` }} />
      <div className="sc-hero-backdrop__scrim" />
    </div>
  );
}

export function SectionHeading({ title, count }: { title: string; count?: number }) {
  return (
    <div className="sc-section-head">
      <span className="sc-section-head__diamond" />
      <span className="sc-section-head__title">{title}</span>
      {count !== undefined ? <span className="sc-section-head__count">· {count}</span> : null}
    </div>
  );
}

export function StatusPill({ status }: { status: ReservationStatus }) {
  return <span className={`sc-status sc-status--${status}`}>{status}</span>;
}

export function Avatar({ name, family }: { name: string; family: Family }) {
  return (
    <span className={`sc-avatar sc-avatar--${family.toLowerCase()}`}>{initials(name)}</span>
  );
}

export function initials(name: string): string {
  const parts = (name || "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function InlineMessage({
  kind,
  children,
  style,
}: {
  kind: "ok" | "err";
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <div className={`sc-msg sc-msg--${kind}`} style={style} role="status">
      {children}
    </div>
  );
}

/**
 * Renders the **bold** spans the Lights copy uses. The text is ours, seeded by
 * migration, so this stays a deliberately tiny subset of markdown rather than
 * anything that interprets user input.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} style={{ color: "#eafff8", fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
