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
  shore: {
    name: "Shore",
    bg: "#F7F4EE",
    surface: "#FFFFFF",
    surfaceAlt: "#F0EBE2",
    surfaceTint: "#FAF7F1",
    accent: "#C96442",
    accentSoft: "#F5E6DD",
    accentDeep: "#A04D2F",
    ocean: "#5B8BA8",
    oceanSoft: "#DDE7EE",
    text: "#1F1B16",
    textMuted: "#7A6F62",
    textSubtle: "#A89F90",
    border: "#E8E1D4",
    borderSoft: "#F0EAE0",
    headerBg: "#1F1B16",
    headerText: "#FFFFFF",
    badge: {
      approved: "#E0EBD6",
      approvedText: "#3D5A2E",
      pending: "#F5E6DD",
      pendingText: "#8B4220",
      denied: "#F0DAD8",
      deniedText: "#8B1A1A",
    },
  },
  dusk: {
    name: "Dusk",
    bg: "#17140F",
    surface: "#211D17",
    surfaceAlt: "#2A251D",
    surfaceTint: "#1D1A14",
    accent: "#E08561",
    accentSoft: "#3A2A22",
    accentDeep: "#F2A382",
    ocean: "#7FA9C4",
    oceanSoft: "#233039",
    text: "#F3EFE7",
    textMuted: "#A79A89",
    textSubtle: "#766B5C",
    border: "#332C22",
    borderSoft: "#2A251D",
    headerBg: "#0F0D09",
    headerText: "#F3EFE7",
    badge: {
      approved: "#233522",
      approvedText: "#9BCB82",
      pending: "#3A2A1A",
      pendingText: "#E5A868",
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
  Pierce: { primary: "#C96442", soft: "#F5E6DD", deep: "#8B4220", letter: "P" },
  Thomas: { primary: "#5B8BA8", soft: "#DDE7EE", deep: "#3A627A", letter: "T" },
};
