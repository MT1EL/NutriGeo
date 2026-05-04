import { getCoachWeekly, refreshCoach } from "@/api/coach";
import type {
  CoachCompare,
  CoachTrajectory,
  CoachWeekly,
} from "@/api/coach";
import { HttpError } from "@/api/client";
import { getRecipeById } from "@/api/recipes";
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
import { formatWeightChange } from "@/utils/format";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import React from "react";
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

export default function CoachScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const toast = useToast();
  const queryClient = useQueryClient();

  const name = user?.profile?.name || t("coach.defaultName");

  const coachQuery = useQuery({
    queryKey: ["coach", "weekly"],
    queryFn: () => getCoachWeekly(),
    staleTime: 30 * 60_000,
    enabled: isPremium,
  });

  const coach: CoachWeekly | undefined = coachQuery.data?.data;
  const meta = coachQuery.data?.meta;
  const isSynth = meta?.synthesized === true;

  const pickIds = coach?.recipe_picks?.ids ?? [];
  // Hydrate up-to-5 recipe IDs in parallel; per-id 404s are silently dropped
  // so a stale catalog entry doesn't kill the whole row.
  const picksQuery = useQuery({
    queryKey: ["coach", "picks", pickIds.join(",")],
    queryFn: async () => {
      const results = await Promise.all(
        pickIds.map((id) => getRecipeById(id).catch(() => null)),
      );
      return results
        .filter((r): r is NonNullable<typeof r> => r !== null)
        .map((r) => r.data);
    },
    enabled: pickIds.length > 0,
    staleTime: 60 * 60_000,
  });
  const recipes: Recipe[] = picksQuery.data ?? [];

  const refreshMutation = useMutation({
    mutationFn: () => refreshCoach(),
    onSuccess: (resp) => {
      queryClient.setQueryData(["coach", "weekly"], resp);
      toast.success(t("coach.regeneratedToast"));
    },
    onError: (err) => {
      if (err instanceof HttpError && err.status === 429) {
        toast.error(t("coach.refreshLimit"), t("common.error"));
        return;
      }
      const message = err instanceof Error ? err.message : t("common.error");
      toast.error(message, t("common.error"));
    },
  });

  const onRegenerate = () => {
    if (refreshMutation.isPending) return;
    refreshMutation.mutate();
  };

  const refreshing = refreshMutation.isPending;

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
            {coach?.headline ?? t("coach.kcalNoData")}
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
                  value={String(coach?.metrics.streak_days ?? 0)}
                  unit={t("coach.metricStreakUnit")}
                />
                <MetricTile
                  label={t("coach.metricKcalAvg")}
                  value={
                    coach?.metrics.kcal_avg != null
                      ? String(Math.round(coach.metrics.kcal_avg))
                      : t("coach.metricEmpty")
                  }
                  unit={t("coach.metricKcalUnit")}
                />
                <MetricTile
                  label={t("coach.metricWeightChange")}
                  value={formatWeightChange(
                    coach?.metrics.weight_change_kg ?? undefined,
                    ` ${t("weight.kg")}`,
                  )}
                />
              </View>
            </View>

            {coach ? (
              <CompareSection theme={theme} compare={coach.compare} />
            ) : null}

            {coach ? (
              <TrajectorySection
                theme={theme}
                weightUnit={t("weight.kg")}
                trajectory={coach.trajectory}
              />
            ) : null}

            {coach?.insights?.highlight ? (
              <InsightCard
                tint="#34A867"
                tintLight="#E6F6EA"
                tintDark="#1F3A28"
                colorScheme={colorScheme}
                Icon={Star}
                title={coach.insights.highlight.title}
                body={coach.insights.highlight.body}
              />
            ) : null}

            {coach?.insights?.watch ? (
              <InsightCard
                tint="#E8A02C"
                tintLight="#FEF6E4"
                tintDark="#3A2E10"
                colorScheme={colorScheme}
                Icon={Eye}
                title={coach.insights.watch.title}
                body={coach.insights.watch.body}
              />
            ) : null}

            {isSynth ? (
              <BaseCard style={styles.synthBanner}>
                <ThemedText type="secondary" style={styles.synthText}>
                  {t("coach.synthBanner")}
                </ThemedText>
              </BaseCard>
            ) : null}

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

            {coach?.actions && coach.actions.length > 0 ? (
            <View>
              <ThemedText style={styles.sectionTitle}>
                {t("coach.actionsTitle")}
              </ThemedText>
              <BaseCard style={styles.listCard}>
                {coach.actions.map((item, i) => (
                  <View
                    key={i}
                    style={[
                      styles.actionRow,
                      i < coach.actions.length - 1 && {
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
            ) : null}
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
  compare,
}: {
  theme: typeof Colors.light;
  compare: CoachCompare;
}) {
  const { t } = useTranslation();
  // Skip the weight row entirely if either side of the pair is null —
  // showing "0 → 0" misleads when the user just hasn't logged.
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
      now: compare.kcal_per_day.now,
      prev: compare.kcal_per_day.prev,
      lowerIsBetter: true,
    },
    {
      labelKey: "coach.compareProtein",
      unitKey: "coach.compareUnitG",
      now: compare.protein_per_day.now,
      prev: compare.protein_per_day.prev,
      lowerIsBetter: false,
    },
    {
      labelKey: "coach.compareLogDays",
      unitKey: "coach.compareUnitDays",
      now: compare.days_logged.now,
      prev: compare.days_logged.prev,
      lowerIsBetter: false,
    },
  ];
  if (compare.weight_kg.now != null && compare.weight_kg.prev != null) {
    rows.push({
      labelKey: "coach.compareWeight",
      unitKey: "coach.compareUnitKg",
      now: compare.weight_kg.now,
      prev: compare.weight_kg.prev,
      lowerIsBetter: true,
      decimals: 1,
    });
  }

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
  trajectory,
}: {
  theme: typeof Colors.light;
  weightUnit: string;
  trajectory: CoachTrajectory;
}) {
  const { t } = useTranslation();
  const series = trajectory.series;
  const last = series.length > 0 ? series[series.length - 1] : null;
  const target = trajectory.target_kg;
  const weeks = trajectory.weeks_to_goal;

  // Empty series → not enough body_logs yet. Render the section but with
  // an explainer instead of a misleading flat chart.
  if (series.length === 0) {
    return (
      <View>
        <View style={styles.sectionHeader}>
          <View
            style={[styles.sectionIcon, { backgroundColor: theme.brandSoft }]}
          >
            <Target color={theme.brand} size={16} />
          </View>
          <ThemedText style={styles.sectionTitle}>
            {t("coach.trajectoryTitle")}
          </ThemedText>
        </View>
        <BaseCard>
          <ThemedText style={styles.trajectoryBody} type="secondary">
            {t("coach.trajectoryEmpty")}
          </ThemedText>
        </BaseCard>
      </View>
    );
  }

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
          {weeks != null
            ? t("coach.trajectoryBody", { weeks })
            : t("coach.trajectoryDiverging")}
        </ThemedText>
        <LineChart
          values={series}
          color={theme.brand}
          goal={target ?? undefined}
          goalColor={theme.success}
          height={120}
        />
        <View style={styles.trajectoryMeta}>
          <View>
            <ThemedText type="secondary" style={styles.trajectoryMetaLabel}>
              {t("coach.trajectoryNow")}
            </ThemedText>
            <ThemedText style={styles.trajectoryMetaValue}>
              {last != null ? `${last.toFixed(1)} ${weightUnit}` : "—"}
            </ThemedText>
          </View>
          {weeks != null ? (
            <View
              style={[
                styles.weeksPill,
                { backgroundColor: theme.brandSoft },
              ]}
            >
              <ThemedText
                style={styles.weeksPillText}
                color={theme.brandDeep}
              >
                {t("coach.trajectoryWeeksLabel", { weeks })}
              </ThemedText>
            </View>
          ) : null}
          <View style={{ alignItems: "flex-end" }}>
            <ThemedText type="secondary" style={styles.trajectoryMetaLabel}>
              {t("coach.trajectoryGoal")}
            </ThemedText>
            <ThemedText
              style={styles.trajectoryMetaValue}
              color={theme.success}
            >
              {target != null ? `${target.toFixed(1)} ${weightUnit}` : "—"}
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
  synthBanner: {
    paddingVertical: Spacing.md,
  },
  synthText: {
    fontSize: Type.xs,
    lineHeight: 18,
    textAlign: "center",
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
