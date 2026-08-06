"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { FAMILY_COLORS, type ThemeColors } from "@/lib/theme";

const FONT_SANS = "var(--font-sans)";
const FONT_DISPLAY = "var(--font-display)";

export { FONT_SANS, FONT_DISPLAY };

// ── Avatar ──────────────────────────────────────────────────
export function Avatar({
  initials,
  size = 36,
  family,
}: {
  initials: string;
  size?: number;
  family?: "Pierce" | "Thomas" | null;
}) {
  const fc = family ? FAMILY_COLORS[family] : null;
  const bg = fc ? fc.primary : "#6B6B68";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 600,
        letterSpacing: "0.01em",
        flexShrink: 0,
        fontFamily: FONT_SANS,
      }}
    >
      {initials}
    </div>
  );
}

// ── Badge ───────────────────────────────────────────────────
export function Badge({
  status,
  theme,
  family,
}: {
  status?: "approved" | "pending" | "denied";
  theme: ThemeColors;
  family?: "Pierce" | "Thomas";
}) {
  if (family) {
    const fc = FAMILY_COLORS[family];
    return (
      <span
        style={{
          background: fc.soft,
          color: fc.deep,
          padding: "3px 10px",
          borderRadius: 99,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.02em",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: fc.primary }} />
        {family}
      </span>
    );
  }
  const t = theme.badge;
  const map = {
    approved: { bg: t.approved, color: t.approvedText, label: "Approved" },
    pending: { bg: t.pending, color: t.pendingText, label: "Pending" },
    denied: { bg: t.denied, color: t.deniedText, label: "Denied" },
  };
  const s = map[status || "pending"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "3px 10px",
        borderRadius: 99,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
      }}
    >
      {s.label}
    </span>
  );
}

// ── Card ────────────────────────────────────────────────────
export function Card({
  children,
  style = {},
  onClick,
  theme,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  theme: ThemeColors;
}) {
  const [press, setPress] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseDown={() => onClick && setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{
        background: theme.surface,
        border: `0.5px solid ${theme.border}`,
        borderRadius: 20,
        padding: "18px 20px",
        cursor: onClick ? "pointer" : "default",
        transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s",
        boxShadow: "0 1px 1px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.05)",
        transform: press ? "scale(0.985)" : "scale(1)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Card rendered as a navigable link. Used instead of Card+onClick when the
// parent is a Server Component (functions can't be passed across that
// boundary, but a plain href string can).
export function CardLink({
  href,
  children,
  style = {},
  theme,
}: {
  href: string;
  children: ReactNode;
  style?: CSSProperties;
  theme: ThemeColors;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        textDecoration: "none",
        color: "inherit",
        background: theme.surface,
        border: `0.5px solid ${theme.border}`,
        borderRadius: 20,
        padding: "18px 20px",
        boxShadow: "0 1px 1px rgba(0,0,0,0.03), 0 4px 16px rgba(0,0,0,0.05)",
        transition: "transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s",
        ...style,
      }}
    >
      {children}
    </Link>
  );
}

// ── Button ──────────────────────────────────────────────────
export function Btn({
  children,
  onClick,
  variant = "primary",
  size = "md",
  style = {},
  disabled = false,
  theme,
  full = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "accent" | "secondary" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  style?: CSSProperties;
  disabled?: boolean;
  theme: ThemeColors;
  full?: boolean;
  type?: "button" | "submit";
}) {
  const [press, setPress] = useState(false);
  const base: CSSProperties = {
    border: "none",
    borderRadius: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: FONT_SANS,
    fontWeight: 500,
    transition: "transform 0.1s, opacity 0.15s, background 0.15s",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    opacity: disabled ? 0.4 : 1,
    padding: size === "sm" ? "7px 14px" : size === "lg" ? "15px 24px" : "11px 18px",
    fontSize: size === "sm" ? 13 : size === "lg" ? 15 : 14,
    transform: press && !disabled ? "scale(0.97)" : "scale(1)",
    width: full ? "100%" : "auto",
    letterSpacing: "-0.005em",
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: theme.text, color: "#fff" },
    accent: { background: theme.accent, color: "#fff" },
    secondary: { background: theme.surfaceAlt, color: theme.text },
    ghost: { background: "transparent", color: theme.text },
    light: { background: "#fff", color: theme.text, border: `0.5px solid ${theme.border}` },
  };
  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      disabled={disabled}
      style={{ ...base, ...variants[variant], ...style }}
    >
      {children}
    </button>
  );
}

// ── Input / Textarea ───────────────────────────────────────
export function Input({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  style = {},
  theme,
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: CSSProperties;
  theme: ThemeColors;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && (
        <label style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted, letterSpacing: "0.01em" }}>
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? theme.accent : theme.border}`,
          borderRadius: 12,
          padding: "12px 14px",
          fontSize: 15,
          fontFamily: FONT_SANS,
          background: theme.surface,
          color: theme.text,
          outline: "none",
          transition: "all 0.15s",
          boxShadow: focus ? `0 0 0 4px ${theme.accent}1a` : "none",
        }}
      />
    </div>
  );
}

export function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  style = {},
  theme,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  style?: CSSProperties;
  theme: ThemeColors;
}) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      {label && <label style={{ fontSize: 12, fontWeight: 500, color: theme.textMuted }}>{label}</label>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          border: `1px solid ${focus ? theme.accent : theme.border}`,
          borderRadius: 12,
          padding: "12px 14px",
          fontSize: 15,
          fontFamily: FONT_SANS,
          background: theme.surface,
          color: theme.text,
          outline: "none",
          resize: "vertical",
          transition: "all 0.15s",
          boxShadow: focus ? `0 0 0 4px ${theme.accent}1a` : "none",
        }}
      />
    </div>
  );
}

// ── Layout helpers ──────────────────────────────────────────
export function TopBar({
  title,
  subtitle,
  right,
  left,
  theme,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  left?: ReactNode;
  theme: ThemeColors;
}) {
  return (
    <div
      style={{
        background: `${theme.bg}CC`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "14px 20px 12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexShrink: 0,
        position: "sticky",
        top: 62,
        zIndex: 50,
        borderBottom: `0.5px solid ${theme.borderSoft}`,
      }}
    >
      <div style={{ width: 36 }}>{left}</div>
      <div style={{ textAlign: "center", flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: theme.text, letterSpacing: "-0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ width: 36, display: "flex", justifyContent: "flex-end" }}>{right}</div>
    </div>
  );
}

export function Screen({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ flex: 1, overflowY: "auto", paddingBottom: 60, ...style }}>{children}</div>;
}

export function SectionLabel({
  children,
  theme,
  action,
  onAction,
  style = {},
}: {
  children: ReactNode;
  theme: ThemeColors;
  action?: string;
  onAction?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        padding: "0 4px",
        ...style,
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: theme.text, letterSpacing: "-0.005em" }}>
        {children}
      </span>
      {action && (
        <button
          onClick={onAction}
          style={{
            fontSize: 13,
            color: theme.accent,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: FONT_SANS,
            fontWeight: 500,
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

export function Divider({ theme, style = {} }: { theme: ThemeColors; style?: CSSProperties }) {
  return <div style={{ height: 0.5, background: theme.border, ...style }} />;
}

export function IconBtn({
  children,
  onClick,
  theme,
  style = {},
}: {
  children: ReactNode;
  onClick?: () => void;
  theme: ThemeColors;
  style?: CSSProperties;
}) {
  const [press, setPress] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseLeave={() => setPress(false)}
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        background: theme.surfaceAlt,
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transform: press ? "scale(0.92)" : "scale(1)",
        transition: "transform 0.1s, background 0.15s",
        color: theme.text,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
