import { Dumbbell, Scale, TrendingDown } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import GoalCard from "./cards/GoalCard";
import WizzardContentLayout from "./layout";

type Props = {};

const Goal = (props: Props) => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null);
  const data = [
    {
      title: "წონის კლება",
      subtitle: "კალორიული დეფიციტი",
      Icon: TrendingDown,
      tintColor: "#FEF2F2",
      iconColor: "#EF4444",
    },
    {
      title: "წონის შენარჩუნება",
      subtitle: "კალორიების ბალანის",
      Icon: Scale,
      tintColor: "#EFF6FF",
      iconColor: "#3B82F6",
    },
    {
      title: "წონის მატება",
      subtitle: "კალორიული სურპლუსი",
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
            isActive={index === activeIndex}
            onPress={() => setActiveIndex(index)}
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
