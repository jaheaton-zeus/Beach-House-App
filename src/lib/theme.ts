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
  // Coastal navy + ocean azure, replacing the earlier McLaren papaya/black reskin.
  shore: {
    name: "Tidewater",
    bg: "#F5F8FB",
    surface: "#FFFFFF",
    surfaceAlt: "#EDF3F8",
    surfaceTint: "#E8F1FB",
    accent: "#1D63E0",
    accentSoft: "#DCEAFC",
    accentDeep: "#12459E",
    ocean: "#12A594",
    oceanSoft: "#D3F3EE",
    text: "#0E2A4D",
    textMuted: "#5C6B7A",
    textSubtle: "#93A2B0",
    border: "#E2E9F0",
    borderSoft: "#EEF3F8",
    headerBg: "#0E2A4D",
    headerText: "#FFFFFF",
    badge: {
      approved: "#D3F3EE",
      approvedText: "#0B7A6E",
      pending: "#FFF1C7",
      pendingText: "#8A6100",
      denied: "#FCE1DC",
      deniedText: "#B23B26",
    },
  },
  dusk: {
    name: "Papaya Dusk",
    bg: "#12161F",
    surface: "#1B212E",
    surfaceAlt: "#242B3A",
    surfaceTint: "#181D28",
    accent: "#FF9433",
    accentSoft: "#3D2C16",
    accentDeep: "#FFB265",
    ocean: "#26C9C2",
    oceanSoft: "#1B3B39",
    text: "#F1F3F6",
    textMuted: "#9AA3B0",
    textSubtle: "#6B7482",
    border: "#2B3242",
    borderSoft: "#242B3A",
    headerBg: "#0A0D13",
    headerText: "#F1F3F6",
    badge: {
      approved: "#1B3B39",
      approvedText: "#4FD9CF",
      pending: "#3D2C16",
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
  Pierce: { primary: "#FF6B4A", soft: "#FFE3DA", deep: "#C23F22", letter: "P" },
  Thomas: { primary: "#12A594", soft: "#D3F3EE", deep: "#0B7A6E", letter: "T" },
};
