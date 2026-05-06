import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { LucideIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

type Macro = {
  label: string;
  consumed: number;
  goal: number;
  color: string;
};

type Props = {
  Icon: LucideIcon;
  iconColor: string;
  iconTint: string;
  mealLabel: string;
  consumed: number;
  goal: number;
  macros: Macro[];
};

export const MealProgressCard = ({
  Icon,
  iconColor,
  iconTint,
  mealLabel,
  consumed,
  goal,
  macros,
}: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const remaining = Math.max(goal - consumed, 0);
  const pct = Math.min(consumed / goal, 1);
  const overGoal = consumed > goal;

  return (
    <BaseCard>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: iconTint }]}>
            <Icon color={iconColor} size={20} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.mealLabel}>{mealLabel}</ThemedText>
            <ThemedText type="secondary" style={styles.subLabel}>
              {consumed > 0
                ? `${consumed} / ${goal} ${t("macros.kcalShort")}`
                : `${t("profile.stats.goal")} ${goal} ${t("macros.kcalShort")}`}
            </ThemedText>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <ThemedText
            style={styles.bigValue}
            color={overGoal ? theme.warning : theme.brand}
          >
            {overGoal ? `+${consumed - goal}` : remaining}
          </ThemedText>
          <ThemedText type="secondary" style={styles.subLabel}>
            {overGoal ? t("macros.exceeded") : t("macros.remaining")}
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.track,
          { backgroundColor: theme.borderLight },
        ]}
      >
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
                /{m.goal}{t("macros.g")}
              </ThemedText>
            </ThemedText>
          </View>
        ))}
      </View>
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  mealLabel: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  subLabel: {
    fontSize: Type.xs,
  },
  bigValue: {
    fontSize: Type.xxl,
    fontWeight: "700",
    letterSpacing: -0.5,
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
