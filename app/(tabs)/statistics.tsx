import { getProfile } from "@/api/profile";
import {
  getCaloriesSeries,
  getInsights,
  getMacrosSeries,
  getRecords,
  getStreak,
  getSummary,
  getTopFoods,
  getWeightSeries,
} from "@/api/stats";
import type { Range as ApiRange } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import { LineChart } from "@/components/charts/LineChart";
import { DayState, StreakGrid } from "@/components/charts/StreakGrid";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  Activity,
  Award,
  Beef,
  Droplet,
  Flame,
  LucideIcon,
  Plus,
  Scale,
  Sparkles,
  Target,
  TrendingDown,
  Trophy,
  UtensilsCrossed,
  Wheat,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./_layout";

type UiRange = "week" | "month" | "quarter";

const RANGES: { key: UiRange; label: string }[] = [
  { key: "week", label: "კვირა" },
  { key: "month", label: "თვე" },
  { key: "quarter", label: "3 თვე" },
];

const UI_TO_API_RANGE: Record<UiRange, ApiRange> = {
  week: "week",
  month: "month",
  quarter: "year",
};

const QUARTER_DAYS = 90;
const WEEK_LABELS_KA = ["კვ", "ორ", "სა", "ოთ", "ხუ", "პა", "შა"];
const MIN_DAYS_FOR_TREND = 3;

const TOP_FOOD_PALETTE = [
  "#7C5CFF",
  "#F5A623",
  "#34A867",
  "#3FA9F5",
  "#FF7A45",
  "#E85A8C",
];

const SEVERITY_STYLES: Record<
  NonNullable<import("@/api/stats").Insight["severity"]>,
  { color: string; tint: string; tintDark: string; Icon: LucideIcon }
> = {
  positive: {
    color: "#34A867",
    tint: "#E6F6EA",
    tintDark: "#1F3A28",
    Icon: Sparkles,
  },
  warning: {
    color: "#FF7A45",
    tint: "#FEEDE2",
    tintDark: "#3A2010",
    Icon: Flame,
  },
  info: {
    color: "#5B6CE0",
    tint: "#EEF0FB",
    tintDark: "#222B4A",
    Icon: Target,
  },
};

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

function dayStateForCalories(
  kcal: number,
  onTarget: boolean,
  goal: number,
): DayState {
  if (!kcal) return "missed";
  if (onTarget) return "logged";
  if (goal && kcal < goal * 0.5) return "partial";
  return "logged";
}

function weekdayShort(dateStr: string | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return WEEK_LABELS_KA[d.getDay()] ?? "";
}

function formatChange(kg: number | undefined) {
  if (kg == null) return "—";
  const sign = kg > 0 ? "+" : kg < 0 ? "−" : "";
  return `${sign}${Math.abs(kg).toFixed(1)}კგ`;
}

export default function StatisticsPage() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [range, setRange] = useState<UiRange>("week");
  const apiRange = UI_TO_API_RANGE[range];

  const profileQuery = useQuery({
    queryKey: ["Profile"] as const,
    queryFn: getProfile,
  });
  const profile = profileQuery.data?.data;
  const calGoal = profile?.daily_calorie_target ?? 2000;
  const weightGoal = profile?.target_weight_kg ?? null;

  const summaryQuery = useQuery({
    queryKey: ["stats", "summary", apiRange],
    queryFn: () => getSummary(apiRange),
  });
  const caloriesQuery = useQuery({
    queryKey: ["stats", "calories", apiRange],
    queryFn: () => getCaloriesSeries(apiRange),
  });
  const weightQuery = useQuery({
    queryKey: ["stats", "weight", apiRange],
    queryFn: () => getWeightSeries(apiRange),
  });
  const macrosQuery = useQuery({
    queryKey: ["stats", "macros", apiRange],
    queryFn: () => getMacrosSeries(apiRange),
  });
  const streakQuery = useQuery({
    queryKey: ["stats", "streak", apiRange],
    queryFn: () => getStreak(apiRange),
  });
  const topFoodsQuery = useQuery({
    queryKey: ["stats", "top-foods", apiRange],
    queryFn: () => getTopFoods(apiRange),
  });
  const recordsQuery = useQuery({
    queryKey: ["stats", "records"],
    queryFn: getRecords,
  });
  const insightsQuery = useQuery({
    queryKey: ["stats", "insights", apiRange],
    queryFn: () => getInsights(apiRange),
  });

  const summary = summaryQuery.data?.data;

  const caloriesSeries = useMemo(() => {
    const raw = caloriesQuery.data?.data;
    const all = Array.isArray(raw) ? raw : [];
    if (range === "quarter") return all.slice(-QUARTER_DAYS);
    return all;
  }, [caloriesQuery.data, range]);

  const weightSeries = useMemo(() => {
    const raw = weightQuery.data?.data;
    const all = Array.isArray(raw) ? raw : [];
    if (range === "quarter") return all.slice(-QUARTER_DAYS);
    return all;
  }, [weightQuery.data, range]);

  const macrosSeries = useMemo(() => {
    const raw = macrosQuery.data?.data;
    const all = Array.isArray(raw) ? raw : [];
    if (range === "quarter") return all.slice(-QUARTER_DAYS);
    return all;
  }, [macrosQuery.data, range]);

  const streakDays: DayState[] = useMemo(
    () =>
      caloriesSeries.map((p) =>
        dayStateForCalories(p.kcal, p.on_target, calGoal),
      ),
    [caloriesSeries, calGoal],
  );

  const onTargetDays = useMemo(
    () => caloriesSeries.filter((p) => p.on_target).length,
    [caloriesSeries],
  );

  const loggedDays = useMemo(
    () => caloriesSeries.filter((p) => p.kcal > 0).length,
    [caloriesSeries],
  );
  const hasTrendData = loggedDays >= MIN_DAYS_FOR_TREND;

  const macroAverages = useMemo(() => {
    if (!macrosSeries.length) {
      return { proteinG: 0, carbsG: 0, fatG: 0 };
    }
    const totals = macrosSeries.reduce(
      (acc, m) => ({
        proteinG: acc.proteinG + m.protein_g,
        carbsG: acc.carbsG + m.carbs_g,
        fatG: acc.fatG + m.fat_g,
      }),
      { proteinG: 0, carbsG: 0, fatG: 0 },
    );
    const n = macrosSeries.length;
    return {
      proteinG: totals.proteinG / n,
      carbsG: totals.carbsG / n,
      fatG: totals.fatG / n,
    };
  }, [macrosSeries]);

  const macroPcts = useMemo(() => {
    const proteinKcal = macroAverages.proteinG * 4;
    const carbsKcal = macroAverages.carbsG * 4;
    const fatKcal = macroAverages.fatG * 9;
    const total = proteinKcal + carbsKcal + fatKcal;
    if (!total) return { protein: 0, carbs: 0, fat: 0 };
    return {
      protein: Math.round((proteinKcal / total) * 100),
      carbs: Math.round((carbsKcal / total) * 100),
      fat: Math.round((fatKcal / total) * 100),
    };
  }, [macroAverages]);

  const summaryCards = [
    {
      Icon: Flame,
      label: "საშ. კალორია",
      value: summary?.kcal_avg ? Math.round(summary.kcal_avg).toString() : "—",
      tint: colorScheme === "dark" ? "#3A2010" : "#FEEDE2",
      color: "#FF7A45",
    },
    {
      Icon: TrendingDown,
      label: "წონის ცვლა",
      value: formatChange(summary?.weight_change_kg),
      tint: colorScheme === "dark" ? "#1F3A28" : "#E6F6EA",
      color: "#34A867",
    },
    {
      Icon: Activity,
      label: "სტრიკი",
      value: `${streakQuery.data?.data.current ?? summary?.streak_days ?? 0} დღე`,
      tint: colorScheme === "dark" ? "#222B4A" : "#EEF0FB",
      color: "#5B6CE0",
    },
  ];

  const insights = useMemo<InsightProps[]>(() => {
    const rawInsights = insightsQuery.data?.data;
    const apiInsights = Array.isArray(rawInsights) ? rawInsights : [];
    if (apiInsights.length) {
      return apiInsights.map((i) => {
        const sev = i.severity ?? "info";
        const s = SEVERITY_STYLES[sev];
        return {
          Icon: s.Icon,
          title: i.title,
          body: i.body,
          color: s.color,
          tint: colorScheme === "dark" ? s.tintDark : s.tint,
        };
      });
    }
    const fallback: InsightProps[] = [];
    const streakValue =
      streakQuery.data?.data.current ?? summary?.streak_days ?? 0;
    if (streakValue > 0) {
      fallback.push({
        Icon: Flame,
        title: `${streakValue} დღიანი სტრიკი`,
        body: "განაგრძე — შენი რუტინა მუშაობს.",
        color: "#FF7A45",
        tint: colorScheme === "dark" ? "#3A2010" : "#FEEDE2",
      });
    }
    if (loggedDays >= MIN_DAYS_FOR_TREND) {
      fallback.push({
        Icon: Target,
        title: `${onTargetDays}/${loggedDays} დღე მიზანში`,
        body:
          onTargetDays / loggedDays > 0.6
            ? "შესანიშნავი დისციპლინა — განაგრძე ასე."
            : "სცადე უფრო ხშირად ჩაეტიო კალორიის მიზანში.",
        color: "#5B6CE0",
        tint: colorScheme === "dark" ? "#222B4A" : "#EEF0FB",
      });
    }
    if (weightSeries.length >= MIN_DAYS_FOR_TREND && weightGoal != null) {
      const last = weightSeries[weightSeries.length - 1].value;
      const remaining = (last - weightGoal).toFixed(1);
      fallback.push({
        Icon: Sparkles,
        title: `მიზნამდე ${remaining}კგ`,
        body: "მიმდინარე ტემპს თუ შეინარჩუნებ — მიზანი მისაღწევია.",
        color: "#7C5CFF",
        tint: colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE",
      });
    }
    return fallback;
  }, [
    insightsQuery.data,
    streakQuery.data,
    summary,
    loggedDays,
    onTargetDays,
    weightSeries,
    weightGoal,
    colorScheme,
  ]);

  const records = useMemo(() => {
    const r = recordsQuery.data?.data;
    return [
      {
        Icon: Trophy,
        label: "ყველაზე გრძელი სტრიკი",
        value: r ? `${r.longest_streak} დღე` : "—",
        color: "#FFB020",
      },
      {
        Icon: TrendingDown,
        label: "ყველაზე დაბალი წონა",
        value:
          r?.lowest_weight_kg != null
            ? `${r.lowest_weight_kg.toFixed(1)}კგ`
            : "—",
        color: "#34A867",
      },
      {
        Icon: Award,
        label: "საუკეთესო დღე",
        value: r?.best_logging_day
          ? `${r.best_logging_day.entries} ჩანაწერი`
          : "—",
        color: "#5B6CE0",
      },
    ];
  }, [recordsQuery.data]);

  const topFoods = useMemo(() => {
    const raw = topFoodsQuery.data?.data;
    const list = Array.isArray(raw) ? raw : [];
    return list.map((f, i) => ({
      name: f.name,
      count: f.count,
      color: TOP_FOOD_PALETTE[i % TOP_FOOD_PALETTE.length],
    }));
  }, [topFoodsQuery.data]);
  const topMax = topFoods.length
    ? Math.max(...topFoods.map((f) => f.count))
    : 0;

  // Calorie bars:
  //   week    → 7 daily bars (raw kcal)
  //   month   → 4 weekly bars (avg kcal/day across *logged* days in that week)
  //   quarter → 12 weekly bars (same averaging — avg per logged day so sparse
  //             logging doesn't drag bars below the daily-goal line)
  const calorieBars = useMemo<
    { key: string; kcal: number; label: string; showLabel: boolean }[]
  >(() => {
    if (range === "week") {
      return caloriesSeries.map((p, i) => ({
        key: p.date ?? `${i}`,
        kcal: Number(p.kcal) || 0,
        label: weekdayShort(p.date) || `${i + 1}`,
        showLabel: true,
      }));
    }
    const bucketCount = range === "month" ? 4 : 12;
    const len = caloriesSeries.length;
    if (len === 0) return [];
    const size = Math.ceil(len / bucketCount);
    const buckets: {
      key: string;
      kcal: number;
      label: string;
      showLabel: boolean;
    }[] = [];
    for (let i = 0; i < bucketCount; i++) {
      const slice = caloriesSeries.slice(i * size, (i + 1) * size);
      if (slice.length === 0) continue;
      const logged = slice.filter((p) => p.kcal > 0);
      const avg = logged.length
        ? Math.round(
            logged.reduce((a, p) => a + (Number(p.kcal) || 0), 0) /
              logged.length,
          )
        : 0;
      buckets.push({
        key: `wk-${i}`,
        kcal: avg,
        label: range === "month" ? `კვ ${i + 1}` : `${i + 1}`,
        showLabel: true,
      });
    }
    return buckets;
  }, [caloriesSeries, range]);
  const barMax = calorieBars.length
    ? Math.max(...calorieBars.map((b) => b.kcal), calGoal) * 1.1
    : calGoal * 1.1;

  const lastWeight = weightSeries.length
    ? weightSeries[weightSeries.length - 1].value
    : null;
  const weightLabelText =
    summary?.weight_change_kg != null
      ? `${formatChange(summary.weight_change_kg)} ${range === "week" ? "კვირაში" : range === "month" ? "თვეში" : "3 თვეში"}`
      : "მონაცემი არ არის";

  const isInitialLoading =
    summaryQuery.isLoading && caloriesQuery.isLoading && weightQuery.isLoading;

  const hasAnyCalories = caloriesSeries.some((p) => p.kcal > 0);
  const hasAnyWeight = weightSeries.length > 0;
  const hasAnyTopFoods = topFoods.length > 0;
  const currentStreak =
    streakQuery.data?.data.current ?? summary?.streak_days ?? 0;
  const isTotallyEmpty =
    !isInitialLoading &&
    !hasAnyCalories &&
    !hasAnyWeight &&
    !hasAnyTopFoods &&
    currentStreak === 0 &&
    !summary?.kcal_avg;

  const EmptyCardBody = ({
    Icon,
    title,
    hint,
    color,
    tint,
  }: {
    Icon: LucideIcon;
    title: string;
    hint?: string;
    color: string;
    tint: string;
  }) => (
    <View style={styles.cardEmpty}>
      <View style={[styles.cardEmptyIcon, { backgroundColor: tint }]}>
        <Icon color={color} size={22} />
      </View>
      <ThemedText style={styles.cardEmptyTitle}>{title}</ThemedText>
      {hint ? (
        <ThemedText type="secondary" style={styles.cardEmptyHint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );

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
              {weightLabelText} ·{" "}
              {streakQuery.data?.data.current ?? summary?.streak_days ?? 0}{" "}
              დღიანი სტრიკი
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
        {isInitialLoading ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator color={theme.brand} />
          </View>
        ) : null}

        {isTotallyEmpty ? (
          <View
            style={[
              styles.heroEmpty,
              { backgroundColor: theme.card, borderColor: theme.borderLight },
            ]}
          >
            <View
              style={[
                styles.heroEmptyIcon,
                { backgroundColor: theme.brandSoft },
              ]}
            >
              <Activity color={theme.brand} size={32} />
            </View>
            <ThemedText style={styles.heroEmptyTitle}>
              ჯერ მონაცემი არ გაქვს
            </ThemedText>
            <ThemedText type="secondary" style={styles.heroEmptyBody}>
              დაიწყე კვების ჩაწერა და აქ დაინახავ კალორიის, წონის და
              მაკრო-ნუტრიენტების დინამიკას.
            </ThemedText>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/add")}
              style={[styles.heroEmptyCta, { backgroundColor: theme.brand }]}
            >
              <Plus color={theme.textOnBrand} size={18} />
              <ThemedText
                style={styles.heroEmptyCtaText}
                color={theme.textOnBrand}
              >
                დაიწყე ჩაწერა
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.summaryRow}>
              {summaryCards.map(({ Icon, label, value, tint, color }) => (
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

            {insights.length > 0 && (
              <BaseCard>
                <View style={styles.cardHeader}>
                  <ThemedText style={styles.cardTitle}>ინსაითი</ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    {range === "week"
                      ? "ეს კვირა"
                      : range === "month"
                        ? "ეს თვე"
                        : "ბოლო 3 თვე"}
                  </ThemedText>
                </View>
                <View style={{ gap: Spacing.md }}>
                  {insights.map((ins) => (
                    <InsightCard key={ins.title} {...ins} />
                  ))}
                </View>
              </BaseCard>
            )}

            <BaseCard>
              <View style={styles.cardHeader}>
                <View style={{ gap: 2 }}>
                  <ThemedText style={styles.cardTitle}>
                    წონის დინამიკა
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    {weightGoal != null
                      ? `მიზანი ${weightGoal}კგ`
                      : "მიზანი დაყენებული არ არის"}
                  </ThemedText>
                </View>
                {summary?.weight_change_kg != null && (
                  <View
                    style={[styles.deltaBadge, { backgroundColor: "#E6F6EA" }]}
                  >
                    <TrendingDown color="#34A867" size={12} />
                    <ThemedText style={styles.deltaText} color="#34A867">
                      {formatChange(summary.weight_change_kg)}
                    </ThemedText>
                  </View>
                )}
              </View>
              {weightSeries.length > 2 ? (
                <>
                  <LineChart
                    values={weightSeries.map((p) => p.value)}
                    color={theme.brand}
                    goal={weightGoal ?? undefined}
                    goalColor={theme.textSecondary}
                    height={140}
                  />
                  <View style={styles.weightFooter}>
                    <View>
                      <ThemedText type="secondary" style={styles.weightLabel}>
                        მიმდინარე
                      </ThemedText>
                      <ThemedText style={styles.weightValue}>
                        {lastWeight?.toFixed(1)}კგ
                      </ThemedText>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                      <ThemedText type="secondary" style={styles.weightLabel}>
                        მიზანი
                      </ThemedText>
                      <ThemedText
                        style={styles.weightValue}
                        color={theme.brand}
                      >
                        {weightGoal != null ? `${weightGoal}კგ` : "—"}
                      </ThemedText>
                    </View>
                  </View>
                </>
              ) : (
                <EmptyCardBody
                  Icon={Scale}
                  title="წონის ჩანაწერი არ არის"
                  hint="ჩაწერე შენი წონა და ნახე დინამიკა გრაფიკზე."
                  color="#34A867"
                  tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
                />
              )}
            </BaseCard>

            <BaseCard>
              <View style={styles.cardHeader}>
                <View style={{ gap: 2 }}>
                  <ThemedText style={styles.cardTitle}>
                    {range === "week"
                      ? "კვირის კალორია"
                      : range === "month"
                        ? "თვის კალორია"
                        : "3 თვის კალორია"}
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    {range === "week"
                      ? `მიზანი ${calGoal} კალ/დღეში`
                      : `საშ. კალ/დღე · მიზანი ${calGoal}`}
                  </ThemedText>
                </View>
                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: theme.brand },
                      ]}
                    />
                    <ThemedText style={styles.legendText} type="secondary">
                      {range === "week" ? "დღეს" : "მიმდ."}
                    </ThemedText>
                  </View>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: theme.warning },
                      ]}
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
                  {(() => {
                    // Bar width shrinks as count grows so 30 daily bars still fit.
                    const count = calorieBars.length;
                    const barWidth = count <= 7 ? 26 : count <= 12 ? 18 : 7;
                    const showValueText = count <= 7;
                    return calorieBars.map((p, i) => {
                      const v = p.kcal;
                      const h = (v / barMax) * 130;
                      const overGoal = v > calGoal;
                      const isCurrent = i === calorieBars.length - 1;
                      const valueText =
                        v >= 1000 ? `${(v / 1000).toFixed(1)}კ` : `${v}`;
                      return (
                        <View key={p.key} style={styles.barCol}>
                          <View style={[styles.barTrack, { width: barWidth }]}>
                            {showValueText && v > 0 ? (
                              <ThemedText
                                style={styles.barValue}
                                color={
                                  isCurrent ? theme.text : theme.textSecondary
                                }
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
                              color={
                                isCurrent ? theme.brand : theme.textSecondary
                              }
                            >
                              {p.showLabel ? p.label : ""}
                            </ThemedText>
                          </View>
                        </View>
                      );
                    });
                  })()}
                </View>
              ) : (
                <EmptyCardBody
                  Icon={Flame}
                  title="კალორიის მონაცემი არ არის"
                  hint="დაამატე კვება რომ ნახო შენი დღიური ბალანსი."
                  color="#FF7A45"
                  tint={colorScheme === "dark" ? "#3A2010" : "#FEEDE2"}
                />
              )}
            </BaseCard>

            <BaseCard>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>მაკრო ბალანსი</ThemedText>
                <ThemedText type="secondary" style={styles.cardCaption}>
                  {range === "week"
                    ? "7 დღის"
                    : range === "month"
                      ? "30 დღის"
                      : "90 დღის"}{" "}
                  საშუალო
                </ThemedText>
              </View>
              {hasTrendData ? (
                <View style={{ gap: Spacing.md }}>
                  {[
                    {
                      Icon: Beef,
                      label: "ცილა",
                      pct: macroPcts.protein,
                      color: theme.macroProtein,
                    },
                    {
                      Icon: Wheat,
                      label: "ნახშირწყალი",
                      pct: macroPcts.carbs,
                      color: theme.macroCarbs,
                    },
                    {
                      Icon: Droplet,
                      label: "ცხიმი",
                      pct: macroPcts.fat,
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
              ) : (
                <EmptyCardBody
                  Icon={Beef}
                  title="ჯერ საკმარისი მონაცემი არ არის"
                  hint={`დააფიქსირე ${MIN_DAYS_FOR_TREND} დღის კვება რომ ნახო შენი მაკრო ბალანსი.`}
                  color={theme.macroProtein}
                  tint={colorScheme === "dark" ? "#3A1A1A" : "#FCEAEA"}
                />
              )}
            </BaseCard>

            <BaseCard>
              <View style={styles.cardHeader}>
                <View style={{ gap: 2 }}>
                  <ThemedText style={styles.cardTitle}>
                    ლოგინგ სტრიკი
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    ბოლო {streakDays.length} დღე
                  </ThemedText>
                </View>

                <View style={styles.legendRow}>
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: theme.brand },
                      ]}
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
              {streakDays.length ? (
                <StreakGrid
                  days={streakDays}
                  color={theme.brand}
                  partialColor={theme.brand + "55"}
                  mutedColor={theme.borderLight}
                />
              ) : (
                <EmptyCardBody
                  Icon={Activity}
                  title="სტრიკი ჯერ არ გაქვს"
                  hint="ყოველდღე ჩაწერე საკვები რომ აიგო სტრიკი."
                  color="#5B6CE0"
                  tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
                />
              )}
            </BaseCard>

            <BaseCard>
              <View style={styles.cardHeader}>
                <ThemedText style={styles.cardTitle}>ხშირი საკვები</ThemedText>
                <ThemedText type="secondary" style={styles.cardCaption}>
                  ბოლო{" "}
                  {range === "week" ? "7" : range === "month" ? "30" : "90"} დღე
                </ThemedText>
              </View>
              {topFoods.length && hasTrendData ? (
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
                            <ThemedText
                              style={styles.foodRankText}
                              type="secondary"
                            >
                              {i + 1}
                            </ThemedText>
                          </View>
                          <ThemedText style={styles.foodName}>
                            {f.name}
                          </ThemedText>
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
              ) : (
                <EmptyCardBody
                  Icon={UtensilsCrossed}
                  title="საკვების ჩანაწერი არ არის"
                  hint="ჩაწერილი საკვებები რეიტინგულად აქ გამოჩნდება."
                  color="#7C5CFF"
                  tint={colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE"}
                />
              )}
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
          </>
        )}
      </View>
    </ScrollView>
  );
}

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
  loaderRow: {
    paddingVertical: Spacing.lg,
    alignItems: "center",
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
  emptyHint: {
    fontSize: Type.sm,
    textAlign: "center",
    paddingVertical: Spacing.md,
  },
  cardEmpty: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  cardEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  cardEmptyTitle: {
    fontSize: Type.base,
    fontWeight: "700",
    textAlign: "center",
  },
  cardEmptyHint: {
    fontSize: Type.xs,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.md,
  },
  heroEmpty: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  heroEmptyIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  heroEmptyTitle: {
    fontSize: Type.xl,
    fontWeight: "800",
    textAlign: "center",
  },
  heroEmptyBody: {
    fontSize: Type.sm,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  heroEmptyCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  heroEmptyCtaText: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
