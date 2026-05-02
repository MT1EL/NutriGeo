import type { Records } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import { Award, Trophy, TrendingDown } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

type Props = {
  records: Records | undefined;
};

export default function RecordsCard({ records }: Props) {
  const rows = [
    {
      Icon: Trophy,
      label: "ყველაზე გრძელი სტრიკი",
      value: records ? `${records.longest_streak} დღე` : "—",
      color: "#FFB020",
    },
    {
      Icon: TrendingDown,
      label: "ყველაზე დაბალი წონა",
      value:
        records?.lowest_weight_kg != null
          ? `${records.lowest_weight_kg.toFixed(1)}კგ`
          : "—",
      color: "#34A867",
    },
    {
      Icon: Award,
      label: "საუკეთესო დღე",
      value: records?.best_logging_day
        ? `${records.best_logging_day.entries} ჩანაწერი`
        : "—",
      color: "#5B6CE0",
    },
  ];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>რეკორდები</ThemedText>
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
