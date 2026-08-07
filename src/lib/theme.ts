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
  // McLaren F1 / Lando Norris — papaya orange + McLaren blue/teal.
  shore: {
    name: "Papaya",
    bg: "#F7F5F2",
    surface: "#FFFFFF",
    surfaceAlt: "#F0EDE8",
    surfaceTint: "#FFF6EE",
    accent: "#FF8000",
    accentSoft: "#FFE6CC",
    accentDeep: "#CC5F00",
    ocean: "#00A19C",
    oceanSoft: "#D7F0EE",
    text: "#141C2B",
    textMuted: "#5C6470",
    textSubtle: "#98A0AA",
    border: "#E7E2DA",
    borderSoft: "#F0EDE8",
    headerBg: "#141C2B",
    headerText: "#FFFFFF",
    badge: {
      approved: "#D7F0EE",
      approvedText: "#00726E",
      pending: "#FFE6CC",
      pendingText: "#B85800",
      denied: "#F5D6D2",
      deniedText: "#A32A1E",
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
  Pierce: { primary: "#FF8000", soft: "#FFE6CC", deep: "#CC5F00", letter: "P" },
  Thomas: { primary: "#00A19C", soft: "#D7F0EE", deep: "#00726E", letter: "T" },
};
