import type { Food, FoodLogEntry } from "@/api/types";
import i18n from "@/i18n";

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

export function servingLabel(food: Food): string {
  if (food.serving_label) return food.serving_label;
  const g = i18n.t("food.perGramShort");
  if (food.serving_grams) return `${food.serving_grams}${g}`;
  return `100${g}`;
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
export function entryDisplayServing(entry: FoodLogEntry): string {
  if (entry.quick_add) return i18n.t("add.quickAdd");
  if (!entry.food) return "";
  if (entry.unit === "grams") {
    return `${Math.round(entry.quantity)}${i18n.t("food.perGramShort")}`;
  }
  const base = servingLabel(entry.food);
  return entry.quantity !== 1
    ? `${base} × ${formatServings(entry.quantity)}`
    : base;
}

// Unified accessor — returns macros + label for any entry, regardless of
// whether it's a catalog food or a quick-add. Use this in lists so the math
// matches the row title.
export type EntryDisplay = {
  title: string;
  imageUrl: string | undefined;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  isQuickAdd: boolean;
};

export function entryDisplay(entry: FoodLogEntry): EntryDisplay {
  if (entry.quick_add) {
    return {
      title: entry.quick_add.name?.trim() || i18n.t("add.quickAdd"),
      imageUrl: undefined,
      kcal: Math.round(entry.quick_add.kcal),
      protein_g: Math.round(entry.quick_add.protein_g),
      carbs_g: Math.round(entry.quick_add.carbs_g),
      fat_g: Math.round(entry.quick_add.fat_g),
      isQuickAdd: true,
    };
  }
  const food = entry.food;
  if (!food) {
    return {
      title: "—",
      imageUrl: undefined,
      kcal: 0,
      protein_g: 0,
      carbs_g: 0,
      fat_g: 0,
      isQuickAdd: false,
    };
  }
  const q = entryServings(entry);
  return {
    title: food.name,
    imageUrl: food.image_url,
    kcal: caloriesForFood(food, q),
    protein_g: macroForFood(food.protein_g_per_100g, food, q),
    carbs_g: macroForFood(food.carbs_g_per_100g, food, q),
    fat_g: macroForFood(food.fat_g_per_100g, food, q),
    isQuickAdd: false,
  };
}
