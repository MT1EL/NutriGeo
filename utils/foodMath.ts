import type { Food, FoodLogEntry } from "@/api/types";

export function servingGrams(food: Food): number {
  return food.serving_grams ?? 100;
}

export function caloriesForFood(food: Food, quantity = 1): number {
  return Math.round((food.kcal_per_100g * servingGrams(food) * quantity) / 100);
}

export function macroForFood(
  perHundred: number,
  food: Food,
  quantity = 1,
): number {
  return Math.round((perHundred * servingGrams(food) * quantity) / 100);
}

// `gramShortLabel` is the localized "g" suffix (typically `t("food.perGramShort")`).
// Don't read i18n inside here — the React Compiler memoizes pure-looking calls
// by their visible inputs, which would skip refresh on language change.
export function servingLabel(food: Food, gramShortLabel: string): string {
  if (food.serving_label) return food.serving_label;
  if (food.serving_grams) return `${food.serving_grams}${gramShortLabel}`;
  return `100${gramShortLabel}`;
}

export function gramsToServings(grams: number, food: Food): number {
  return grams / servingGrams(food);
}

export function servingsToGrams(servings: number, food: Food): number {
  return servings * servingGrams(food);
}

export function formatServings(value: number): string {
  if (Number.isInteger(value)) return value.toString();
  return value.toFixed(1).replace(/\.0$/, "");
}

export function formatGrams(value: number): string {
  return Math.round(value).toString();
}

// Normalize a food-log entry to "servings" so existing nutrition math
// (caloriesForFood, macroForFood) works whether the entry was logged
// in servings or in grams.
export function entryServings(entry: FoodLogEntry): number {
  if (entry.unit === "grams" && entry.food) {
    return gramsToServings(entry.quantity, entry.food);
  }
  return entry.quantity || 1;
}

// Human label for a logged entry that respects the unit it was logged in.
// `gramShortLabel` and `quickAddLabel` come from the caller's `t(...)`.
export function entryDisplayServing(
  entry: FoodLogEntry,
  gramShortLabel: string,
  quickAddLabel: string,
): string {
  if (entry.quick_add) return quickAddLabel;
  if (!entry.food) return "";
  if (entry.unit === "grams") {
    return `${Math.round(entry.quantity)}${gramShortLabel}`;
  }
  const base = servingLabel(entry.food, gramShortLabel);
  return entry.quantity !== 1
    ? `${base} × ${formatServings(entry.quantity)}`
    : base;
}

// Pure macro accessor — no localized strings. Use this in aggregations and
// math-only paths so they don't have to drag a translation around.
export type EntryMacros = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export function entryMacros(entry: FoodLogEntry): EntryMacros {
  if (entry.quick_add) {
    return {
      kcal: Math.round(entry.quick_add.kcal),
      protein_g: Math.round(entry.quick_add.protein_g),
      carbs_g: Math.round(entry.quick_add.carbs_g),
      fat_g: Math.round(entry.quick_add.fat_g),
    };
  }
  const food = entry.food;
  if (!food) {
    return { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };
  }
  const q = entryServings(entry);
  return {
    kcal: caloriesForFood(food, q),
    protein_g: macroForFood(food.protein_g_per_100g, food, q),
    carbs_g: macroForFood(food.carbs_g_per_100g, food, q),
    fat_g: macroForFood(food.fat_g_per_100g, food, q),
  };
}

// UI accessor — macros plus the localized title and image. Pass
// `quickAddLabel = t("add.quickAdd")` from the calling component.
export type EntryDisplay = EntryMacros & {
  title: string;
  imageUrl: string | undefined;
  isQuickAdd: boolean;
};

export function entryDisplay(
  entry: FoodLogEntry,
  quickAddLabel: string,
): EntryDisplay {
  const macros = entryMacros(entry);
  if (entry.quick_add) {
    return {
      ...macros,
      title: entry.quick_add.name?.trim() || quickAddLabel,
      imageUrl: undefined,
      isQuickAdd: true,
    };
  }
  const food = entry.food;
  if (!food) {
    return {
      ...macros,
      title: "—",
      imageUrl: undefined,
      isQuickAdd: false,
    };
  }
  return {
    ...macros,
    title: food.name,
    imageUrl: food.image_url,
    isQuickAdd: false,
  };
}
