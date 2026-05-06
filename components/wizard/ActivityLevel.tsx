import type { ActivityLevel as ActivityLevelType } from "@/api/types";
import { useWizard } from "@/contexts/WizardContext";
import { Bike, Dumbbell, Footprints, Sofa } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

const ActivityLevel = () => {
  const { t } = useTranslation();
  const { data, setField } = useWizard();

  const OPTIONS = [
    {
      key: "sedentary" as ActivityLevelType,
      title: t("wizard.activity.sedentary"),
      subtitle: t("wizard.activity.sedentaryHint"),
      Icon: Sofa,
      tintColor: "#F1F5F9",
      iconColor: "#64748B",
    },
    {
      key: "light" as ActivityLevelType,
      title: t("wizard.activity.light"),
      subtitle: t("wizard.activity.lightHint"),
      Icon: Footprints,
      tintColor: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      key: "moderate" as ActivityLevelType,
      title: t("wizard.activity.moderate"),
      subtitle: t("wizard.activity.moderateHint"),
      Icon: Bike,
      tintColor: "#DBEAFE",
      iconColor: "#2563EB",
    },
    {
      key: "active" as ActivityLevelType,
      title: t("wizard.activity.active"),
      subtitle: t("wizard.activity.activeHint"),
      Icon: Bike,
      tintColor: "#DCFCE7",
      iconColor: "#16A34A",
    },
    {
      key: "very_active" as ActivityLevelType,
      title: t("wizard.activity.veryActive"),
      subtitle: t("wizard.activity.veryActiveHint"),
      Icon: Dumbbell,
      tintColor: "#F0FDF4",
      iconColor: "#10B981",
    },
  ];

  return (
    <WizzardContentLayout
      title={t("wizard.activity.title")}
      subtitle={t("wizard.activity.subtitle")}
    >
      <View style={styles.container}>
        {OPTIONS.map((item) => (
          <GoalCard
            key={item.key}
            goal={item}
            isActive={data.activity_level === item.key}
            onPress={() => setField("activity_level", item.key)}
          />
        ))}
      </View>
    </WizzardContentLayout>
  );
};

export default ActivityLevel;

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
