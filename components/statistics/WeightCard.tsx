import type { OverviewSummary, WeightPoint } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import { LineChart } from "@/components/charts/LineChart";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { formatWeightChange } from "@/utils/format";
import { Scale, TrendingDown } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";
import CardEmpty from "./CardEmpty";

type Props = {
  weightSeries: WeightPoint[];
  weightGoal: number | null;
  summary: OverviewSummary | undefined;
};

export default function WeightCard({ weightSeries, weightGoal, summary }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const hasEnough = weightSeries.length > 2;
  const lastWeight = hasEnough
    ? weightSeries[weightSeries.length - 1].weight_kg
    : null;

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={{ gap: 2 }}>
          <ThemedText style={styles.cardTitle}>წონის დინამიკა</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            {weightGoal != null
              ? `მიზანი ${weightGoal}კგ`
              : "მიზანი დაყენებული არ არის"}
          </ThemedText>
        </View>
        {summary?.weight_change_kg != null && (
          <View style={[styles.deltaBadge, { backgroundColor: "#E6F6EA" }]}>
            <TrendingDown color="#34A867" size={12} />
            <ThemedText style={styles.deltaText} color="#34A867">
              {formatWeightChange(summary.weight_change_kg)}
            </ThemedText>
          </View>
        )}
      </View>

      {hasEnough ? (
        <>
          <LineChart
            values={weightSeries.map((p) => p.weight_kg)}
            color={theme.brand}
            goal={weightGoal ?? undefined}
            goalColor={theme.textSecondary}
            height={140}
          />
          <View style={styles.footer}>
            <View>
              <ThemedText type="secondary" style={styles.footerLabel}>
                მიმდინარე
              </ThemedText>
              <ThemedText style={styles.footerValue}>
                {lastWeight?.toFixed(1)}კგ
              </ThemedText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <ThemedText type="secondary" style={styles.footerLabel}>
                მიზანი
              </ThemedText>
              <ThemedText style={styles.footerValue} color={theme.brand}>
                {weightGoal != null ? `${weightGoal}კგ` : "—"}
              </ThemedText>
            </View>
          </View>
        </>
      ) : (
        <CardEmpty
          Icon={Scale}
          title="წონის ჩანაწერი არ არის"
          hint="ჩაწერე შენი წონა და ნახე დინამიკა გრაფიკზე."
          color="#34A867"
          tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
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
  deltaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  deltaText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLabel: {
    fontSize: Type.xs,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  footerValue: {
    fontSize: Type.xl,
    fontWeight: "700",
    marginTop: 2,
  },
});
