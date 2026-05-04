import type { MealPlanPreferences } from "@/utils/mealPlanData";
import { makeIdempotencyKey } from "@/utils/idempotency";
import { api } from "./client";
import type { ApiResponse } from "./types";

// Inline recipe essentials hydrated by the server — saves the FE from
// fanning out N parallel /v1/recipes/:id calls just to render meal cards.
// title is already localized via pickLocalized (recipes table). user_recipes
// don't have bilingual columns, so user_recipe.title is whatever the user typed.
export type SlotRecipeEssentials = {
  title: string;
  cover_url: string | null;
  duration_min: number;
};

export type MealPlanSlot = {
  recipe_id: string | null; // catalog recipe
  user_recipe_id: string | null; // custom recipe (exactly one of the two is set)
  servings: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  // Exactly one is non-null per the recipe_id XOR user_recipe_id rule.
  recipe: SlotRecipeEssentials | null;
  user_recipe: SlotRecipeEssentials | null;
};

export type MealPlanMeals = {
  breakfast: MealPlanSlot[];
  lunch: MealPlanSlot[];
  dinner: MealPlanSlot[];
  snack: MealPlanSlot[];
};

export type MealPlanDay = {
  day_index: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Monday
  date: string; // YYYY-MM-DD
  meals: MealPlanMeals; // empty [] for meals not in preferences.meals_to_include
  totals: { kcal: number; protein_g: number; carbs_g: number; fat_g: number };
};

export type MealPlan = {
  id: string;
  week_of: string; // Monday YYYY-MM-DD
  generated_at: string;
  generator: "auto" | "manual";
  preferences: MealPlanPreferences;
  days: MealPlanDay[];
  weekly_avg: {
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
  };
  regenerations: { used: number; limit: number; resets_at: string };
  warnings?: string[];
};

export type MealPlanRegenerateMeta = { cached?: boolean };

export type CuisineOption = { value: string; label: string };

export type MealPlanPreferencesResponse = {
  preferences: MealPlanPreferences;
  source: "last_plan" | "user_defaults" | "profile_derived";
  options: { cuisines: CuisineOption[] };
};

export function getMealPlanPreferences() {
  return api.get<ApiResponse<MealPlanPreferencesResponse>>(
    "/v1/meal-plan/preferences",
  );
}

export function getCurrentMealPlan(weekOf?: string) {
  return api.get<ApiResponse<MealPlan>>("/v1/meal-plan/current", {
    query: weekOf ? { week_of: weekOf } : undefined,
  });
}

export type RegenerateMealPlanInput = {
  preferences: MealPlanPreferences;
  week_of?: string;
  exclude_recipe_ids?: string[];
};

export function regenerateMealPlan(
  input: RegenerateMealPlanInput,
  idempotencyKey?: string,
) {
  return api.post<{ data: MealPlan; meta?: MealPlanRegenerateMeta }>(
    "/v1/meal-plan/regenerate",
    input,
    { idempotencyKey: idempotencyKey ?? makeIdempotencyKey() },
  );
}

// Shopping list — server aggregates per-(week, ingredient), already scaled
// for preferences.servings_per_meal and pruned by pantry exclusion.
export type ShoppingItem = {
  id: string; // stable per (week, name) for cross-device check state later
  name: string;
  qty: string; // pre-formatted, e.g. "500 g", "—" for spices
  qty_value: number | null;
  qty_unit: string | null; // "g" | "kg" | "ml" | "l" | "pcs" | null
  from_recipe_ids: string[];
};

export type ShoppingCategory = {
  slug:
    | "produce"
    | "protein"
    | "dairy"
    | "pantry"
    | "spices"
    | "frozen"
    | "other";
  label: string; // localized
  items: ShoppingItem[];
};

export type ShoppingList = {
  week_of: string;
  categories: ShoppingCategory[];
  total_items: number;
};

export function getShoppingList(weekOf?: string) {
  return api.get<ApiResponse<ShoppingList>>("/v1/meal-plan/shopping-list", {
    query: weekOf ? { week_of: weekOf } : undefined,
  });
}
