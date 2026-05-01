import { Beef, Droplet, Flame, Wheat } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Input from "../ui/Input";
import WizzardContentLayout from "./layout";

type Props = {};
const macroInputs = [
  {
    label: "კალორია",
    defaultValue: "2000",
    Icon: Flame,
  },
  {
    label: "ცილა",
    defaultValue: "170",
    Icon: Beef,
  },
  {
    label: "ნახშირწყალი",
    defaultValue: "170",
    Icon: Wheat,
  },
  {
    label: "ცხიმი",
    defaultValue: "50",
    Icon: Droplet,
  },
];
const Suggestion = (props: Props) => {
  return (
    <WizzardContentLayout title="შენი დღიური მიზნები">
      <View style={styles.container}>
        {macroInputs.map((item) => (
          <View style={styles.item} key={item.label}>
            <Input
              label={item.label}
              defaultValue={item.defaultValue}
              Icon={item.Icon}
              keyboardType="decimal-pad"
              disabled
            />
          </View>
        ))}
      </View>
    </WizzardContentLayout>
  );
};

export default Suggestion;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  item: {
    flexBasis: "48%",
  },
});
