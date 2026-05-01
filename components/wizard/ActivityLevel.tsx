import type { ActivityLevel as ActivityLevelType } from "@/api/types";
import { useWizard } from "@/contexts/WizardContext";
import { Bike, Dumbbell, Footprints, Sofa } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

const OPTIONS = [
  {
    key: "sedentary" as ActivityLevelType,
    title: "ნაკლებად აქტიური",
    subtitle: "ძირითადად მჯდომარე ცხოვრების წესი",
    Icon: Sofa,
    tintColor: "#F1F5F9",
    iconColor: "#64748B",
  },
  {
    key: "light" as ActivityLevelType,
    title: "საშუალოდ აქტიური",
    subtitle: "მსუბუქი აქტივობა (სეირნობა, საოჯახო საქმეები)",
    Icon: Footprints,
    tintColor: "#EFF6FF",
    iconColor: "#3B82F6",
  },
  {
    key: "moderate" as ActivityLevelType,
    title: "ზომიერად აქტიური",
    subtitle: "რეგულარული საშუალო ინტენსივობის აქტივობა",
    Icon: Bike,
    tintColor: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    key: "active" as ActivityLevelType,
    title: "აქტიური",
    subtitle: "ვარჯიში კვირაში 5–6 დღე",
    Icon: Bike,
    tintColor: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    key: "very_active" as ActivityLevelType,
    title: "ძალიან აქტიური",
    subtitle: "ინტენსიური ვარჯიში ან ფიზიკური შრომა",
    Icon: Dumbbell,
    tintColor: "#F0FDF4",
    iconColor: "#10B981",
  },
];

const ActivityLevel = () => {
  const { data, setField } = useWizard();
  return (
    <WizzardContentLayout
      title="რა არის შენი აქტიურობა?"
      subtitle="აირჩიე შენი ჩვეულებრივი დღიური აქტიურობა"
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
