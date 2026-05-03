import { listRecipes } from "@/api/recipes";
import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import { LineChart } from "@/components/charts/LineChart";
import {
  PaywallBlur,
  PaywallBlurOverlay,
} from "@/components/premium/PaywallBlur";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { usePremium } from "@/hooks/use-premium";
import { useStats } from "@/hooks/use-stats";
import { formatWeightChange } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Eye,
  RefreshCw,
  Sparkles,
  Star,
  Target,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Static placeholder values used by sections that need backend support
// before they can be real (week-over-week deltas, projection math). When
// the API ships, these become props from a /v1/coach/weekly response.
const STATIC = {
  compare: {
    kcal: { now: 1847, prev: 1923 },
    protein: { now: 132, prev: 124 },
    days: { now: 6, prev: 4 },
    weight: { now: 81.2, prev: 81.6 },
  },
  trajectory: {
    weeks: 11,
    series: [82.4, 82.1, 82.0, 81.7, 81.5, 81.3, 81.2],
    targetKg: 78,
  },
};

export default function CoachScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const stats = useStats();
  const toast = useToast();
  const [refreshing, setRefreshing] = useState(false);

  const name = user?.profile?.name || t("coach.defaultName");
  const streak = stats.currentStreak ?? 0;
  const kcalAvg = stats.summary?.kcal_avg
    ? Math.round(stats.summary.kcal_avg)
    : null;
  const kcalTarget = user?.goals?.daily_calorie_target ?? null;
  const weightChangeKg = stats.summary?.weight_change_kg ?? null;
  const weightChangeFmt = formatWeightChange(
    stats.summary?.weight_change_kg,
    ` ${t("weight.kg")}`,
  );

  const headline = buildHeadline({
    t,
    kcalAvg,
    kcalTarget,
    weightChangeKg,
  });

  const recipesQuery = useQuery({
    queryKey: ["recipes", "coach-picks"],
    queryFn: () => listRecipes({ limit: 6 }),
    staleTime: 60 * 60_000,
  });
  const recipes: Recipe[] = recipesQuery.data?.data?.slice(0, 5) ?? [];

  const actionItems =
    (t("coach.actionItems", { returnObjects: true }) as string[]) ?? [];

  const onRegenerate = async () => {
    // Placeholder: real implementation will call /v1/coach/refresh which
    // triggers a server-side LLM run. For now we just refetch stats so the
    // metrics block updates and confirm with a toast.
    setRefreshing(true);
    try {
      await stats.refetch?.();
      toast.success(t("coach.regeneratedToast"));
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: theme.background }}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.borderLight,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: theme.borderLight }]}
            hitSlop={6}
            activeOpacity={0.6}
          >
            <ChevronLeft color={theme.text} size={20} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {t("coach.title")}
            </ThemedText>
            <ThemedText style={styles.subtitle} type="secondary">
              {t("coach.subtitle")}
            </ThemedText>
          </View>
          <View style={styles.rightSlot}>
            {isPremium ? (
              <TouchableOpacity
                onPress={onRegenerate}
                disabled={refreshing}
                hitSlop={8}
                activeOpacity={0.6}
                style={[styles.iconBtn, { backgroundColor: theme.brandSoft }]}
              >
                {refreshing ? (
                  <ActivityIndicator size="small" color={theme.brand} />
                ) : (
                  <RefreshCw color={theme.brand} size={18} />
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isPremium}
      >
        <BaseCard
          style={[
            styles.hero,
            { backgroundColor: theme.brand, margin: Spacing.lg },
          ]}
          flat
        >
          <View style={styles.heroIconWrap}>
            <Sparkles color="#FFFFFF" size={28} />
          </View>
          <ThemedText style={styles.heroGreeting} color="#FFFFFFCC">
            {t("coach.heroTitle", { name })}
          </ThemedText>
          <ThemedText style={styles.heroHeadline} color="#FFFFFF">
            {headline}
          </ThemedText>
        </BaseCard>

        <PaywallBlur intensity={isPremium ? 0 : 30}>
          <View style={[styles.body, { gap: Spacing.xl }]}>
            <View>
              <ThemedText style={styles.sectionTitle}>
                {t("coach.metricsTitle")}
              </ThemedText>
              <View style={styles.metricsRow}>
                <MetricTile
                  label={t("coach.metricStreak")}
                  value={String(streak)}
                  unit={t("coach.metricStreakUnit")}
                />
                <MetricTile
                  label={t("coach.metricKcalAvg")}
                  value={
                    kcalAvg != null ? String(kcalAvg) : t("coach.metricEmpty")
                  }
                  unit={t("coach.metricKcalUnit")}
                />
                <MetricTile
                  label={t("coach.metricWeightChange")}
                  value={weightChangeFmt}
                />
              </View>
            </View>

            <CompareSection theme={theme} />

            <TrajectorySection theme={theme} weightUnit={t("weight.kg")} />

            <InsightCard
              tint="#34A867"
              tintLight="#E6F6EA"
              tintDark="#1F3A28"
              colorScheme={colorScheme}
              Icon={Star}
              title={t("coach.highlightTitle")}
              body={t("coach.highlightBody")}
            />

            <InsightCard
              tint="#E8A02C"
              tintLight="#FEF6E4"
              tintDark="#3A2E10"
              colorScheme={colorScheme}
              Icon={Eye}
              title={t("coach.watchTitle")}
              body={t("coach.watchBody")}
            />

            <RecipesSection
              recipes={recipes}
              title={t("coach.recipesTitle")}
              subtitle={t("coach.recipesSubtitle")}
              theme={theme}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => router.push("/meal-plan")}
            >
              <BaseCard
                style={[styles.mealPlanLink, { backgroundColor: theme.brand }]}
                flat
              >
                <View style={styles.mealPlanIcon}>
                  <CalendarDays color="#FFFFFF" size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText
                    style={styles.mealPlanTitle}
                    color="#FFFFFF"
                  >
                    {t("mealPlan.tabCardActiveTitle")}
                  </ThemedText>
                  <ThemedText
                    style={styles.mealPlanBody}
                    color="#FFFFFFCC"
                  >
                    {t("mealPlan.tabCardActiveBody")}
                  </ThemedText>
                </View>
                <ChevronRight color="#FFFFFF" size={18} />
              </BaseCard>
            </TouchableOpacity>

            <View>
              <ThemedText style={styles.sectionTitle}>
                {t("coach.actionsTitle")}
              </ThemedText>
              <BaseCard style={styles.listCard}>
                {actionItems.map((item, i) => (
                  <View
                    key={i}
                    style={[
                      styles.actionRow,
                      i < actionItems.length - 1 && {
                        borderBottomColor: theme.borderLight,
                        borderBottomWidth: StyleSheet.hairlineWidth,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.actionNum,
                        { backgroundColor: theme.brandSoft },
                      ]}
                    >
                      <ThemedText
                        style={styles.actionNumText}
                        color={theme.brand}
                      >
                        {i + 1}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.actionText}>{item}</ThemedText>
                  </View>
                ))}
              </BaseCard>
            </View>
          </View>
        </PaywallBlur>
      </ScrollView>

      <PaywallBlurOverlay
        visible={!isPremium}
        featureName={t("coach.featureName")}
      />
    </View>
  );
}

function buildHeadline({
  t,
  kcalAvg,
  kcalTarget,
  weightChangeKg,
}: {
  t: (key: string, opts?: Record<string, unknown>) => string;
  kcalAvg: number | null;
  kcalTarget: number | null;
  weightChangeKg: number | null;
}): string {
  if (kcalAvg == null || kcalTarget == null || kcalTarget <= 0) {
    return t("coach.kcalNoData");
  }
  const delta = kcalAvg - kcalTarget;
  const tolerance = Math.max(50, kcalTarget * 0.03);
  let kcalPart: string;
  if (Math.abs(delta) <= tolerance) {
    kcalPart = t("coach.kcalOnTarget", { avg: kcalAvg });
  } else if (delta < 0) {
    kcalPart = t("coach.kcalBelow", { avg: kcalAvg, delta: Math.abs(delta) });
  } else {
    kcalPart = t("coach.kcalAbove", { avg: kcalAvg, delta });
  }
  let weightPart = "";
  if (weightChangeKg != null) {
    const abs = Math.abs(weightChangeKg).toFixed(1);
    if (Math.abs(weightChangeKg) < 0.1) {
      weightPart = t("coach.weightFlat");
    } else if (weightChangeKg < 0) {
      weightPart = t("coach.weightDown", { kg: abs });
    } else {
      weightPart = t("coach.weightUp", { kg: abs });
    }
  }
  return `${kcalPart}${weightPart}`;
}

function MetricTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  return (
    <View
      style={[
        styles.metric,
        { backgroundColor: theme.card, borderColor: theme.borderLight },
      ]}
    >
      <ThemedText type="secondary" style={styles.metricLabel}>
        {label}
      </ThemedText>
      <ThemedText style={styles.metricValue}>{value}</ThemedText>
      {unit ? (
        <ThemedText type="secondary" style={styles.metricUnit}>
          {unit}
        </ThemedText>
      ) : null}
    </View>
  );
}

function CompareSection({
  theme,
}: {
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  const rows: {
    labelKey: string;
    unitKey: string;
    now: number;
    prev: number;
    // True when "lower is better" (calories, weight). False when "higher is
    // better" (protein, log days). Used to color the delta arrow.
    lowerIsBetter: boolean;
    decimals?: number;
  }[] = [
    {
      labelKey: "coach.compareKcal",
      unitKey: "coach.compareUnitKcal",
      now: STATIC.compare.kcal.now,
      prev: STATIC.compare.kcal.prev,
      lowerIsBetter: true,
    },
    {
      labelKey: "coach.compareProtein",
      unitKey: "coach.compareUnitG",
      now: STATIC.compare.protein.now,
      prev: STATIC.compare.protein.prev,
      lowerIsBetter: false,
    },
    {
      labelKey: "coach.compareLogDays",
      unitKey: "coach.compareUnitDays",
      now: STATIC.compare.days.now,
      prev: STATIC.compare.days.prev,
      lowerIsBetter: false,
    },
    {
      labelKey: "coach.compareWeight",
      unitKey: "coach.compareUnitKg",
      now: STATIC.compare.weight.now,
      prev: STATIC.compare.weight.prev,
      lowerIsBetter: true,
      decimals: 1,
    },
  ];

  return (
    <View>
      <ThemedText style={styles.sectionTitle}>
        {t("coach.compareTitle")}
      </ThemedText>
      <BaseCard style={styles.listCard}>
        {rows.map((row, i) => {
          const delta = row.now - row.prev;
          const decimals = row.decimals ?? 0;
          const goodDirection = row.lowerIsBetter ? delta < 0 : delta > 0;
          const isFlat = Math.abs(delta) < (decimals ? 0.05 : 0.5);
          const arrowColor = isFlat
            ? theme.textSecondary
            : goodDirection
              ? "#34A867"
              : theme.error;
          const Arrow = isFlat
            ? ArrowRight
            : delta > 0
              ? ArrowUpRight
              : ArrowDownRight;
          const sign = isFlat ? "" : delta > 0 ? "+" : "−";
          return (
            <View
              key={row.labelKey}
              style={[
                styles.compareRow,
                i < rows.length - 1 && {
                  borderBottomColor: theme.borderLight,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.compareLabel}>
                  {t(row.labelKey)}
                </ThemedText>
                <ThemedText type="secondary" style={styles.compareSub}>
                  {row.prev.toFixed(decimals)} {t(row.unitKey)}
                  {"  →  "}
                  {row.now.toFixed(decimals)} {t(row.unitKey)}
                </ThemedText>
              </View>
              <View
                style={[
                  styles.deltaBadge,
                  { backgroundColor: arrowColor + "1A" },
                ]}
              >
                <Arrow color={arrowColor} size={14} />
                <ThemedText style={styles.deltaText} color={arrowColor}>
                  {sign}
                  {Math.abs(delta).toFixed(decimals)}
                </ThemedText>
              </View>
            </View>
          );
        })}
      </BaseCard>
    </View>
  );
}

function TrajectorySection({
  theme,
  weightUnit,
}: {
  theme: typeof Colors.light;
  weightUnit: string;
}) {
  const { t } = useTranslation();
  const series = STATIC.trajectory.series;
  const last = series[series.length - 1];
  const target = STATIC.trajectory.targetKg;

  return (
    <View>
      <View style={styles.sectionHeader}>
        <View
          style={[
            styles.sectionIcon,
            { backgroundColor: theme.brandSoft },
          ]}
        >
          <Target color={theme.brand} size={16} />
        </View>
        <ThemedText style={styles.sectionTitle}>
          {t("coach.trajectoryTitle")}
        </ThemedText>
      </View>
      <BaseCard>
        <ThemedText style={styles.trajectoryBody}>
          {t("coach.trajectoryBody", { weeks: STATIC.trajectory.weeks })}
        </ThemedText>
        <LineChart
          values={series}
          color={theme.brand}
          goal={target}
          goalColor={theme.success}
          height={120}
        />
        <View style={styles.trajectoryMeta}>
          <View>
            <ThemedText type="secondary" style={styles.trajectoryMetaLabel}>
              {t("coach.trajectoryNow")}
            </ThemedText>
            <ThemedText style={styles.trajectoryMetaValue}>
              {last.toFixed(1)} {weightUnit}
            </ThemedText>
          </View>
          <View
            style={[
              styles.weeksPill,
              { backgroundColor: theme.brandSoft },
            ]}
          >
            <ThemedText style={styles.weeksPillText} color={theme.brandDeep}>
              {t("coach.trajectoryWeeksLabel", {
                weeks: STATIC.trajectory.weeks,
              })}
            </ThemedText>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <ThemedText type="secondary" style={styles.trajectoryMetaLabel}>
              {t("coach.trajectoryGoal")}
            </ThemedText>
            <ThemedText style={styles.trajectoryMetaValue} color={theme.success}>
              {target.toFixed(1)} {weightUnit}
            </ThemedText>
          </View>
        </View>
      </BaseCard>
    </View>
  );
}

function InsightCard({
  tint,
  tintLight,
  tintDark,
  colorScheme,
  Icon,
  title,
  body,
}: {
  tint: string;
  tintLight: string;
  tintDark: string;
  colorScheme: "light" | "dark";
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  body: string;
}) {
  return (
    <BaseCard style={styles.insightCard}>
      <View
        style={[
          styles.insightIcon,
          {
            backgroundColor: colorScheme === "dark" ? tintDark : tintLight,
          },
        ]}
      >
        <Icon color={tint} size={18} />
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        <ThemedText style={styles.insightTitle}>{title}</ThemedText>
        <ThemedText style={styles.insightBody} type="secondary">
          {body}
        </ThemedText>
      </View>
    </BaseCard>
  );
}

function RecipesSection({
  recipes,
  title,
  subtitle,
  theme,
}: {
  recipes: Recipe[];
  title: string;
  subtitle: string;
  theme: typeof Colors.light;
}) {
  if (recipes.length === 0) return null;
  return (
    <View>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <ThemedText
        type="secondary"
        style={[styles.sectionSub, { marginBottom: Spacing.md }]}
      >
        {subtitle}
      </ThemedText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recipesScroll}
      >
        {recipes.map((r) => (
          <RecipePick key={r.id} recipe={r} theme={theme} />
        ))}
      </ScrollView>
    </View>
  );
}

function RecipePick({
  recipe,
  theme,
}: {
  recipe: Recipe;
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
      style={[
        styles.recipePick,
        { backgroundColor: theme.card, borderColor: theme.borderLight },
      ]}
    >
      <Image
        source={
          recipe.cover_url
            ? { uri: recipe.cover_url }
            : require("@/assets/images/cheesecake.png")
        }
        style={styles.recipeImg}
        contentFit="cover"
      />
      <View style={styles.recipeBody}>
        <ThemedText style={styles.recipeTitle} numberOfLines={2}>
          {recipe.title}
        </ThemedText>
        <View
          style={[styles.recipeKcal, { backgroundColor: theme.brandSoft }]}
        >
          <ThemedText style={styles.recipeKcalText} color={theme.brand}>
            {recipe.kcal} {t("macros.kcalShort")}
          </ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  rightSlot: {
    minWidth: 36,
    alignItems: "flex-end",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  hero: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
    borderWidth: 0,
  },
  heroIconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  heroGreeting: {
    fontSize: Type.sm,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroHeadline: {
    fontSize: Type.lg,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Type.base,
    fontWeight: "800",
    marginBottom: Spacing.sm,
  },
  sectionSub: {
    fontSize: Type.xs,
    lineHeight: 18,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  metricsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  metric: {
    flex: 1,
    padding: Spacing.md,
    gap: 2,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: Type.xl,
    fontWeight: "800",
    marginTop: 2,
  },
  metricUnit: {
    fontSize: Type.xs,
  },
  listCard: {
    padding: 0,
    gap: 0,
  },
  compareRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  compareLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  compareSub: {
    fontSize: Type.xs,
    marginTop: 2,
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
    fontWeight: "800",
  },
  trajectoryBody: {
    fontSize: Type.sm,
    lineHeight: 20,
  },
  trajectoryMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  trajectoryMetaLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  trajectoryMetaValue: {
    fontSize: Type.base,
    fontWeight: "800",
    marginTop: 2,
  },
  weeksPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  weeksPillText: {
    fontSize: Type.xs,
    fontWeight: "800",
  },
  insightCard: {
    flexDirection: "row",
    gap: Spacing.md,
    alignItems: "flex-start",
  },
  insightIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontSize: Type.base,
    fontWeight: "800",
  },
  insightBody: {
    fontSize: Type.sm,
    lineHeight: 20,
  },
  recipesScroll: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  recipePick: {
    width: 160,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  recipeImg: {
    width: "100%",
    height: 110,
  },
  recipeBody: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  recipeTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
    lineHeight: 18,
  },
  recipeKcal: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  recipeKcalText: {
    fontSize: 11,
    fontWeight: "800",
  },
  mealPlanLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 0,
  },
  mealPlanIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  mealPlanTitle: {
    fontSize: Type.base,
    fontWeight: "800",
  },
  mealPlanBody: {
    fontSize: Type.xs,
    marginTop: 2,
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  actionNum: {
    width: 26,
    height: 26,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  actionNumText: {
    fontSize: Type.sm,
    fontWeight: "800",
  },
  actionText: {
    flex: 1,
    fontSize: Type.sm,
    lineHeight: 20,
    paddingTop: 3,
  },
});
