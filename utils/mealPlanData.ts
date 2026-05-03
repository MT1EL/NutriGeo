import type { MealKey } from "@/api/types";

export type MealPlanSlot = {
  meal: MealKey;
  // Index into the recipe pool fetched at runtime. Wraps modulo the pool
  // size so the demo plan still renders even with a small catalog.
  recipeIdx: number;
};

export type MealPlanDay = {
  // 0 = Monday, 6 = Sunday — UI rotates today to the right slot.
  day: number;
  slots: MealPlanSlot[];
};

// Static template — when the backend ships, this becomes the response of
// /v1/meal-plan/current. The recipe IDs come from the live catalog at
// render time, so the plan looks real even before the API exists.
export const STATIC_MEAL_PLAN: MealPlanDay[] = [
  {
    day: 0,
    slots: [
      { meal: "breakfast", recipeIdx: 0 },
      { meal: "lunch", recipeIdx: 1 },
      { meal: "dinner", recipeIdx: 2 },
    ],
  },
  {
    day: 1,
    slots: [
      { meal: "breakfast", recipeIdx: 3 },
      { meal: "lunch", recipeIdx: 4 },
      { meal: "dinner", recipeIdx: 5 },
    ],
  },
  {
    day: 2,
    slots: [
      { meal: "breakfast", recipeIdx: 6 },
      { meal: "lunch", recipeIdx: 7 },
      { meal: "dinner", recipeIdx: 8 },
    ],
  },
  {
    day: 3,
    slots: [
      { meal: "breakfast", recipeIdx: 9 },
      { meal: "lunch", recipeIdx: 10 },
      { meal: "dinner", recipeIdx: 11 },
    ],
  },
  {
    day: 4,
    slots: [
      { meal: "breakfast", recipeIdx: 12 },
      { meal: "lunch", recipeIdx: 13 },
      { meal: "dinner", recipeIdx: 14 },
    ],
  },
  {
    day: 5,
    slots: [
      { meal: "breakfast", recipeIdx: 15 },
      { meal: "lunch", recipeIdx: 16 },
      { meal: "dinner", recipeIdx: 17 },
    ],
  },
  {
    day: 6,
    slots: [
      { meal: "breakfast", recipeIdx: 18 },
      { meal: "lunch", recipeIdx: 19 },
      { meal: "dinner", recipeIdx: 20 },
    ],
  },
];

export type ShoppingItem = {
  name: string;
  qty: string;
};

export type ShoppingCategory = {
  // Translation key under `mealPlan.shopping`.
  labelKey: string;
  items: ShoppingItem[];
};

// When the backend ships, this is computed by aggregating ingredients
// across the week's selected recipes. Quantities are realistic for a
// 7-day single-person plan.
export const STATIC_SHOPPING_LIST: ShoppingCategory[] = [
  {
    labelKey: "categoryProduce",
    items: [
      { name: "Spinach", qty: "300 g" },
      { name: "Cherry tomatoes", qty: "500 g" },
      { name: "Broccoli", qty: "2 heads" },
      { name: "Bell peppers", qty: "4 pcs" },
      { name: "Avocado", qty: "3 pcs" },
      { name: "Garlic", qty: "1 bulb" },
      { name: "Lemon", qty: "2 pcs" },
      { name: "Banana", qty: "6 pcs" },
      { name: "Berries (mixed)", qty: "400 g" },
      { name: "Cucumber", qty: "2 pcs" },
      { name: "Sweet potato", qty: "3 pcs" },
    ],
  },
  {
    labelKey: "categoryProtein",
    items: [
      { name: "Chicken breast", qty: "1 kg" },
      { name: "Salmon fillet", qty: "600 g" },
      { name: "Lean ground beef", qty: "500 g" },
      { name: "Tofu", qty: "400 g" },
      { name: "Canned tuna", qty: "2 cans" },
    ],
  },
  {
    labelKey: "categoryDairy",
    items: [
      { name: "Eggs", qty: "12 pcs" },
      { name: "Greek yogurt", qty: "1 kg" },
      { name: "Cottage cheese", qty: "500 g" },
      { name: "Milk", qty: "2 L" },
      { name: "Cheddar", qty: "200 g" },
    ],
  },
  {
    labelKey: "categoryPantry",
    items: [
      { name: "Quinoa", qty: "500 g" },
      { name: "Brown rice", qty: "1 kg" },
      { name: "Rolled oats", qty: "500 g" },
      { name: "Whole-grain bread", qty: "1 loaf" },
      { name: "Almonds", qty: "200 g" },
      { name: "Chickpeas (canned)", qty: "2 cans" },
    ],
  },
  {
    labelKey: "categorySpices",
    items: [
      { name: "Olive oil", qty: "500 ml" },
      { name: "Salt", qty: "—" },
      { name: "Black pepper", qty: "—" },
      { name: "Cumin", qty: "1 jar" },
      { name: "Paprika", qty: "1 jar" },
    ],
  },
];

// Static daily totals — when the backend ships, computed from the plan.
export const STATIC_DAILY_TOTALS = {
  kcal: 1920,
  protein_g: 138,
  carbs_g: 195,
  fat_g: 65,
};
