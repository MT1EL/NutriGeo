import type { UserGoals } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Beef, Droplet, Wheat } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  goals: UserGoals | undefined;
  calorieTarget: string;
};

export default function MacroBalanceReadOnlyCard({
  goals,
  calorieTarget,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const calorieForMacroPct = (pct: number | undefined) => {
    const kcalGoal =
      parseInt(calorieTarget, 10) || goals?.daily_calorie_target || 0;
    return Math.round(((pct ?? 0) / 100) * kcalGoal);
  };

  const macros = [
    {
      label: t("macros.protein"),
      pct: goals?.protein_pct,
      grams: goals?.protein_g_goal,
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: t("macros.carbs"),
      pct: goals?.carbs_pct,
      grams: goals?.carbs_g_goal,
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: t("macros.fat"),
      pct: goals?.fat_pct,
      grams: goals?.fat_g_goal,
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.cardIcon, { backgroundColor: theme.brandSoft }]}>
            <Beef color={theme.brand} size={18} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.cardTitle}>
              {t("goals2.macroBalance")}
            </ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              {t("goals2.kcalDistribution")}
            </ThemedText>
          </View>
        </View>
      </View>

      <View style={styles.barStack}>
        {macros.map((m) => (
          <View
            key={m.label}
            style={{
              width: `${m.pct || 33}%`,
              backgroundColor: m.color,
            }}
          />
        ))}
      </View>

      <View style={{ gap: Spacing.md }}>
        {macros.map(({ label, pct, grams, color, Icon }) => (
          <View key={label} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: color + "22" }]}>
              <Icon color={color} size={16} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.label}>{label}</ThemedText>
              <ThemedText style={styles.sub} type="secondary">
                {grams}
                {t("macros.g")} / {pct}%
              </ThemedText>
            </View>
            <ThemedText style={styles.value} color={color}>
              {calorieForMacroPct(pct)} {t("macros.kcalShort")}
            </ThemedText>
          </View>
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  barStack: {
    flexDirection: "row",
    height: 12,
    borderRadius: Radius.pill,
    overflow: "hidden",
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  sub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  value: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
