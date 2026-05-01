import BaseCard from "@/components/cards/BaseCard";
import { LineChart } from "@/components/charts/LineChart";
import { DayState, StreakGrid } from "@/components/charts/StreakGrid";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Activity,
  Award,
  Beef,
  Droplet,
  Flame,
  LucideIcon,
  Sparkles,
  Target,
  TrendingDown,
  Trophy,
  Wheat,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./_layout";

type Range = "week" | "month" | "quarter";

const RANGES: { key: Range; label: string }[] = [
  { key: "week", label: "კვირა" },
  { key: "month", label: "თვე" },
  { key: "quarter", label: "3 თვე" },
];

const CAL_GOAL = 2000;
const WEIGHT_GOAL = 75;

const DATA: Record<
  Range,
  {
    calories: number[];
    weight: number[];
    weightLabel: string;
    streak: DayState[];
    avgCal: number;
    weightChange: string;
    streakLabel: string;
  }
> = {
  week: {
    calories: [1850, 2050, 1720, 2200, 1980, 1640, 1820],
    weight: [80.8, 80.6, 80.4, 80.5, 80.2, 79.9, 80.0],
    weightLabel: "−0.8კგ კვირაში",
    streak: [
      "logged", "logged", "logged", "partial", "logged", "logged", "logged",
    ],
    avgCal: 1894,
    weightChange: "−0.8კგ",
    streakLabel: "7 დღე",
  },
  month: {
    calories: [1820, 1950, 1880, 2020, 1740, 1900, 2080,
               1830, 1990, 1880, 2150, 1780, 1620, 1900,
               1980, 1850, 1730, 2030, 1900, 1950, 1840,
               2050, 1860, 1720, 1980, 1900, 1820, 1890],
    weight: [82.4, 82.1, 81.9, 82.0, 81.7, 81.5, 81.4,
             81.2, 81.3, 81.0, 80.8, 80.9, 80.6, 80.4,
             80.5, 80.3, 80.1, 80.2, 80.0, 79.9, 80.0,
             79.8, 79.6, 79.7, 79.5, 79.3, 79.2, 79.0],
    weightLabel: "−3.4კგ თვეში",
    streak: [
      "logged","logged","logged","partial","logged","logged","missed",
      "logged","logged","logged","logged","partial","logged","logged",
      "logged","missed","logged","logged","logged","partial","logged",
      "logged","logged","logged","logged","logged","logged","logged",
    ],
    avgCal: 1891,
    weightChange: "−3.4კგ",
    streakLabel: "12 დღე",
  },
  quarter: {
    calories: Array.from({ length: 12 }, (_, i) =>
      1850 + Math.round(Math.sin(i / 2) * 180)
    ),
    weight: [85.1, 84.6, 84.0, 83.5, 83.0, 82.4, 81.8, 81.2, 80.6, 80.0, 79.4, 79.0],
    weightLabel: "−6.1კგ 3 თვეში",
    streak: [
      "logged","logged","partial","logged","logged","missed","logged",
      "logged","logged","logged","partial","logged","missed","logged",
      "logged","logged","logged","missed","logged","logged","partial",
      "logged","logged","logged","logged","missed","logged","logged",
    ],
    avgCal: 1873,
    weightChange: "−6.1კგ",
    streakLabel: "21 დღე",
  },
};

const WEEK_LABELS = ["ორ", "სა", "ოთ", "ხუ", "პა", "შა", "კვ"];

type InsightProps = {
  Icon: LucideIcon;
  title: string;
  body: string;
  color: string;
  tint: string;
};

const InsightCard = ({ Icon, title, body, color, tint }: InsightProps) => (
  <View style={[styles.insight, { borderLeftColor: color }]}>
    <View style={[styles.insightIcon, { backgroundColor: tint }]}>
      <Icon color={color} size={16} />
    </View>
    <View style={{ flex: 1, gap: 2 }}>
      <ThemedText style={styles.insightTitle}>{title}</ThemedText>
      <ThemedText type="secondary" style={styles.insightBody}>
        {body}
      </ThemedText>
    </View>
  </View>
);

function StatisticsPage() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [range, setRange] = useState<Range>("week");
  const d = DATA[range];

  const max = Math.max(...d.calories, CAL_GOAL) * 1.1;
  const onTargetDays = d.calories.filter((c) => c <= CAL_GOAL).length;

  const summary = [
    {
      Icon: Flame,
      label: "საშ. კალორია",
      value: `${d.avgCal}`,
      tint: colorScheme === "dark" ? "#3A2010" : "#FEEDE2",
      color: "#FF7A45",
    },
    {
      Icon: TrendingDown,
      label: "წონის ცვლა",
      value: d.weightChange,
      tint: colorScheme === "dark" ? "#1F3A28" : "#E6F6EA",
      color: "#34A867",
    },
    {
      Icon: Activity,
      label: "სტრიკი",
      value: d.streakLabel,
      tint: colorScheme === "dark" ? "#222B4A" : "#EEF0FB",
      color: "#5B6CE0",
    },
  ];

  const insights = useMemo(() => {
    const list: InsightProps[] = [];
    list.push({
      Icon: Flame,
      title: `${d.streakLabel}იანი სტრიკი`,
      body: "განაგრძე — შენი რუტინა მუშაობს.",
      color: "#FF7A45",
      tint: colorScheme === "dark" ? "#3A2010" : "#FEEDE2",
    });
    list.push({
      Icon: Target,
      title: `${onTargetDays}/${d.calories.length} დღე მიზანში`,
      body:
        onTargetDays / d.calories.length > 0.6
          ? "შესანიშნავი დისციპლინა — განაგრძე ასე."
          : "სცადე უფრო ხშირად ჩაეტიო კალორიის მიზანში.",
      color: "#5B6CE0",
      tint: colorScheme === "dark" ? "#222B4A" : "#EEF0FB",
    });
    if (d.weight.length >= 2) {
      const last = d.weight[d.weight.length - 1];
      const remaining = (last - WEIGHT_GOAL).toFixed(1);
      list.push({
        Icon: Sparkles,
        title: `მიზნამდე ${remaining}კგ`,
        body: `მიმდინარე ტემპით გრაფიკში ხარ ${range === "week" ? "5-6 კვირაში" : range === "month" ? "თვენახევარში" : "ერთ თვეში"}.`,
        color: "#7C5CFF",
        tint: colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE",
      });
    }
    return list;
  }, [d, onTargetDays, range, colorScheme]);

  const records = [
    {
      Icon: Trophy,
      label: "ყველაზე გრძელი სტრიკი",
      value: "21 დღე",
      color: "#FFB020",
    },
    {
      Icon: TrendingDown,
      label: "ყველაზე დაბალი წონა",
      value: `${Math.min(...d.weight).toFixed(1)}კგ`,
      color: "#34A867",
    },
    {
      Icon: Award,
      label: "საუკეთესო დღე",
      value: `${Math.min(...d.calories)} კალ`,
      color: "#5B6CE0",
    },
  ];

  const topFoods = [
    { name: "ქათამი", count: 14, color: "#7C5CFF" },
    { name: "ბრინჯი", count: 11, color: "#F5A623" },
    { name: "ავოკადო", count: 9, color: "#34A867" },
    { name: "ბერძნული იოგურტი", count: 8, color: "#3FA9F5" },
    { name: "შვრიის ფაფა", count: 6, color: "#FF7A45" },
  ];
  const topMax = Math.max(...topFoods.map((f) => f.count));

  return (
    <ScrollView
      style={{ backgroundColor: theme.surface }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <GradientView
        colors={[theme.brandDeep, theme.brand]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius={Radius.xl}
        style={styles.headerContainer}
      >
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View style={{ gap: 4 }}>
            <ThemedText style={styles.headerTitle} color="#FFFFFF">
              შენი მოგზაურობა
            </ThemedText>
            <ThemedText
              style={styles.headerSubtitle}
              color="rgba(255,255,255,0.85)"
            >
              {d.weightLabel} · {d.streakLabel}იანი სტრიკი
            </ThemedText>
          </View>

          <View style={styles.rangeRow}>
            {RANGES.map((r) => {
              const isActive = r.key === range;
              return (
                <TouchableOpacity
                  key={r.key}
                  onPress={() => setRange(r.key)}
                  activeOpacity={0.85}
                  style={[
                    styles.rangeChip,
                    {
                      backgroundColor: isActive
                        ? "#FFFFFF"
                        : "rgba(255,255,255,0.18)",
                    },
                  ]}
                >
                  <ThemedText
                    style={styles.rangeChipLabel}
                    color={isActive ? theme.brand : "#FFFFFF"}
                  >
                    {r.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </SafeAreaView>
      </GradientView>

      <View style={styles.body}>
        <View style={styles.summaryRow}>
          {summary.map(({ Icon, label, value, tint, color }) => (
            <BaseCard key={label} style={styles.summaryCard}>
              <View style={[styles.summaryIcon, { backgroundColor: tint }]}>
                <Icon color={color} size={18} />
              </View>
              <ThemedText style={styles.summaryValue}>{value}</ThemedText>
              <ThemedText type="secondary" style={styles.summaryLabel}>
                {label}
              </ThemedText>
            </BaseCard>
          ))}
        </View>

        <BaseCard>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>ინსაითი</ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              {range === "week" ? "ეს კვირა" : range === "month" ? "ეს თვე" : "ბოლო 3 თვე"}
            </ThemedText>
          </View>
          <View style={{ gap: Spacing.md }}>
            {insights.map((ins) => (
              <InsightCard key={ins.title} {...ins} />
            ))}
          </View>
        </BaseCard>

        <BaseCard>
          <View style={styles.cardHeader}>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>წონის დინამიკა</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                მიზანი {WEIGHT_GOAL}კგ
              </ThemedText>
            </View>
            <View style={[styles.deltaBadge, { backgroundColor: "#E6F6EA" }]}>
              <TrendingDown color="#34A867" size={12} />
              <ThemedText style={styles.deltaText} color="#34A867">
                {d.weightChange}
              </ThemedText>
            </View>
          </View>
          <LineChart
            values={d.weight}
            color={theme.brand}
            goal={WEIGHT_GOAL}
            goalColor={theme.textSecondary}
            height={140}
          />
          <View style={styles.weightFooter}>
            <View>
              <ThemedText type="secondary" style={styles.weightLabel}>
                მიმდინარე
              </ThemedText>
              <ThemedText style={styles.weightValue}>
                {d.weight[d.weight.length - 1].toFixed(1)}კგ
              </ThemedText>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <ThemedText type="secondary" style={styles.weightLabel}>
                მიზანი
              </ThemedText>
              <ThemedText style={styles.weightValue} color={theme.brand}>
                {WEIGHT_GOAL}კგ
              </ThemedText>
            </View>
          </View>
        </BaseCard>

        <BaseCard>
          <View style={styles.cardHeader}>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>კვირის კალორია</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                მიზანი {CAL_GOAL} კალ/დღეში
              </ThemedText>
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: theme.brand }]} />
                <ThemedText style={styles.legendText} type="secondary">
                  დღეს
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
          {(() => {
            const bars =
              range === "week" ? d.calories : d.calories.slice(-7);
            const goalLineTop = Spacing.sm + (1 - CAL_GOAL / max) * 130;
            return (
              <View style={styles.chart}>
                <View
                  pointerEvents="none"
                  style={[styles.goalLine, { top: goalLineTop }]}
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
                    <ThemedText
                      style={styles.goalLineLabel}
                      type="secondary"
                    >
                      {CAL_GOAL}
                    </ThemedText>
                  </View>
                </View>
                {bars.map((v, i) => {
                  const h = (v / max) * 130;
                  const overGoal = v > CAL_GOAL;
                  const isToday = i === bars.length - 1;
                  const valueText =
                    v >= 1000 ? `${(v / 1000).toFixed(1)}კ` : `${v}`;
                  return (
                    <View key={i} style={styles.barCol}>
                      <View style={styles.barTrack}>
                        <ThemedText
                          style={styles.barValue}
                          color={
                            isToday ? theme.text : theme.textSecondary
                          }
                        >
                          {valueText}
                        </ThemedText>
                        <View
                          style={[
                            styles.bar,
                            {
                              height: h,
                              backgroundColor: overGoal
                                ? theme.warning
                                : isToday
                                  ? theme.brand
                                  : theme.brand + "55",
                            },
                          ]}
                        />
                      </View>
                      <View
                        style={[
                          styles.barDayWrap,
                          isToday && {
                            backgroundColor: theme.brandSoft,
                          },
                        ]}
                      >
                        <ThemedText
                          style={styles.barLabel}
                          color={
                            isToday ? theme.brand : theme.textSecondary
                          }
                        >
                          {WEEK_LABELS[i % 7]}
                        </ThemedText>
                      </View>
                    </View>
                  );
                })}
              </View>
            );
          })()}
        </BaseCard>

        <BaseCard>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>მაკრო ბალანსი</ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              {range === "week" ? "7 დღის" : range === "month" ? "30 დღის" : "90 დღის"} საშუალო
            </ThemedText>
          </View>
          <View style={{ gap: Spacing.md }}>
            {[
              {
                Icon: Beef,
                label: "ცილა",
                pct: 28,
                color: theme.macroProtein,
              },
              {
                Icon: Wheat,
                label: "ნახშირწყალი",
                pct: 48,
                color: theme.macroCarbs,
              },
              {
                Icon: Droplet,
                label: "ცხიმი",
                pct: 24,
                color: theme.macroFat,
              },
            ].map(({ Icon, label, pct, color }) => (
              <View key={label} style={{ gap: Spacing.xs + 2 }}>
                <View style={styles.macroRow}>
                  <View style={[styles.macroLabel]}>
                    <Icon color={color} size={14} />
                    <ThemedText style={styles.macroLabelText}>
                      {label}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.macroPct} type="secondary">
                    {pct}%
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.macroTrack,
                    { backgroundColor: theme.borderLight },
                  ]}
                >
                  <View
                    style={[
                      styles.macroFill,
                      { width: `${pct}%`, backgroundColor: color },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </BaseCard>

        <BaseCard>
          <View style={styles.cardHeader}>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>ლოგინგ სტრიკი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                ბოლო {d.streak.length} დღე
              </ThemedText>
            </View>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: theme.brand }]}
                />
                <ThemedText style={styles.legendText} type="secondary">
                  ჩაწერილი
                </ThemedText>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: theme.brand + "55" },
                  ]}
                />
                <ThemedText style={styles.legendText} type="secondary">
                  ნაწილობრ.
                </ThemedText>
              </View>
            </View>
          </View>
          <StreakGrid
            days={d.streak}
            color={theme.brand}
            partialColor={theme.brand + "55"}
            mutedColor={theme.borderLight}
          />
        </BaseCard>

        <BaseCard>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>ხშირი საკვები</ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              ბოლო {range === "week" ? "7" : range === "month" ? "30" : "90"} დღე
            </ThemedText>
          </View>
          <View style={{ gap: Spacing.md }}>
            {topFoods.map((f, i) => (
              <View key={f.name} style={{ gap: Spacing.xs + 2 }}>
                <View style={styles.macroRow}>
                  <View style={styles.foodLabel}>
                    <View
                      style={[
                        styles.foodRank,
                        { backgroundColor: theme.borderLight },
                      ]}
                    >
                      <ThemedText style={styles.foodRankText} type="secondary">
                        {i + 1}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.foodName}>{f.name}</ThemedText>
                  </View>
                  <ThemedText style={styles.foodCount} type="secondary">
                    {f.count}×
                  </ThemedText>
                </View>
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
                        width: `${(f.count / topMax) * 100}%`,
                        backgroundColor: f.color,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </BaseCard>

        <BaseCard>
          <View style={styles.cardHeader}>
            <ThemedText style={styles.cardTitle}>რეკორდები</ThemedText>
          </View>
          <View style={{ gap: Spacing.sm }}>
            {records.map(({ Icon, label, value, color }) => (
              <View key={label} style={styles.recordRow}>
                <View
                  style={[
                    styles.recordIcon,
                    { backgroundColor: color + "20" },
                  ]}
                >
                  <Icon color={color} size={16} />
                </View>
                <ThemedText style={styles.recordLabel}>{label}</ThemedText>
                <ThemedText style={styles.recordValue} color={color}>
                  {value}
                </ThemedText>
              </View>
            ))}
          </View>
        </BaseCard>
      </View>
    </ScrollView>
  );
}

export default StatisticsPage;

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: Spacing.xxxl,
  },
  headerSafe: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  headerTitle: {
    fontSize: Type.xxl,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: Type.sm,
  },
  rangeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  rangeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  rangeChipLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  body: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  summaryRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.sm,
    alignItems: "flex-start",
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryValue: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  summaryLabel: {
    fontSize: Type.xs,
  },
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
  insight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 3,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  insightBody: {
    fontSize: Type.sm,
    lineHeight: 18,
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
  weightFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  weightLabel: {
    fontSize: Type.xs,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  weightValue: {
    fontSize: Type.xl,
    fontWeight: "700",
    marginTop: 2,
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
    paddingHorizontal: 6,
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
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  macroLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  macroLabelText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  macroPct: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  macroTrack: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  foodLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  foodRank: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  foodRankText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  foodName: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  foodCount: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  recordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  recordIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  recordLabel: {
    flex: 1,
    fontSize: Type.sm,
    fontWeight: "600",
  },
  recordValue: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
