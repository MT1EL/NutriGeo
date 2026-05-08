import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { DimensionValue, StyleSheet, useColorScheme, View } from "react-native";
import ThemedText from "../ui/ThemedText";

type MacroGoalItem = {
  label: string;
  consumed: number;
  goal: number;
  color: string;
};

type Props = {
  macros: MacroGoalItem[];
  unit: string;
};

export const MacroGoalRow = ({ macros, unit }: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const getWidth = (consumed: number, goal: number): DimensionValue =>
    `${Math.min(consumed / goal, 1) * 100}%`;

  return (
    <View style={styles.row}>
      {macros.map((m) => (
        <View key={m.label} style={styles.col}>
          <View style={[styles.track, { backgroundColor: theme.borderLight }]}>
            <View
              style={[
                styles.fill,
                {
                  width: getWidth(m.consumed, m.goal),
                  backgroundColor: m.color,
                },
              ]}
            />
          </View>
          <ThemedText style={styles.label}>{m.label}</ThemedText>
          <View style={styles.valueRow}>
            <ThemedText style={styles.value}>{m.consumed}</ThemedText>
            <ThemedText style={styles.goalText} type="secondary">
              /{m.goal}
              {unit}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  col: {
    flex: 1,
    gap: 4,
  },
  track: {
    height: 4,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 2,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
  },
  value: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  goalText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
