import { User, UserGoals } from "@/api";
import { Pace, PACE_OPTIONS } from "@/hooks/use-edit-goals";

export const goalProjection = (
  user: User | null,
  targetWeight: string,
  calorieTarget: string,
  pace: Pace,
  goals?: UserGoals,
) => {
  if (!goals || !user?.profile?.weight) return null;

  const currentWeight = user.profile.weight;

  const targetWeightNum = parseFloat(targetWeight);
  if (!Number.isFinite(targetWeightNum)) return null;

  const calorieNum = parseInt(calorieTarget, 10);
  const hasCustomCalories = Number.isFinite(calorieNum);

  const tdee = goals.tdee_kcal ?? 2500;

  // -------------------------
  // 1. BASE PACE (anchor)
  // -------------------------
  const selectedPace = PACE_OPTIONS.find((o) => o.key === pace);
  const baseWeeklyKg = selectedPace?.weeklyKg ?? 0.5;

  // -------------------------
  // 2. CALORIE EFFECT (modifier, NOT replacement)
  // -------------------------
  let calorieFactor = 1;

  if (hasCustomCalories) {
    const diff = calorieNum - tdee;

    // normalize effect (-0.5 to +0.5 approx)
    calorieFactor = 1 + diff / 2000;

    // clamp so it never breaks realism
    calorieFactor = Math.max(0.5, Math.min(1.5, calorieFactor));
  }

  // -------------------------
  // 3. FINAL WEEKLY RATE (blend)
  // -------------------------
  const weeklyKg = baseWeeklyKg * calorieFactor;

  // -------------------------
  // 4. DIRECTION LOGIC
  // -------------------------
  const isGain = goals.goal_type === "gain";
  const isLose = goals.goal_type === "lose";

  let remainingKg = 0;

  if (isGain) {
    remainingKg = targetWeightNum - currentWeight;
    if (remainingKg <= 0) return { weeks: 0, end_date: new Date() };
  }

  if (isLose) {
    remainingKg = currentWeight - targetWeightNum;
    if (remainingKg <= 0) return { weeks: 0, end_date: new Date() };
  }

  // -------------------------
  // 5. TIME CALC
  // -------------------------
  const weeks = Math.ceil(remainingKg / weeklyKg);

  const end_date = new Date();
  end_date.setDate(end_date.getDate() + weeks * 7);

  return {
    weeks,
    end_date,
    effective_weekly_kg: weeklyKg,
  };
};
