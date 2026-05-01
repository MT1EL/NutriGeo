/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const tintColorLight = "#4A90E2";
const tintColorDark = "#6AAFF5";

const brandSurfaceLight = "#EFF6FF"; // light background tint
const brandSurfaceDark = "#1E3A5F"; // darker version for dark mode

export const Colors = {
  light: {
    // Text
    text: "#121212",
    textSecondary: "#757575",

    // Backgrounds
    background: "#FFFFFF",
    surface: "#F9F9F9",
    card: "#FFFFFF",

    // Brand
    tint: brandSurfaceLight,
    brand: tintColorLight,

    // Semantic
    success: "#50E3C2",
    warning: "#F5A623",
    error: "#D0021B",

    // Navigation
    icon: "#757575",
    tabIconDefault: "#757575",
    tabIconSelected: tintColorLight,

    // Borders
    border: "#E0E0E0",
    borderLight: "#F0F0F0",
  },
  dark: {
    // Text
    text: "#F0F0F0",
    textSecondary: "#9E9E9E",

    // Backgrounds
    background: "#121212",
    surface: "#1E1E1E",
    card: "#2C2C2C",

    // Brand
    tint: brandSurfaceDark,
    brand: tintColorDark,

    // Semantic
    success: "#50E3C2",
    warning: "#F5A623",
    error: "#FF453A",

    // Navigation
    icon: "#9E9E9E",
    tabIconDefault: "#9E9E9E",
    tabIconSelected: tintColorDark,

    // Borders
    border: "#333333",
    borderLight: "#2C2C2C",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
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
