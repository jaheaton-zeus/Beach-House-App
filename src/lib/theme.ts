// Ported from the Claude Design prototype's components.jsx THEMES object.
// Only "shore" is wired up in the UI for now, matching the prototype's
// documented status ("Theme: Shore (light) only").

export interface ThemeColors {
  name: string;
  bg: string;
  surface: string;
  surfaceAlt: string;
  surfaceTint: string;
  accent: string;
  accentSoft: string;
  accentDeep: string;
  ocean: string;
  oceanSoft: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  border: string;
  borderSoft: string;
  headerBg: string;
  headerText: string;
  badge: {
    approved: string;
    approvedText: string;
    pending: string;
    pendingText: string;
    denied: string;
    deniedText: string;
  };
}

export const THEMES: Record<"shore" | "dusk", ThemeColors> = {
  // Papaya orange + black, per McLaren Racing's official F1 team colors.
  shore: {
    name: "Papaya",
    bg: "#F6F6F4",
    surface: "#FFFFFF",
    surfaceAlt: "#EFEFEC",
    surfaceTint: "#FAFAF8",
    accent: "#FF8000",
    accentSoft: "#FFE7CC",
    accentDeep: "#CC6600",
    ocean: "#1A1A1A",
    oceanSoft: "#E8E8E6",
    text: "#141414",
    textMuted: "#6B6B68",
    textSubtle: "#9B9B97",
    border: "#E2E2DE",
    borderSoft: "#ECECE8",
    headerBg: "#000000",
    headerText: "#FFFFFF",
    badge: {
      approved: "#E0EBD6",
      approvedText: "#3D5A2E",
      pending: "#FFE7CC",
      pendingText: "#8A4600",
      denied: "#F0DAD8",
      deniedText: "#8B1A1A",
    },
  },
  dusk: {
    name: "Papaya Dusk",
    bg: "#0F0F0F",
    surface: "#1A1A1A",
    surfaceAlt: "#242424",
    surfaceTint: "#161616",
    accent: "#FF8F1F",
    accentSoft: "#3D2A16",
    accentDeep: "#FFB265",
    ocean: "#E5E5E5",
    oceanSoft: "#2E2E2E",
    text: "#F5F5F3",
    textMuted: "#A3A3A0",
    textSubtle: "#737371",
    border: "#2E2E2E",
    borderSoft: "#242424",
    headerBg: "#000000",
    headerText: "#F5F5F3",
    badge: {
      approved: "#233522",
      approvedText: "#9BCB82",
      pending: "#3D2A16",
      pendingText: "#FFB265",
      denied: "#3A201E",
      deniedText: "#E58787",
    },
  },
};

export interface FamilyColor {
  primary: string;
  soft: string;
  deep: string;
  letter: string;
}

export const FAMILY_COLORS: Record<"Pierce" | "Thomas", FamilyColor> = {
  Pierce: { primary: "#FF8000", soft: "#FFE7CC", deep: "#CC6600", letter: "P" },
  Thomas: { primary: "#3A3A3A", soft: "#E8E8E6", deep: "#1A1A1A", letter: "T" },
};
