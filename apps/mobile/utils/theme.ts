export const COLORS = {
  green: "#22C55E",
  greenDark: "#16A34A",
  greenSoft: "#F0FDF4",

  purple: "#7C3AED",
  purpleDark: "#5B21B6",
  purpleSoft: "#F5F3FF",

  text: "#111827",
  muted: "#6B7280",
  lightText: "#9CA3AF",

  white: "#FFFFFF",
  background: "#F8FAF5",
  card: "#FFFFFF",
  border: "#F3F4F6",

  shadow: "#000000",
  error: "#EF4444",
  warning: "#FEF9C3",
};

export const FONT = {
  title: 28,
  subtitle: 20,
  body: 16,
  small: 13,
  button: 16,
};

export const RADIUS = {
  sm: 8,
  md: 16,
  lg: 16,
  pill: 50,
};

export const SPACING = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 20,
  xl: 24,
};

export const SHADOWS = {
  card: {
    shadowColor: "#000" as const,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05 as const,
    shadowRadius: 8,
    elevation: 2,
  },
  strong: {
    shadowColor: "#000" as const,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08 as const,
    shadowRadius: 12,
    elevation: 4,
  },
  tab: {
    shadowColor: "#000" as const,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06 as const,
    shadowRadius: 12,
    elevation: 6,
  },
};
