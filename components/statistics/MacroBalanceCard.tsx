import type { MacrosPoint } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { UiRange } from "@/hooks/use-stats";
import { Beef, Droplet, Wheat } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";
import CardEmpty from "./CardEmpty";

const MIN_DAYS_FOR_TREND = 3;

type Props = {
  range: UiRange;
  macrosSeries: MacrosPoint[];
  loggedDays: number;
};

export default function MacroBalanceCard({
  range,
  macrosSeries,
  loggedDays,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const macroPcts = useMemo(() => {
    if (!macrosSeries.length) return { protein: 0, carbs: 0, fat: 0 };
    const totals = macrosSeries.reduce(
      (acc, m) => ({
        proteinG: acc.proteinG + m.protein_g,
        carbsG: acc.carbsG + m.carbs_g,
        fatG: acc.fatG + m.fat_g,
      }),
      { proteinG: 0, carbsG: 0, fatG: 0 },
    );
    const n = macrosSeries.length;
    const proteinKcal = (totals.proteinG / n) * 4;
    const carbsKcal = (totals.carbsG / n) * 4;
    const fatKcal = (totals.fatG / n) * 9;
    const total = proteinKcal + carbsKcal + fatKcal;
    if (!total) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: Math.round((proteinKcal / total) * 100),
      carbs: Math.round((carbsKcal / total) * 100),
      fat: Math.round((fatKcal / total) * 100),
    };
  }, [macrosSeries]);

  const hasTrendData = loggedDays >= MIN_DAYS_FOR_TREND;
  const caption =
    range === "week"
      ? t("statistics.weekDays")
      : range === "month"
        ? t("statistics.monthDays")
        : t("statistics.quarterDays");

  const rows = [
    { Icon: Beef, label: t("macros.protein"), pct: macroPcts.protein, color: theme.macroProtein },
    { Icon: Wheat, label: t("macros.carbs"), pct: macroPcts.carbs, color: theme.macroCarbs },
    { Icon: Droplet, label: t("macros.fat"), pct: macroPcts.fat, color: theme.macroFat },
  ];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{t("statistics.macroBalance2")}</ThemedText>
        <ThemedText type="secondary" style={styles.cardCaption}>
          {t("statistics.average", { caption })}
        </ThemedText>
      </View>
      {hasTrendData ? (
        <View style={{ gap: Spacing.md }}>
          {rows.map(({ Icon, label, pct, color }) => (
            <View key={label} style={{ gap: Spacing.xs + 2 }}>
              <View style={styles.row}>
                <View style={styles.label}>
                  <Icon color={color} size={14} />
                  <ThemedText style={styles.labelText}>{label}</ThemedText>
                </View>
                <ThemedText style={styles.pct} type="secondary">
                  {pct}%
                </ThemedText>
              </View>
              <View
                style={[styles.track, { backgroundColor: theme.borderLight }]}
              >
                <View
                  style={[
                    styles.fill,
                    { width: `${pct}%`, backgroundColor: color },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <CardEmpty
          Icon={Beef}
          title={t("statistics.notEnoughData")}
          hint={t("statistics.logXDaysHint", { count: MIN_DAYS_FOR_TREND })}
          color={theme.macroProtein}
          tint={colorScheme === "dark" ? "#3A1A1A" : "#FCEAEA"}
        />
      )}
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  labelText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  pct: {
    fontSize: Type.sm,
    fontWeight: "700",
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
});
