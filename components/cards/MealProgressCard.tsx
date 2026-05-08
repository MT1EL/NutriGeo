import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { DimensionValue, StyleSheet, useColorScheme, View } from "react-native";
import { CombinedMacroBar } from "../macros/CombinedMacroBar";
import { MacroGoalRow } from "../macros/MacroGoalRow";
import { MacroPill } from "../macros/MacroPill";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

export type MacroItem = {
  label: string;
  consumed: number;
  goal?: number;
  color: string;
  tintColor: string;
  textColor: string;
};

type Props = {
  config: {
    Icon: LucideIcon;
    iconColor: string;
    iconTint: string;
  };
  mealLabel: string;
  consumed: number;
  goal?: number;
  macros: MacroItem[];
};

export const MealProgressCard = ({
  config,
  mealLabel,
  consumed,
  goal,
  macros,
}: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const hasGoals = macros.every((m) => m.goal && m.goal > 0);
  const overGoal = goal ? consumed > goal : false;
  const remaining = Math.max((goal ?? 0) - consumed, 0);
  const caloriePct: DimensionValue =
    goal && goal > 0 ? `${Math.min(consumed / goal, 1) * 100}%` : "0%";

  const { Icon, iconColor, iconTint } = config;

  return (
    <BaseCard style={{ gap: 8 }}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: iconTint }]}>
            <Icon color={iconColor} size={20} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.mealLabel}>{mealLabel}</ThemedText>
            <ThemedText type="secondary" style={styles.subLabel}>
              {consumed > 0
                ? goal
                  ? `${consumed} / ${goal} ${t("macros.kcalShort")}`
                  : `${consumed} ${t("macros.kcalShort")}`
                : goal
                  ? `${t("profile.stats.goal")} ${goal} ${t("macros.kcalShort")}`
                  : t("add.nothingLogged")}
            </ThemedText>
          </View>
        </View>

        {goal && (
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
        )}
      </View>

      {/* Calorie progress bar — only when goal is set */}
      {goal && goal > 0 && (
        <View
          style={[styles.calorieTrack, { backgroundColor: theme.borderLight }]}
        >
          <View
            style={[
              styles.calorieFill,
              {
                width: caloriePct,
                backgroundColor: overGoal ? theme.warning : theme.brand,
              },
            ]}
          />
        </View>
      )}

      {/* Macro visualization */}
      {hasGoals ? (
        <MacroGoalRow
          macros={
            macros as Required<
              Pick<MacroItem, "label" | "consumed" | "goal" | "color">
            >[]
          }
          unit={t("macros.g")}
        />
      ) : (
        <>
          <CombinedMacroBar macros={macros} />
          <View style={styles.pillRow}>
            {macros.map((m) => (
              <MacroPill
                key={m.label}
                label={m.label}
                consumed={m.consumed}
                goal={m.goal}
                color={m.color}
                tintColor={theme.borderLight}
                textColor={theme.text}
                unit={t("macros.g")}
              />
            ))}
          </View>
        </>
      )}
    </BaseCard>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flexDirection: "row",
    gap: Spacing.md,
    flex: 1,
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
  calorieTrack: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  calorieFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  pillRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
});
