import { listRecipes } from "@/api/recipes";
import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import {
  PaywallBlur,
  PaywallBlurOverlay,
} from "@/components/premium/PaywallBlur";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { usePremium } from "@/hooks/use-premium";
import {
  STATIC_DAILY_TOTALS,
  STATIC_MEAL_PLAN,
  type MealPlanSlot,
} from "@/utils/mealPlanData";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  RefreshCw,
  ShoppingCart,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export default function MealPlanScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { isPremium } = usePremium();
  const toast = useToast();

  // 0 = Monday, 6 = Sunday. Default to today (JS getDay: 0=Sun..6=Sat).
  const todayIdx = useMemo(() => {
    const js = new Date().getDay();
    return js === 0 ? 6 : js - 1;
  }, []);
  const [selected, setSelected] = useState<number>(todayIdx);

  const recipesQuery = useQuery({
    queryKey: ["recipes", "meal-plan-pool"],
    queryFn: () => listRecipes({ limit: 24 }),
    staleTime: 60 * 60_000,
  });
  const pool: Recipe[] = recipesQuery.data?.data ?? [];

  const day = STATIC_MEAL_PLAN[selected];
  const dayRecipes: { slot: MealPlanSlot; recipe: Recipe | null }[] =
    day.slots.map((slot) => ({
      slot,
      recipe: pool.length > 0 ? pool[slot.recipeIdx % pool.length] : null,
    }));

  const onRegenerate = () => {
    Alert.alert(t("mealPlan.comingSoonTitle"), t("mealPlan.comingSoonBody"), [
      { text: t("common.done") },
    ]);
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
            {isPremium ? (
              <TouchableOpacity
                onPress={onRegenerate}
                hitSlop={8}
                activeOpacity={0.6}
                style={[styles.iconBtn, { backgroundColor: theme.brandSoft }]}
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

            {/* Daily totals */}
            <BaseCard style={styles.totalsCard}>
              <View style={styles.totalsRow}>
                <View style={{ flex: 1 }}>
                  <ThemedText type="secondary" style={styles.totalsLabel}>
                    {t("mealPlan.todayLabel")}
                  </ThemedText>
                  <ThemedText style={styles.totalsValue}>
                    {t("mealPlan.totalKcal", {
                      kcal: STATIC_DAILY_TOTALS.kcal,
                    })}
                  </ThemedText>
                </View>
                <View style={styles.macroChips}>
                  <MacroChip
                    color={theme.macroProtein}
                    label={t("mealPlan.summaryProtein", {
                      g: STATIC_DAILY_TOTALS.protein_g,
                    })}
                  />
                  <MacroChip
                    color={theme.macroCarbs}
                    label={t("mealPlan.summaryCarbs", {
                      g: STATIC_DAILY_TOTALS.carbs_g,
                    })}
                  />
                  <MacroChip
                    color={theme.macroFat}
                    label={t("mealPlan.summaryFat", {
                      g: STATIC_DAILY_TOTALS.fat_g,
                    })}
                  />
                </View>
              </View>
            </BaseCard>

            {/* Meals list */}
            <View style={{ gap: Spacing.md }}>
              {pool.length === 0 ? (
                <BaseCard>
                  <ThemedText type="secondary" style={{ textAlign: "center" }}>
                    {t("mealPlan.noRecipesYet")}
                  </ThemedText>
                </BaseCard>
              ) : (
                dayRecipes.map(({ slot, recipe }, i) =>
                  recipe ? (
                    <MealRow
                      key={`${slot.meal}-${i}`}
                      mealLabel={t(`meals.${slot.meal}`)}
                      recipe={recipe}
                      theme={theme}
                    />
                  ) : null,
                )
              )}
            </View>

            {/* Shopping list CTA */}
            <TouchableOpacity
              onPress={() => router.push("/meal-plan/shopping-list")}
              activeOpacity={0.85}
            >
              <BaseCard style={styles.shoppingCta} flat>
                <View
                  style={[
                    styles.shoppingIcon,
                    { backgroundColor: theme.brandSoft },
                  ]}
                >
                  <ShoppingCart color={theme.brand} size={20} />
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.shoppingCtaTitle}>
                    {t("mealPlan.shoppingListCta")}
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.shoppingCtaBody}>
                    {t("mealPlan.shopping.subtitle")}
                  </ThemedText>
                </View>
                <ChevronRight color={theme.textSecondary} size={18} />
              </BaseCard>
            </TouchableOpacity>
          </View>
        </PaywallBlur>
      </ScrollView>

      <PaywallBlurOverlay
        visible={!isPremium}
        featureName={t("mealPlan.featureName")}
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

function MealRow({
  mealLabel,
  recipe,
  theme,
}: {
  mealLabel: string;
  recipe: Recipe;
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
    >
      <BaseCard style={styles.mealCard} flat>
        <Image
          source={
            recipe.cover_url
              ? { uri: recipe.cover_url }
              : require("@/assets/images/cheesecake.png")
          }
          style={styles.mealImg}
          contentFit="cover"
        />
        <View style={{ flex: 1, gap: 4 }}>
          <ThemedText
            type="secondary"
            style={styles.mealLabel}
            color={theme.brand}
          >
            {mealLabel}
          </ThemedText>
          <ThemedText style={styles.mealTitle} numberOfLines={2}>
            {recipe.title}
          </ThemedText>
          <View style={styles.mealMeta}>
            <View style={styles.mealMetaItem}>
              <Clock color={theme.textSecondary} size={12} />
              <ThemedText type="secondary" style={styles.mealMetaText}>
                {t("recipes.duration", { count: recipe.duration_min })}
              </ThemedText>
            </View>
            <View
              style={[styles.kcalBadge, { backgroundColor: theme.brandSoft }]}
            >
              <ThemedText style={styles.kcalBadgeText} color={theme.brand}>
                {recipe.kcal} {t("macros.kcalShort")}
              </ThemedText>
            </View>
          </View>
        </View>
      </BaseCard>
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
  mealCard: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.md,
    alignItems: "center",
  },
  mealImg: {
    width: 72,
    height: 72,
    borderRadius: Radius.md,
  },
  mealLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  mealTitle: {
    fontSize: Type.base,
    fontWeight: "700",
    lineHeight: 20,
  },
  mealMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    marginTop: 2,
  },
  mealMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  mealMetaText: {
    fontSize: Type.xs,
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
  shoppingCta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  shoppingIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  shoppingCtaTitle: {
    fontSize: Type.base,
    fontWeight: "800",
  },
  shoppingCtaBody: {
    fontSize: Type.xs,
    marginTop: 2,
  },
});
