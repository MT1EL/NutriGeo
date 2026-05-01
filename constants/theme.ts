/**
 * Design tokens for NutriGeo.
 * Colors are organized by role (text, background, brand, semantic, macros, navigation).
 * Spacing / Type / Radius scales replace ad-hoc magic numbers across the app.
 */

import { Platform } from "react-native";

const tintColorLight = "#4A90E2";
const tintColorDark = "#6AAFF5";

const brandSurfaceLight = "#EFF6FF";
const brandSurfaceDark = "#1E3A5F";

export const Colors = {
  light: {
    text: "#0F172A",
    textSecondary: "#64748B",
    textOnBrand: "#FFFFFF",

    background: "#FFFFFF",
    surface: "#F4F7FB",
    card: "#FFFFFF",

    tint: brandSurfaceLight,
    brand: tintColorLight,
    brandSoft: "#DCE9F9",
    brandDeep: "#2F6BC4",

    accent: "#50E3C2",

    success: "#34C759",
    warning: "#F5A623",
    error: "#D0021B",

    macroProtein: "#7C5CFF",
    macroCarbs: "#F5A623",
    macroFat: "#FF6B9D",

    icon: "#64748B",
    tabIconDefault: "#94A3B8",
    tabIconSelected: tintColorLight,

    border: "#E2E8F0",
    borderLight: "#F1F5F9",

    shadow: "rgba(15, 23, 42, 0.08)",
    overlay: "rgba(15, 23, 42, 0.55)",
  },
  dark: {
    text: "#F1F5F9",
    textSecondary: "#94A3B8",
    textOnBrand: "#FFFFFF",

    background: "#0B1220",
    surface: "#0F172A",
    card: "#172033",

    tint: brandSurfaceDark,
    brand: tintColorDark,
    brandSoft: "#22335A",
    brandDeep: "#1B4F94",

    accent: "#50E3C2",

    success: "#30D158",
    warning: "#F5A623",
    error: "#FF453A",

    macroProtein: "#A78BFA",
    macroCarbs: "#FBBF24",
    macroFat: "#FB7185",

    icon: "#94A3B8",
    tabIconDefault: "#64748B",
    tabIconSelected: tintColorDark,

    border: "#1F2A44",
    borderLight: "#172033",

    shadow: "rgba(0, 0, 0, 0.5)",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const Type = {
  xs: 12,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 44,
};

export const LineHeight = {
  xs: 16,
  sm: 18,
  base: 22,
  lg: 24,
  xl: 28,
  xxl: 32,
  xxxl: 40,
  display: 52,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
