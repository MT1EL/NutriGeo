import type { DayMeals, MealSummary } from "@/api/meals";
import type { FoodLogEntry, MealKey } from "@/api/types";
import { caloriesForFood, entryServings, macroForFood } from "./foodMath";

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
    if (!e.food) continue;
    const q = entryServings(e);
    const kcal = caloriesForFood(e.food, q);
    const p = macroForFood(e.food.protein_g_per_100g, e.food, q);
    const c = macroForFood(e.food.carbs_g_per_100g, e.food, q);
    const f = macroForFood(e.food.fat_g_per_100g, e.food, q);

    const meal = meals[e.meal_key];
    if (!meal) continue;
    meal.kcal += kcal;
    meal.protein_g += p;
    meal.carbs_g += c;
    meal.fat_g += f;
    meal.entries.push(e);

    totals.kcal += kcal;
    totals.protein_g += p;
    totals.carbs_g += c;
    totals.fat_g += f;
  }

  return { date, totals, meals: ALL_MEAL_KEYS.map((k) => meals[k]) };
}
