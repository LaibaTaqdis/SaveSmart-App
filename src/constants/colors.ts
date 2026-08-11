// Central color palette — keep in sync with tailwind.config.js
export const COLORS = {
  navy: "#0B1E3D",
  navyLight: "#13315C",
  teal: "#0F766E",
  tealDark: "#0B5A54",
  coral: "#F4694A",
  gold: "#D4A72C",
  surface: "#F7F9FA",
  white: "#FFFFFF",
  black: "#1A1A1A",
  muted: "#6B7280",
  danger: "#DC2626",
  success: "#16A34A",
  border: "#E2E8F0",
} as const;

export type ColorKey = keyof typeof COLORS;
