// Mifflin-St Jeor BMR + activity multipliers + goal deficit/surplus.

const ACTIVITY = {
  sedentary: 1.2,
  light: 1.375,
  light_active: 1.375,
  moderate: 1.55,
  moderately_active: 1.55,
  active: 1.725,
  very_active: 1.725,
  extremely_active: 1.9,
};

const PACE_KCAL_DELTA = {
  0.25: 275,
  0.5: 550,
  0.75: 825,
};

export const WEEKLY_PACE_PRESETS = [0.25, 0.5, 0.75];
export const WEEKLY_PACE_MIN = 0.25;
export const WEEKLY_PACE_MAX = 0.75;

export function ageFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const d = new Date(birthDate);
  const ms = Date.now() - d.getTime();
  return Math.floor(ms / (365.25 * 24 * 60 * 60 * 1000));
}

export function calcBMR({ sex, weight_kg, height_cm, age }) {
  if (!weight_kg || !height_cm || age == null) return null;
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  return Math.round(sex === "male" ? base + 5 : base - 161);
}

export function calcTDEE({ sex, weight_kg, height_cm, age, activity_level }) {
  const bmr = calcBMR({ sex, weight_kg, height_cm, age });
  if (!bmr) return null;
  const mult = ACTIVITY[activity_level] || 1.2;
  return Math.round(bmr * mult);
}

export function calcCalorieGoal({
  sex,
  weight_kg,
  height_cm,
  age,
  activity_level,
  goal_type,
  weekly_pace_kg,
}) {
  const tdee = calcTDEE({ sex, weight_kg, height_cm, age, activity_level });
  if (!tdee) return null;
  const delta = PACE_KCAL_DELTA[weekly_pace_kg] || 550;
  if (goal_type === "lose") return Math.max(1200, tdee - delta);
  if (goal_type === "gain") return tdee + delta;
  return tdee;
}

// Returns { bmr_kcal, tdee_kcal, activity_kcal, calorie_adjustment_kcal }.
// `calorie_adjustment_kcal` is the signed delta from TDEE to the daily target
// (e.g. -500 for a cut, +300 for a bulk). `null` if the inputs are insufficient.
export function calcBreakdown({
  sex,
  weight_kg,
  height_cm,
  age,
  activity_level,
  daily_calorie_target,
}) {
  const bmr_kcal = calcBMR({ sex, weight_kg, height_cm, age });
  if (bmr_kcal == null) return null;
  const tdee_kcal = calcTDEE({
    sex,
    weight_kg,
    height_cm,
    age,
    activity_level,
  });
  if (tdee_kcal == null) return null;
  return {
    bmr_kcal,
    tdee_kcal,
    activity_kcal: tdee_kcal - bmr_kcal,
    calorie_adjustment_kcal:
      daily_calorie_target != null
        ? Math.round(daily_calorie_target - tdee_kcal)
        : null,
  };
}

// Default macro split: 30% protein / 45% carbs / 25% fat
// Returns { protein_g_goal, carbs_g_goal, fat_g_goal } given kcal goal and percentages.
export function macrosFromKcal(
  kcal,
  protein_pct = 30,
  carbs_pct = 45,
  fat_pct = 25,
) {
  return {
    protein_g_goal: Math.round((kcal * protein_pct) / 100 / 4),
    carbs_g_goal: Math.round((kcal * carbs_pct) / 100 / 4),
    fat_g_goal: Math.round((kcal * fat_pct) / 100 / 9),
  };
}

// Inverse of macrosFromKcal: total kcal implied by macro grams (4/4/9).
export function kcalFromMacros(protein_g, carbs_g, fat_g) {
  return Math.round(
    (protein_g || 0) * 4 + (carbs_g || 0) * 4 + (fat_g || 0) * 9,
  );
}

// Default split of the daily calorie target across meals (sums to 1.0).
// Matches the client's hardcoded 500/600/200/700 = 25/30/10/35 for a 2000-kcal
// user, but scales with the user's own daily_calorie_target.
export const MEAL_RATIOS = {
  breakfast: 0.25,
  lunch: 0.3,
  snack: 0.1,
  dinner: 0.35,
};

const SUGGESTED_TIMES = {
  breakfast: "09:00",
  lunch: "13:00",
  snack: "16:00",
  dinner: "19:00",
};

// Derive per-meal kcal/macro targets from a daily target and macro percentages.
// Returns an array of { meal_key, kcal_goal, protein_g_goal, carbs_g_goal,
// fat_g_goal, suggested_time, ratio }.
export function mealTargetsFromGoals({
  daily_calorie_target,
  protein_pct = 30,
  carbs_pct = 45,
  fat_pct = 25,
} = {}) {
  if (!daily_calorie_target) return [];
  return Object.entries(MEAL_RATIOS).map(([meal_key, ratio]) => {
    const kcal = Math.round(daily_calorie_target * ratio);
    return {
      meal_key,
      ratio,
      suggested_time: SUGGESTED_TIMES[meal_key],
      kcal_goal: kcal,
      protein_g_goal: Math.round((kcal * protein_pct) / 100 / 4),
      carbs_g_goal: Math.round((kcal * carbs_pct) / 100 / 4),
      fat_g_goal: Math.round((kcal * fat_pct) / 100 / 9),
    };
  });
}

// Per-slot macro snapshot from a recipe + slot servings. Centralized so
// the generator's slot writer, the daily totals, and the weekly average
// all round identically — the math has four call sites that drift fast
// otherwise. fiber_g passes through only when the recipe row carries it.
export function slotMacros(recipe, servings) {
  const s = servings || 1;
  const out = {
    kcal: Math.round((recipe.kcal_per_serving || 0) * s),
    protein_g: Math.round((recipe.protein_per_serving || 0) * s),
    carbs_g: Math.round((recipe.carbs_per_serving || 0) * s),
    fat_g: Math.round((recipe.fat_per_serving || 0) * s),
  };
  if (recipe.fiber_per_serving != null) {
    out.fiber_g = Math.round(recipe.fiber_per_serving * s);
  }
  return out;
}

// Scale a recipe ingredient's qty_value from its recipe-yield baseline
// (recipe.servings) to one slot's portion (slot.servings). Distinct from
// slotMacros — different inputs and units. Returns null when qty_value
// is null (parser couldn't extract; row renders per-recipe in the list).
export function slotIngredientQty(qty_value, recipe_servings, slot_servings) {
  if (qty_value == null) return null;
  return qty_value * ((slot_servings || 1) / (recipe_servings || 1));
}

// Convert macro grams + total kcal into rounded percentages summing to ~100.
// Last bucket absorbs rounding so the sum is exactly 100.
export function pctFromMacros(protein_g, carbs_g, fat_g, kcal) {
  if (!kcal) return null;
  const protein_pct = Math.round(((protein_g || 0) * 4 * 100) / kcal);
  const carbs_pct = Math.round(((carbs_g || 0) * 4 * 100) / kcal);
  const fat_pct = 100 - protein_pct - carbs_pct;
  return { protein_pct, carbs_pct, fat_pct };
}
