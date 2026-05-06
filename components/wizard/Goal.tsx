import type { GoalType } from "@/api/types";
import { useWizard } from "@/contexts/WizardContext";
import { Dumbbell, Scale, TrendingDown } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

const Goal = () => {
  const { t } = useTranslation();
  const { data, setField } = useWizard();

  const OPTIONS = [
    {
      key: "lose" as GoalType,
      title: t("wizard.goal.lose"),
      subtitle: t("statistics.kcalDeficit"),
      Icon: TrendingDown,
      tintColor: "#FEF2F2",
      iconColor: "#EF4444",
    },
    {
      key: "maintain" as GoalType,
      title: t("wizard.goal.maintain"),
      subtitle: t("statistics.macroBalance"),
      Icon: Scale,
      tintColor: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      key: "gain" as GoalType,
      title: t("wizard.goal.gain"),
      subtitle: t("statistics.kcalSurplus"),
      Icon: Dumbbell,
      tintColor: "#F0FDF4",
      iconColor: "#10B981",
    },
  ];

  return (
    <WizzardContentLayout
      title={t("wizard.goal.title")}
      subtitle={t("wizard.goal.subtitle")}
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
