import { Colors, Spacing, Type } from "@/constants/theme";
import { Beef, Droplet, PieChart, Wheat } from "lucide-react-native";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import { MacroBar } from "../charts/MacroBar";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

const MacrosCard = () => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const macros = [
    {
      label: "ცილა",
      consumed: 120,
      goal: 150,
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: "ნახშირწყალი",
      consumed: 180,
      goal: 250,
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: "ცხიმი",
      consumed: 45,
      goal: 70,
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];
  return (
    <BaseCard>
      <View style={styles.row}>
        <PieChart size={18} color={theme.brand} />
        <ThemedText style={styles.title}>მაკრონუტრიენტები</ThemedText>
      </View>
      <View style={{ gap: Spacing.md }}>
        {macros.map((item) => (
          <MacroBar key={item.label} {...item} />
        ))}
      </View>
    </BaseCard>
  );
};

export default MacrosCard;
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
