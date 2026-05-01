import { Colors } from "@/constants/theme";
import { PieChart } from "lucide-react-native";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { MacroBar } from "../charts/MacroBar";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

const MacrosCard = () => {
  const colorScheme = useColorScheme() || "light";
  const macros = [
    {
      label: "ცილა",
      consumed: 120,
      goal: 150,
      color: Colors[colorScheme].error,
    },
    {
      label: "ნახშირწყალი",
      consumed: 120,
      goal: 150,
      color: Colors[colorScheme].warning,
    },
    {
      label: "ცხიმი",
      consumed: 120,
      goal: 150,
      color: Colors[colorScheme].success,
    },
  ];
  return (
    <BaseCard>
      <View style={styles.row}>
        <PieChart size={20} color={Colors[colorScheme].brand} />
        <ThemedText style={styles.title}>მაკრონუტრიენტები</ThemedText>
      </View>
      {macros.map((item) => (
        <MacroBar key={item.label} {...item} />
      ))}
    </BaseCard>
  );
};

export default MacrosCard;
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  macroText: {
    fontSize: 12,
    fontWeight: "semibold",
  },
});
