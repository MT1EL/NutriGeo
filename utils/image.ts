const RECIPE_PLACEHOLDER = require("@/assets/images/cheesecake.png");

// For food cards: return null when there's no image so consumers can render
// their own placeholder (FoodCard shows a tinted initial letter).
export function foodImageSource(url: string | null | undefined) {
  return url ? { uri: url } : null;
}

// For recipe covers (hero, list cards, related): always return an image, falling
// back to the shared cheesecake placeholder, since these layouts need a real image.
export function recipeImageSource(url: string | null | undefined) {
  return url ? { uri: url } : RECIPE_PLACEHOLDER;
}
