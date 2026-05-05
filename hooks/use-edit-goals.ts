import { updateGoals } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { calcCalorieGoal } from "@/utils/nutritions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";

export type Pace = "slow" | "moderate" | "fast";

export const PACE_OPTIONS = [
  { key: "slow", labelKey: "wizard.goalDetails.slow", weeklyKg: 0.25 },
  { key: "moderate", labelKey: "wizard.goalDetails.medium", weeklyKg: 0.5 },
  { key: "fast", labelKey: "wizard.goalDetails.fast", weeklyKg: 0.75 },
] as const;

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

type GoalFormValues = {
  pace: Pace;
  targetWeight: string;
  calorieTarget: string;
};

export function useEditGoals() {
  const toast = useToast();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const goals = user?.goals;

  const formik = useFormik<GoalFormValues>({
    initialValues: {
      pace: paceFromWeeklyKg(goals?.weekly_pace_kg),
      targetWeight: String(goals?.target_weight_kg ?? ""),
      calorieTarget: String(goals?.daily_calorie_target ?? ""),
    },

    validate: (values) => {
      const errors: Record<string, string> = {};

      const currentWeight = user?.profile.weight_kg;

      const calorieNum = Number(values.calorieTarget);
      const weightNum = Number(values.targetWeight);

      const tdee = user?.goals?.tdee_kcal;
      const goal = user?.goals?.goal_type;

      if (
        values.targetWeight &&
        (!Number.isFinite(weightNum) || weightNum <= 40)
      ) {
        errors.targetWeight = i18n.t("goals.validation.invalidWeight");
      }

      if (
        currentWeight &&
        Number.isFinite(weightNum) &&
        Number.isFinite(currentWeight)
      ) {
        if (goal === "gain" && weightNum <= currentWeight) {
          errors.targetWeight = i18n.t("goals.validation.gainWeightTooLow");
        }

        if (goal === "lose" && weightNum >= currentWeight) {
          errors.targetWeight = i18n.t("goals.validation.loseWeightTooHigh");
        }
      }

      if (values.calorieTarget && Number.isFinite(calorieNum) && tdee) {
        if (goal === "lose" && calorieNum > tdee) {
          errors.calorieTarget = i18n.t("goals.validation.caloriesTooHighLose");
        }

        if (goal === "gain" && calorieNum < tdee) {
          errors.calorieTarget = i18n.t("goals.validation.caloriesTooLowGain");
        }

        if (goal === "maintain" && Math.abs(calorieNum - tdee) > 100) {
          errors.calorieTarget = i18n.t(
            "goals.validation.caloriesNotMaintenance",
          );
        }
      }

      return errors;
    },

    onSubmit: () => {
      if (!goals || !targetWeight || !calorieTarget) return;

      const weeklyPaceKg =
        PACE_OPTIONS.find((o) => o.key === pace)?.weeklyKg ??
        goals.weekly_pace_kg;

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
    },
  });

  const { pace, targetWeight, calorieTarget } = formik.values;

  const mutation = useMutation({
    mutationFn: updateGoals,
    onSuccess: async (res) => {
      queryClient.setQueryData(["Profile"], res);
      await queryClient.invalidateQueries({ queryKey: ["Profile"] });
      await queryClient.invalidateQueries({ queryKey: ["meals"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
      await refreshUser();
      toast.success(i18n.t("goals.savedSuccess"));
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");

      toast.error(message, i18n.t("common.error"));
    },
  });

  const handleChange = (
    key: "pace" | "targetWeight" | "calorieTarget",
    value: string | Pace,
  ) => {
    switch (key) {
      case "pace":
        formik.setFieldValue("pace", value);

        const goalCal = calcCalorieGoal({
          sex: user?.profile.biological_sex,
          weight_kg: user?.profile.weight_kg,
          height_cm: user?.profile.height_cm,
          age: user?.profile.age,
          activity_level: user?.goals.activity_level,
          goal_type: user?.goals.goal_type,
          weekly_pace_kg: PACE_OPTIONS.find((item) => item.key === value)
            ?.weeklyKg,
        });

        formik.setFieldValue("calorieTarget", String(goalCal ?? ""));
        break;

      case "targetWeight":
        formik.setFieldValue("targetWeight", value);
        break;

      case "calorieTarget":
        formik.setFieldValue("calorieTarget", value);
        break;
    }
  };

  return {
    errors: formik.errors,
    goals,
    pace,
    targetWeight,
    calorieTarget,
    handleSave: formik.handleSubmit,
    isSaving: mutation.isPending,
    handleChange,
  };
}
