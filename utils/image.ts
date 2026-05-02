const FOOD_PLACEHOLDER = require("@/assets/images/cheesecake.png");

// Resolve an optional remote URL to an expo-image source, falling back to a
// shared placeholder so cards never render an empty box.
export function foodImageSource(url: string | undefined) {
  return url ? { uri: url } : FOOD_PLACEHOLDER;
}
