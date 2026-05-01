import type { ActivityLevel, GoalType, Sex } from "@/api/types";

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_KCAL_OFFSET: Record<GoalType, number> = {
  lose: -500,
  maintain: 0,
  gain: 500,
};

export type MacroTargets = {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export function bmrMifflinStJeor({
  sex,
  weight_kg,
  height_cm,
  age,
}: {
  sex: Sex;
  weight_kg: number;
  height_cm: number;
  age: number;
}): number {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  if (sex === "male") return base + 5;
  if (sex === "female") return base - 161;
  return base - 78;
}

export function calculateMacroTargets(input: {
  sex: Sex;
  weight_kg: number;
  height_cm: number;
  age: number;
  activity_level: ActivityLevel;
  goal_type: GoalType;
}): MacroTargets {
  const bmr = bmrMifflinStJeor(input);
  const tdee = bmr * ACTIVITY_MULTIPLIER[input.activity_level];
  const kcal = Math.max(1200, Math.round(tdee + GOAL_KCAL_OFFSET[input.goal_type]));

  const protein_g = Math.round((kcal * 0.3) / 4);
  const carbs_g = Math.round((kcal * 0.45) / 4);
  const fat_g = Math.round((kcal * 0.25) / 9);

  return { kcal, protein_g, carbs_g, fat_g };
}
