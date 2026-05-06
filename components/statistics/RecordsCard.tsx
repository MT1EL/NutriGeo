import type { Records } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import { Trophy, TrendingDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

type Props = {
  records: Records | undefined;
};

export default function RecordsCard({ records }: Props) {
  const { t } = useTranslation();
  const rows = [
    {
      Icon: Trophy,
      label: t("statistics.longestStreakLabel"),
      value: records
        ? t("statistics.daysCount", { count: records.longest_streak })
        : "—",
      color: "#FFB020",
    },
    {
      Icon: TrendingDown,
      label: t("statistics.lowestWeightLabel"),
      value:
        records?.lowest_weight_kg != null
          ? `${records.lowest_weight_kg.toFixed(1)}${t("statistics.kgUnit")}`
          : "—",
      color: "#34A867",
    },
  ];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{t("statistics.records")}</ThemedText>
      </View>
      <View style={{ gap: Spacing.sm }}>
        {rows.map(({ Icon, label, value, color }) => (
          <View key={label} style={styles.row}>
            <View style={[styles.icon, { backgroundColor: color + "20" }]}>
              <Icon color={color} size={16} />
            </View>
            <ThemedText style={styles.label}>{label}</ThemedText>
            <ThemedText style={styles.value} color={color}>
              {value}
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
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: Type.sm,
    fontWeight: "600",
  },
  value: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
