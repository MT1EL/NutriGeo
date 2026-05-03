import { updateGoals } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export type Pace = "slow" | "moderate" | "fast";

export const PACE_OPTIONS: {
  key: Pace;
  labelKey: string;
  weeklyKg: number;
}[] = [
  { key: "slow", labelKey: "wizard.goalDetails.slow", weeklyKg: 0.25 },
  { key: "moderate", labelKey: "wizard.goalDetails.medium", weeklyKg: 0.5 },
  { key: "fast", labelKey: "wizard.goalDetails.fast", weeklyKg: 0.75 },
];

export function paceFromWeeklyKg(weeklyKg: number | undefined): Pace {
  if (weeklyKg == null) return "moderate";
  let best: Pace = "moderate";
  let bestDelta = Infinity;
  for (const opt of PACE_OPTIONS) {
    const delta = Math.abs(opt.weeklyKg - weeklyKg);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = opt.key;
    }
  }
  return best;
}

export function useEditGoals() {
  const toast = useToast();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const goals = user?.goals;

  const [pace, setPace] = useState<Pace>(
    paceFromWeeklyKg(goals?.weekly_pace_kg),
  );
  const [targetWeight, setTargetWeight] = useState<string>(
    goals?.target_weight_kg != null ? String(goals.target_weight_kg) : "",
  );
  const [calorieTarget, setCalorieTarget] = useState<string>(
    goals?.daily_calorie_target ? String(goals.daily_calorie_target) : "",
  );

  useEffect(() => {
    if (!goals) return;
    setPace(paceFromWeeklyKg(goals.weekly_pace_kg));
    setTargetWeight(
      goals.target_weight_kg != null ? String(goals.target_weight_kg) : "",
    );
    setCalorieTarget(
      goals.daily_calorie_target ? String(goals.daily_calorie_target) : "",
    );
  }, [goals]);

  const mutation = useMutation({
    mutationFn: updateGoals,
    onSuccess: async (res) => {
      queryClient.setQueryData(["Profile"], res);
      await queryClient.invalidateQueries({ queryKey: ["Profile"] });
      await queryClient.invalidateQueries({ queryKey: ["meals"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
      await refreshUser();
      toast.success(i18n.t("goals2.saved"));
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });

  const handleSave = () => {
    if (!goals) return;
    const weeklyPaceKg =
      PACE_OPTIONS.find((o) => o.key === pace)?.weeklyKg ?? goals.weekly_pace_kg;
    const targetWeightNum = parseFloat(targetWeight.replace(",", "."));
    const calorieNum = parseInt(calorieTarget, 10);
    mutation.mutate({
      goal_type: goals.goal_type,
      activity_level: goals.activity_level,
      target_weight_kg: Number.isFinite(targetWeightNum)
        ? targetWeightNum
        : undefined,
      weekly_pace_kg: weeklyPaceKg,
      daily_calorie_target: Number.isFinite(calorieNum)
        ? calorieNum
        : undefined,
      protein_pct: goals.protein_pct,
      carbs_pct: goals.carbs_pct,
      fat_pct: goals.fat_pct,
    });
  };

  return {
    goals,
    pace,
    setPace,
    targetWeight,
    setTargetWeight,
    calorieTarget,
    setCalorieTarget,
    handleSave,
    isSaving: mutation.isPending,
  };
}
