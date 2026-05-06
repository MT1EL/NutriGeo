import CalorieGoalCard from "@/components/goals/CalorieGoalCard";
import MacroBalanceReadOnlyCard from "@/components/goals/MacroBalanceReadOnlyCard";
import WeightGoalCard from "@/components/goals/WeightGoalCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import { useEditGoals } from "@/hooks/use-edit-goals";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function GoalsScreen() {
  const { t } = useTranslation();

  const {
    errors,
    goals,
    pace,
    targetWeight,
    calorieTarget,
    handleSave,
    isSaving,
    handleChange,
  } = useEditGoals();
  return (
    <SubScreenLayout
      title={t("profile.goals")}
      subtitle={t("profile.goalsHint")}
    >
      <WeightGoalCard
        targetWeight={targetWeight}
        onTargetWeightChange={(val) => handleChange("targetWeight", val)}
        pace={pace}
        onPaceChange={(val) => handleChange("pace", val)}
        weeks={6}
        errorText={errors.targetWeight}
      />
      <CalorieGoalCard
        errorText={errors.calorieTarget}
        value={calorieTarget}
        onChange={(val) => handleChange("calorieTarget", val)}
      />
      <MacroBalanceReadOnlyCard goals={goals} calorieTarget={calorieTarget} />
      <View
        style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 20 }}
      >
        <Button
          onPress={handleSave}
          disabled={isSaving || !goals}
          style={{ flex: 1 }}
        >
          {isSaving ? t("common.saving") : t("common.save")}
        </Button>
      </View>
    </SubScreenLayout>
  );
}
