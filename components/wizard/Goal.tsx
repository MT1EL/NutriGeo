import type { GoalType } from "@/api/types";
import { useWizard } from "@/contexts/WizardContext";
import { Dumbbell, Scale, TrendingDown } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

const OPTIONS = [
  {
    key: "lose" as GoalType,
    title: "წონის კლება",
    subtitle: "კალორიული დეფიციტი",
    Icon: TrendingDown,
    tintColor: "#FEF2F2",
    iconColor: "#EF4444",
  },
  {
    key: "maintain" as GoalType,
    title: "წონის შენარჩუნება",
    subtitle: "კალორიების ბალანსი",
    Icon: Scale,
    tintColor: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    key: "gain" as GoalType,
    title: "წონის მატება",
    subtitle: "კალორიული სურპლუსი",
    Icon: Dumbbell,
    tintColor: "#F0FDF4",
    iconColor: "#10B981",
  },
];

const Goal = () => {
  const { data, setField } = useWizard();
  return (
    <WizzardContentLayout
      title="რა არის შენი მიზანი?"
      subtitle="აირჩიე შენი ძირითადი მიზანი"
    >
      <View style={styles.container}>
        {OPTIONS.map((item) => (
          <GoalCard
            key={item.key}
            goal={item}
            isActive={data.goal_type === item.key}
            onPress={() => setField("goal_type", item.key)}
          />
        ))}
      </View>
    </WizzardContentLayout>
  );
};

export default Goal;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
