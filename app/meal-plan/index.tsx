import { HttpError } from "@/api/client";
import type { MealPlan, MealPlanSlot } from "@/api/mealPlan";
import {
  getCurrentMealPlan,
  getMealPlanPreferences,
  regenerateMealPlan,
} from "@/api/mealPlan";
import type { MealKey } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import {
  PaywallBlur,
  PaywallBlurOverlay,
} from "@/components/premium/PaywallBlur";
import MealPlanPreferencesSheet from "@/components/sheets/MealPlanPreferencesSheet";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { usePremium } from "@/hooks/use-premium";
import {
  DEFAULT_MEAL_PLAN_PREFERENCES,
  type MealPlanPreferences,
} from "@/utils/mealPlanData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ChevronLeft,
  Clock,
  RefreshCw,
  ShoppingCart,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;
const MEAL_KEYS: MealKey[] = ["breakfast", "lunch", "dinner", "snack"];

export default function MealPlanScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { isPremium } = usePremium();
  const toast = useToast();
  const queryClient = useQueryClient();

  // 0 = Monday, 6 = Sunday. Default to today (JS getDay: 0=Sun..6=Sat).
  const todayIdx = useMemo(() => {
    const js = new Date().getDay();
    return js === 0 ? 6 : js - 1;
  }, []);
  const [selected, setSelected] = useState<number>(todayIdx);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [preferences, setPreferences] = useState<MealPlanPreferences>(
    DEFAULT_MEAL_PLAN_PREFERENCES,
  );

  // Seed preferences from the server's last-plan / profile-derived defaults
  // on first mount. Sheet's local state takes over after the user edits.
  const prefsQuery = useQuery({
    queryKey: ["meal-plan", "preferences"],
    queryFn: () => getMealPlanPreferences(),
    enabled: isPremium,
    staleTime: 5 * 60_000,
  });
  useEffect(() => {
    const seed = prefsQuery.data?.data?.preferences;
    if (seed) setPreferences(seed);
  }, [prefsQuery.data]);

  const planQuery = useQuery({
    queryKey: ["meal-plan", "current"],
    queryFn: () => getCurrentMealPlan(),
    enabled: isPremium,
    staleTime: 30 * 60_000,
    retry: (count, err) => !(err instanceof HttpError && err.status === 404),
  });

  const noPlan =
    planQuery.error instanceof HttpError && planQuery.error.status === 404;
  const plan: MealPlan | undefined = planQuery.data?.data;
  const day = plan?.days[selected];
  const regenRemaining = plan
    ? Math.max(0, plan.regenerations.limit - plan.regenerations.used)
    : 3;

  const regenerateMutation = useMutation({
    mutationFn: (next: MealPlanPreferences) =>
      regenerateMealPlan({ preferences: next }),
    onSuccess: (resp) => {
      queryClient.setQueryData(["meal-plan", "current"], {
        data: resp.data,
        meta: undefined,
      });
      // Server is the source of truth for preferences after a regen.
      setPreferences(resp.data.preferences);
      // Shopping list depends on the active plan — invalidate so the next
      // visit refetches fresh aggregates.
      queryClient.invalidateQueries({
        queryKey: ["meal-plan", "shopping-list"],
      });
      const cached = resp.meta?.cached;
      toast.success(
        cached
          ? t("mealPlan.preferences.unchangedToast")
          : t("mealPlan.preferences.saved"),
      );
      setPrefsOpen(false);
    },
    onError: (err) => {
      if (err instanceof HttpError && err.status === 429) {
        toast.error(t("mealPlan.regenLimitReached"), t("common.error"));
        return;
      }
      const message = err instanceof Error ? err.message : t("common.error");
      toast.error(message, t("common.error"));
    },
  });

  const onRegenerate = () => {
    setPrefsOpen(true);
  };

  const onSubmitPrefs = (next: MealPlanPreferences) => {
    regenerateMutation.mutate(next);
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
              {t("mealPlan.title")}
            </ThemedText>
            <ThemedText style={styles.subtitle} type="secondary">
              {t("mealPlan.subtitle")}
            </ThemedText>
          </View>
          <View style={styles.rightSlot}>
            {isPremium && plan ? (
              <TouchableOpacity
                onPress={() => router.push("/meal-plan/shopping-list")}
                hitSlop={8}
                activeOpacity={0.6}
                style={[styles.iconBtn, { backgroundColor: theme.borderLight }]}
                accessibilityLabel={t("mealPlan.shoppingListCta")}
              >
                <ShoppingCart color={theme.text} size={18} />
              </TouchableOpacity>
            ) : null}
            {isPremium ? (
              <TouchableOpacity
                onPress={onRegenerate}
                hitSlop={8}
                activeOpacity={0.6}
                style={[styles.iconBtn, { backgroundColor: theme.brandSoft }]}
                accessibilityLabel={t("mealPlan.regenerate")}
              >
                <RefreshCw color={theme.brand} size={18} />
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
        <PaywallBlur intensity={isPremium ? 0 : 30}>
          <View style={[{ gap: Spacing.lg }, styles.body]}>
            {/* Day strip */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dayStrip}
            >
              {DAY_KEYS.map((key, i) => {
                const isToday = i === todayIdx;
                const isSelected = i === selected;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setSelected(i)}
                    activeOpacity={0.7}
                    style={[
                      styles.dayPill,
                      {
                        backgroundColor: isSelected ? theme.brand : theme.card,
                        borderColor: isSelected
                          ? theme.brand
                          : theme.borderLight,
                      },
                    ]}
                  >
                    <ThemedText
                      style={styles.dayPillLabel}
                      color={isSelected ? "#FFFFFF" : theme.textSecondary}
                    >
                      {t(`mealPlan.days.${key}`)}
                    </ThemedText>
                    {isToday && (
                      <View
                        style={[
                          styles.todayDot,
                          {
                            backgroundColor: isSelected
                              ? "#FFFFFF"
                              : theme.brand,
                          },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Empty state — no plan yet */}
            {noPlan ? (
              <BaseCard style={styles.emptyCard}>
                <ThemedText style={styles.emptyTitle}>
                  {t("mealPlan.emptyTitle")}
                </ThemedText>
                <ThemedText type="secondary" style={styles.emptyBody}>
                  {t("mealPlan.emptyBody")}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => setPrefsOpen(true)}
                  activeOpacity={0.85}
                  style={[styles.emptyCta, { backgroundColor: theme.brand }]}
                >
                  <ThemedText
                    style={styles.emptyCtaText}
                    color={theme.textOnBrand}
                  >
                    {t("mealPlan.emptyCta")}
                  </ThemedText>
                </TouchableOpacity>
              </BaseCard>
            ) : null}

            {/* Loading skeleton (premium user, no plan yet, query pending) */}
            {!noPlan && !plan && planQuery.isLoading ? (
              <BaseCard style={styles.emptyCard}>
                <ActivityIndicator color={theme.brand} />
              </BaseCard>
            ) : null}

            {/* Daily totals */}
            {day ? (
              <BaseCard style={styles.totalsCard}>
                <View style={styles.totalsRow}>
                  <View style={{ flex: 1 }}>
                    <ThemedText type="secondary" style={styles.totalsLabel}>
                      {t("mealPlan.todayLabel")}
                    </ThemedText>
                    <ThemedText style={styles.totalsValue}>
                      {t("mealPlan.totalKcal", { kcal: day.totals.kcal })}
                    </ThemedText>
                  </View>
                  <View style={styles.macroChips}>
                    <MacroChip
                      color={theme.macroProtein}
                      label={t("mealPlan.summaryProtein", {
                        g: day.totals.protein_g,
                      })}
                    />
                    <MacroChip
                      color={theme.macroCarbs}
                      label={t("mealPlan.summaryCarbs", {
                        g: day.totals.carbs_g,
                      })}
                    />
                    <MacroChip
                      color={theme.macroFat}
                      label={t("mealPlan.summaryFat", {
                        g: day.totals.fat_g,
                      })}
                    />
                  </View>
                </View>
              </BaseCard>
            ) : null}

            {/* Meals — one card per meal type, only rendered when present
                in the user's preferences (server returns [] for excluded). */}
            {day ? (
              <View style={{ gap: Spacing.md }}>
                {MEAL_KEYS.map((meal) => (
                  <MealCard
                    key={meal}
                    meal={meal}
                    slots={day.meals[meal]}
                    theme={theme}
                  />
                ))}
              </View>
            ) : null}

            {/* Plan-level warnings — surface tolerance violations from packer */}
            {plan?.warnings && plan.warnings.length > 0 ? (
              <BaseCard style={styles.warningsCard}>
                <ThemedText type="secondary" style={styles.warningsText}>
                  {t("mealPlan.warningsLead")}
                </ThemedText>
                {plan.warnings.map((w) => (
                  <ThemedText
                    key={w}
                    type="secondary"
                    style={styles.warningsItem}
                  >
                    • {w}
                  </ThemedText>
                ))}
              </BaseCard>
            ) : null}
          </View>
        </PaywallBlur>
      </ScrollView>

      <PaywallBlurOverlay
        visible={!isPremium}
        featureName={t("mealPlan.featureName")}
      />

      <MealPlanPreferencesSheet
        visible={prefsOpen}
        onClose={() => setPrefsOpen(false)}
        onSubmit={onSubmitPrefs}
        initialValue={preferences}
        remaining={regenRemaining}
        submitting={regenerateMutation.isPending}
      />
    </View>
  );
}

function MacroChip({ color, label }: { color: string; label: string }) {
  return (
    <View style={[styles.macroChip, { backgroundColor: color + "1A" }]}>
      <View style={[styles.macroDot, { backgroundColor: color }]} />
      <ThemedText style={styles.macroChipText} color={color}>
        {label}
      </ThemedText>
    </View>
  );
}

function MealCard({
  meal,
  slots,
  theme,
}: {
  meal: MealKey;
  slots: MealPlanSlot[];
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  const isEmpty = slots.length === 0;
  const mealKcal = slots.reduce((sum, s) => sum + s.kcal, 0);

  return (
    <BaseCard style={styles.mealGroupCard} flat>
      <View
        style={[
          styles.mealHeader,
          { borderBottomColor: theme.border },
          !isEmpty && styles.mealHeaderDivider,
        ]}
      >
        <ThemedText style={styles.mealHeaderLabel} color={theme.textSecondary}>
          {t(`meal.${meal}`)}
        </ThemedText>
        {isEmpty ? (
          <ThemedText type="secondary" style={styles.mealHeaderEmpty}>
            {t("mealPlan.emptyMeal")}
          </ThemedText>
        ) : (
          <View
            style={[styles.kcalBadge, { backgroundColor: theme.brandSoft }]}
          >
            <ThemedText style={styles.kcalBadgeText} color={theme.brand}>
              {mealKcal} {t("macros.kcalShort")}
            </ThemedText>
          </View>
        )}
      </View>
      {!isEmpty ? (
        <View>
          {slots.map((slot, i) => (
            <SlotRow
              key={`${slot.recipe_id ?? slot.user_recipe_id ?? i}`}
              slot={slot}
              theme={theme}
              divider={i < slots.length - 1}
            />
          ))}
        </View>
      ) : null}
    </BaseCard>
  );
}

function SlotRow({
  slot,
  theme,
  divider,
}: {
  slot: MealPlanSlot;
  theme: typeof Colors.light;
  divider: boolean;
}) {
  const { t } = useTranslation();
  // Server inlines either `recipe` (catalog) or `user_recipe` (custom).
  // Tap navigates only when we have a catalog recipe — no custom-recipe
  // detail screen exists yet.
  const inline = slot.recipe ?? slot.user_recipe;
  const tappable = !!slot.recipe_id;
  const onPress = () => {
    if (slot.recipe_id) router.push(`/recipes/${slot.recipe_id}`);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={!tappable}
      style={[
        styles.slotRow,
        divider && {
          borderBottomColor: theme.borderLight,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <Image
        source={
          inline?.cover_url
            ? { uri: inline.cover_url }
            : require("@/assets/images/cheesecake.png")
        }
        style={styles.slotImg}
        contentFit="cover"
      />
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText style={styles.slotTitle} numberOfLines={2}>
          {inline?.title ?? t("mealPlan.customRecipe")}
        </ThemedText>
        <View style={styles.slotMeta}>
          {inline && inline.duration_min > 0 ? (
            <View style={styles.slotMetaItem}>
              <Clock color={theme.textSecondary} size={12} />
              <ThemedText type="secondary" style={styles.slotMetaText}>
                {t("recipes.duration", { count: inline.duration_min })}
              </ThemedText>
            </View>
          ) : null}
          <ThemedText type="secondary" style={styles.slotMetaText}>
            {slot.kcal} {t("macros.kcalShort")}
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
    flexDirection: "row",
    gap: Spacing.sm,
    minWidth: 36,
    alignItems: "center",
    justifyContent: "flex-end",
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.huge,
  },
  dayStrip: {
    gap: Spacing.sm,
    paddingRight: Spacing.lg,
  },
  dayPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    minWidth: 64,
    justifyContent: "center",
  },
  dayPillLabel: {
    fontSize: Type.xs,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: Radius.pill,
  },
  totalsCard: {
    paddingVertical: Spacing.md,
  },
  totalsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  totalsLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  totalsValue: {
    fontSize: Type.xl,
    fontWeight: "800",
    marginTop: 2,
  },
  macroChips: {
    gap: 6,
    alignItems: "flex-end",
  },
  macroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.pill,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: Radius.pill,
  },
  macroChipText: {
    fontSize: 11,
    fontWeight: "800",
  },
  mealGroupCard: {
    padding: 0,
    overflow: "hidden",
    gap: 0,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  mealHeaderDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  mealHeaderLabel: {
    fontSize: Type.xs,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  mealHeaderEmpty: {
    fontSize: Type.xs,
    fontWeight: "700",
    fontStyle: "italic",
  },
  slotRow: {
    flexDirection: "row",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  slotImg: {
    width: 64,
    height: 64,
    borderRadius: Radius.md,
  },
  slotTitle: {
    fontSize: Type.base,
    fontWeight: "700",
    lineHeight: 21,
  },
  slotMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: 4,
  },
  slotMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  slotMetaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  kcalBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  kcalBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Type.lg,
    fontWeight: "800",
  },
  emptyBody: {
    fontSize: Type.sm,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: Spacing.lg,
  },
  emptyCta: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  emptyCtaText: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  warningsCard: {
    gap: 4,
  },
  warningsText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  warningsItem: {
    fontSize: Type.xs,
    lineHeight: 18,
  },
});
