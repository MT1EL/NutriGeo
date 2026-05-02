import type { Food } from "@/api/types";

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
  if (food.serving_grams) return `${food.serving_grams}გ`;
  return "100გ";
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
