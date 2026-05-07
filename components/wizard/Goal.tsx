import type { GoalType } from "@/api/types";
import { WizardData } from "@/contexts/WizardContext";
import { FormikProps } from "formik";
import { Dumbbell, Scale, TrendingDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

const Goal = ({ formik }: { formik: FormikProps<WizardData> }) => {
  const { t } = useTranslation();

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
            isActive={formik.values.goal_type === item.key}
            onPress={() => formik.setFieldValue("goal_type", item.key)}
            isError={Boolean(
              formik.touched.goal_type && formik.errors.goal_type,
            )}
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
