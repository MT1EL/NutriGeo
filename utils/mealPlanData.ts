import type { MealKey } from "@/api/types";

// Per-week preferences that steer plan generation. Mirrors the shape we
// send to POST /v1/meal-plan/regenerate.
export type MealPlanPreferences = {
  // Free-form "anything else?" — goes straight into the LLM prompt. Captures
  // signals the structured fields can't ("sweet tooth", "easy weeknight
  // dinners", "no fish on Fridays"). Trim+limit on the server.
  notes: string;
  servings_per_meal: number; // 1..6
  max_prep_minutes: number | null; // 15 | 30 | 45 | 60 | null (no limit)
  meals_to_include: MealKey[];
  cuisines: string[]; // controlled vocabulary, max 4
  // Specific dishes/ingredients the planner SHOULD fit in this week.
  // Backend matches against recipe title/ingredients; soft preference, not hard.
  must_include: string[]; // free text, max 10
  pantry_ingredients: string[]; // free text, max 30
  avoid_ingredients: string[]; // free text, max 30
  batch_cooking: boolean;
  kcal_override: number | null;
};

export const NOTES_MAX_LENGTH = 240;

export const PREP_TIME_OPTIONS: (number | null)[] = [15, 30, 45, 60, null];

// Stable slugs — i18n labels live under mealPlan.preferences.cuisines.<slug>.
export const CUISINE_OPTIONS = [
  "mediterranean",
  "asian",
  "mexican",
  "italian",
  "indian",
  "middle_eastern",
  "comfort",
  "georgian",
] as const;

export const ALL_MEALS: MealKey[] = ["breakfast", "lunch", "dinner", "snack"];

export const DEFAULT_MEAL_PLAN_PREFERENCES: MealPlanPreferences = {
  notes: "",
  servings_per_meal: 1,
  max_prep_minutes: 30,
  meals_to_include: ["breakfast", "lunch", "dinner"],
  cuisines: [],
  must_include: [],
  pantry_ingredients: [],
  avoid_ingredients: [],
  batch_cooking: false,
  kcal_override: null,
};
