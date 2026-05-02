import CalorieGoalCard from "@/components/goals/CalorieGoalCard";
import MacroBalanceReadOnlyCard from "@/components/goals/MacroBalanceReadOnlyCard";
import WeightGoalCard from "@/components/goals/WeightGoalCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import { useEditGoals } from "@/hooks/use-edit-goals";

export default function GoalsScreen() {
  const {
    goals,
    pace,
    setPace,
    targetWeight,
    setTargetWeight,
    calorieTarget,
    setCalorieTarget,
    handleSave,
    isSaving,
  } = useEditGoals();

  return (
    <SubScreenLayout title="მიზნები" subtitle="წონა, კალორია, მაკრო">
      <WeightGoalCard
        targetWeight={targetWeight}
        onTargetWeightChange={setTargetWeight}
        pace={pace}
        onPaceChange={setPace}
      />
      <CalorieGoalCard value={calorieTarget} onChange={setCalorieTarget} />
      <MacroBalanceReadOnlyCard goals={goals} calorieTarget={calorieTarget} />
      <Button onPress={handleSave} disabled={isSaving || !goals}>
        {isSaving ? "ინახება..." : "შენახვა"}
      </Button>
    </SubScreenLayout>
  );
}
