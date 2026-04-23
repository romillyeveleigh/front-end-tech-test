export const theme = {
  colors: {
    bg: "#f6f7f9",
    surface: "#ffffff",
    border: "#d6dae2",
    borderStrong: "#b4bcca",
    text: "#1a1c23",
    textMuted: "#555e6f",
    textFaint: "#8c97ab",
    accent: "#2352db",
    accentHover: "#1e43b0",
    accentSoft: "#eef5ff",
    warn: "#b45309",
    warnSoft: "#fef3c7",
    success: "#047857",
    successSoft: "#d1fae5",
    danger: "#b91c1c",
    dangerSoft: "#fee2e2",
    overlay: "rgba(26, 28, 35, 0.4)",
  },
  radii: {
    sm: "4px",
    md: "6px",
    lg: "8px",
    pill: "999px",
  },
  space: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  fontSizes: {
    xs: "12px",
    sm: "13px",
    md: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "22px",
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
  },
} as const;

export type Theme = typeof theme;

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends Theme {}
}
