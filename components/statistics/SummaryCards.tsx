import type { OverviewSummary } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import { formatWeightChange } from "@/utils/format";
import { Activity, Flame, TrendingDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  summary: OverviewSummary | undefined;
};

export default function SummaryCards({ summary }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const isDark = colorScheme === "dark";

  const cards = [
    {
      Icon: Flame,
      label: t("statistics.midKcal"),
      value: summary?.kcal_avg ? Math.round(summary.kcal_avg).toString() : "—",
      tint: isDark ? "#3A2010" : "#FEEDE2",
      color: "#FF7A45",
    },
    {
      Icon: TrendingDown,
      label: t("statistics.weightChange"),
      value: formatWeightChange(summary?.weight_change_kg),
      tint: isDark ? "#1F3A28" : "#E6F6EA",
      color: "#34A867",
    },
    {
      Icon: Activity,
      label: t("home.streak"),
      value: t("statistics.daysCount", { count: summary?.streak.current ?? 0 }),
      tint: isDark ? "#222B4A" : "#EEF0FB",
      color: "#5B6CE0",
    },
  ];

  return (
    <View style={styles.row}>
      {cards.map(({ Icon, label, value, tint, color }) => (
        <BaseCard key={label} style={styles.card}>
          <View style={[styles.icon, { backgroundColor: tint }]}>
            <Icon color={color} size={18} />
          </View>
          <ThemedText style={styles.value}>{value}</ThemedText>
          <ThemedText type="secondary" style={styles.label}>
            {label}
          </ThemedText>
        </BaseCard>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  label: {
    fontSize: Type.xs,
  },
});
