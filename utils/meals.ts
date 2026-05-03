import type { DayMeals, MealSummary } from "@/api/meals";
import type { FoodLogEntry, MealKey } from "@/api/types";
import { entryMacros } from "./foodMath";

export const ALL_MEAL_KEYS: MealKey[] = [
  "breakfast",
  "lunch",
  "snack",
  "dinner",
];

// Convert a flat list of food-log entries into the per-meal aggregated shape
// the home cards expect. Lets any screen build a DayMeals view from the
// shared ["food-log", today] cache without an extra round-trip.
export function aggregateDayMeals(
  entries: FoodLogEntry[],
  date: string,
): DayMeals {
  const meals: Record<MealKey, MealSummary> = ALL_MEAL_KEYS.reduce(
    (acc, key) => {
      acc[key] = {
        meal_key: key,
        kcal: 0,
        protein_g: 0,
        carbs_g: 0,
        fat_g: 0,
        entries: [],
      };
      return acc;
    },
    {} as Record<MealKey, MealSummary>,
  );
  const totals = { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 };

  for (const e of entries) {
    const meal = meals[e.meal_key];
    if (!meal) continue;
    const d = entryMacros(e);

    meal.kcal += d.kcal;
    meal.protein_g += d.protein_g;
    meal.carbs_g += d.carbs_g;
    meal.fat_g += d.fat_g;
    meal.entries.push(e);

    totals.kcal += d.kcal;
    totals.protein_g += d.protein_g;
    totals.carbs_g += d.carbs_g;
    totals.fat_g += d.fat_g;
  }

  return { date, totals, meals: ALL_MEAL_KEYS.map((k) => meals[k]) };
}
