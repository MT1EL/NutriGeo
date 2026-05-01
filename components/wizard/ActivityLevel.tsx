import { Bike, Dumbbell, Footprints, Sofa } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

type Props = {};

const ActivityLevel = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const data = [
    {
      title: " ნაკლებად აქტიური",
      subtitle: "ძირითადად მჯდომარე ცხოვრების წესი",
      Icon: Sofa,
      tintColor: "#F1F5F9",
      iconColor: "#64748B",
    },
    {
      title: "საშუალოდ აქტიური",
      subtitle: "მსუბუქი არივობა (სეირნობა, საოჯახო საქმეები",
      Icon: Footprints,
      tintColor: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      title: "აქტიური",
      subtitle: "რეგულარული საშუალო ინტენსივობის აქტივობა",
      Icon: Bike,
      tintColor: "#DBEAFE",
      iconColor: "#2563EB",
    },
    {
      title: "ძალიან აქტიური",
      subtitle: "ინტენსიური ვარჯიში ან ფიზიკური შრომა",
      Icon: Dumbbell,
      tintColor: "#F0FDF4",
      iconColor: "#10B981",
    },
  ];
  return (
    <WizzardContentLayout
      title="რა არის შენი მიზანი?"
      subtitle="აირჩიე შენი ძირითადი მიზანი"
    >
      <View style={styles.container}>
        {data.map((item, index) => (
          <GoalCard
            key={item.title}
            goal={item}
            isActive={activeIndex === index}
            onPress={() => setActiveIndex(index)}
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
