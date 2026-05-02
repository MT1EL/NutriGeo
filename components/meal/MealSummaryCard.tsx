import ThemedText from "@/components/ui/ThemedText";
import type { MealConfig } from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { StyleSheet, useColorScheme, View } from "react-native";

type MealSummary = {
  consumed: number;
  protein: number;
  carbs: number;
  fat: number;
};

type Props = {
  summary: MealSummary;
  config: MealConfig;
};

export default function MealSummaryCard({ summary, config }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const remaining = Math.max(config.goal - summary.consumed, 0);
  const overGoal = summary.consumed > config.goal;
  const pct = Math.min(summary.consumed / config.goal, 1);

  const macros = [
    {
      label: "ცილა",
      consumed: summary.protein,
      goal: config.proteinGoal,
      color: theme.macroProtein,
    },
    {
      label: "ნახშირწყ.",
      consumed: summary.carbs,
      goal: config.carbsGoal,
      color: theme.macroCarbs,
    },
    {
      label: "ცხიმი",
      consumed: summary.fat,
      goal: config.fatGoal,
      color: theme.macroFat,
    },
  ];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.borderLight },
      ]}
    >
      <View style={styles.top}>
        <View>
          <ThemedText style={styles.consumedLabel} type="secondary">
            ჩაწერილი
          </ThemedText>
          <View style={styles.consumedRow}>
            <ThemedText style={styles.consumedValue}>
              {summary.consumed}
            </ThemedText>
            <ThemedText style={styles.consumedGoal} type="secondary">
              / {config.goal} კალ
            </ThemedText>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <ThemedText
            style={styles.remainingValue}
            color={overGoal ? theme.warning : theme.brand}
          >
            {overGoal ? `+${summary.consumed - config.goal}` : remaining}
          </ThemedText>
          <ThemedText style={styles.remainingLabel} type="secondary">
            {overGoal ? "გადაჭარბდა" : "დარჩა"}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.track, { backgroundColor: theme.borderLight }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${pct * 100}%`,
              backgroundColor: overGoal ? theme.warning : theme.brand,
            },
          ]}
        />
      </View>

      <View style={styles.macros}>
        {macros.map((m) => (
          <View key={m.label} style={styles.macroCol}>
            <View
              style={[
                styles.macroTrack,
                { backgroundColor: theme.borderLight },
              ]}
            >
              <View
                style={[
                  styles.macroFill,
                  {
                    width: `${Math.min(m.consumed / m.goal, 1) * 100}%`,
                    backgroundColor: m.color,
                  },
                ]}
              />
            </View>
            <ThemedText style={styles.macroLabel} type="secondary">
              {m.label}
            </ThemedText>
            <ThemedText style={styles.macroValue}>
              {m.consumed}
              <ThemedText style={styles.macroValueGoal} type="secondary">
                /{m.goal}გ
              </ThemedText>
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  consumedLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  consumedRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  consumedValue: {
    fontSize: Type.xxxl,
    fontWeight: "800",
    letterSpacing: -1,
  },
  consumedGoal: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  remainingValue: {
    fontSize: Type.xxl,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  remainingLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  macros: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  macroCol: {
    flex: 1,
    gap: 4,
  },
  macroTrack: {
    height: 4,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 2,
  },
  macroValue: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  macroValueGoal: {
    fontSize: 10,
    fontWeight: "500",
  },
});
