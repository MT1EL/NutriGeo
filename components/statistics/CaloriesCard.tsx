import type { CaloriesPoint } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { UiRange } from "@/hooks/use-stats";
import { weekdayShort } from "@/utils/date";
import { Flame } from "lucide-react-native";
import { useMemo } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import CardEmpty from "./CardEmpty";

type Bar = { key: string; kcal: number; label: string; showLabel: boolean };

// Calorie bars:
//   week    → 7 daily bars (raw kcal)
//   month   → 4 weekly bars (avg kcal/day across *logged* days in that week)
//   quarter → 12 weekly bars (same averaging)
function buildBars(series: CaloriesPoint[], range: UiRange): Bar[] {
  if (range === "week") {
    return series.map((p, i) => ({
      key: p.date ?? `${i}`,
      kcal: Number(p.kcal) || 0,
      label: weekdayShort(p.date) || `${i + 1}`,
      showLabel: true,
    }));
  }
  const bucketCount = range === "month" ? 4 : 12;
  const len = series.length;
  if (len === 0) return [];
  const size = Math.ceil(len / bucketCount);
  const out: Bar[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const slice = series.slice(i * size, (i + 1) * size);
    if (slice.length === 0) continue;
    const logged = slice.filter((p) => p.kcal > 0);
    const avg = logged.length
      ? Math.round(
          logged.reduce((a, p) => a + (Number(p.kcal) || 0), 0) /
            logged.length,
        )
      : 0;
    out.push({
      key: `wk-${i}`,
      kcal: avg,
      label: range === "month" ? `კვ ${i + 1}` : `${i + 1}`,
      showLabel: true,
    });
  }
  return out;
}

type Props = {
  range: UiRange;
  series: CaloriesPoint[];
  calGoal: number;
  hasAnyCalories: boolean;
};

export default function CaloriesCard({
  range,
  series,
  calGoal,
  hasAnyCalories,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const bars = useMemo(() => buildBars(series, range), [series, range]);
  const barMax = bars.length
    ? Math.max(...bars.map((b) => b.kcal), calGoal) * 1.1
    : calGoal * 1.1;

  // Bar width shrinks as count grows so 30 daily bars still fit.
  const barWidth = bars.length <= 7 ? 26 : bars.length <= 12 ? 18 : 7;
  const showValueText = bars.length <= 7;

  const title =
    range === "week"
      ? "კვირის კალორია"
      : range === "month"
        ? "თვის კალორია"
        : "3 თვის კალორია";
  const caption =
    range === "week"
      ? `მიზანი ${calGoal} კალ/დღეში`
      : `საშ. კალ/დღე · მიზანი ${calGoal}`;

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={{ gap: 2 }}>
          <ThemedText style={styles.cardTitle}>{title}</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            {caption}
          </ThemedText>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.brand }]}
            />
            <ThemedText style={styles.legendText} type="secondary">
              {range === "week" ? "დღეს" : "მიმდ."}
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.warning }]}
            />
            <ThemedText style={styles.legendText} type="secondary">
              გადაჭარბება
            </ThemedText>
          </View>
        </View>
      </View>

      {hasAnyCalories ? (
        <View style={styles.chart}>
          <View
            pointerEvents="none"
            style={[
              styles.goalLine,
              { top: Spacing.sm + (1 - calGoal / barMax) * 130 },
            ]}
          >
            <View
              style={[
                styles.goalLineRule,
                { backgroundColor: theme.textSecondary },
              ]}
            />
            <View
              style={[
                styles.goalLineLabelWrap,
                { backgroundColor: theme.card },
              ]}
            >
              <ThemedText style={styles.goalLineLabel} type="secondary">
                {calGoal}
              </ThemedText>
            </View>
          </View>
          {bars.map((p, i) => {
            const v = p.kcal;
            const h = (v / barMax) * 130;
            const overGoal = v > calGoal;
            const isCurrent = i === bars.length - 1;
            const valueText =
              v >= 1000 ? `${(v / 1000).toFixed(1)}კ` : `${v}`;
            return (
              <View key={p.key} style={styles.barCol}>
                <View style={[styles.barTrack, { width: barWidth }]}>
                  {showValueText && v > 0 ? (
                    <ThemedText
                      style={styles.barValue}
                      color={isCurrent ? theme.text : theme.textSecondary}
                    >
                      {valueText}
                    </ThemedText>
                  ) : null}
                  <View
                    style={[
                      styles.bar,
                      {
                        height: h,
                        backgroundColor: overGoal
                          ? theme.warning
                          : isCurrent
                            ? theme.brand
                            : theme.brand + "55",
                      },
                    ]}
                  />
                </View>
                <View
                  style={[
                    styles.barDayWrap,
                    isCurrent &&
                      p.showLabel && {
                        backgroundColor: theme.brandSoft,
                      },
                  ]}
                >
                  <ThemedText
                    style={styles.barLabel}
                    color={isCurrent ? theme.brand : theme.textSecondary}
                  >
                    {p.showLabel ? p.label : ""}
                  </ThemedText>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <CardEmpty
          Icon={Flame}
          title="კალორიის მონაცემი არ არის"
          hint="დაამატე კვება რომ ნახო შენი დღიური ბალანსი."
          color="#FF7A45"
          tint={colorScheme === "dark" ? "#3A2010" : "#FEEDE2"}
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
  legendRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.sm,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 180,
    paddingTop: Spacing.sm,
    position: "relative",
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  barTrack: {
    width: 26,
    height: 130,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "100%",
    borderRadius: Radius.sm,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "700",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  barDayWrap: {
    paddingVertical: 2,
    borderRadius: Radius.sm,
    minWidth: 26,
    alignItems: "center",
  },
  goalLine: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  goalLineRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    opacity: 0.45,
  },
  goalLineLabelWrap: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radius.sm,
  },
  goalLineLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
