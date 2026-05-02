import { deleteFoodLog, getFoodLog } from "@/api/foodLog";
import type { ApiResponse, FoodLogEntry } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import FoodDetailSheet from "@/components/sheets/FoodDetailSheet";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import {
  isMealKey,
  MEAL_CONFIGS,
  MEAL_KEY_TO_API,
  MealKey,
} from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { Plus, X } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function imageSource(url: string | undefined) {
  return url ? { uri: url } : require("@/assets/images/cheesecake.png");
}
export default function MealModal() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();
  const { meal: mealParam } = useLocalSearchParams<{ meal?: string }>();

  const mealKey: MealKey = isMealKey(mealParam) ? mealParam : "საუზმე";
  const apiMealKey = MEAL_KEY_TO_API[mealKey];
  const config = MEAL_CONFIGS[mealKey];
  const today = useMemo(() => todayISO(), []);
  const [sheetEntry, setSheetEntry] = useState<FoodLogEntry | null>(null);

  const foodLogQuery = useQuery({
    queryKey: ["food-log", today],
    queryFn: () => getFoodLog({ date: today }),
  });

  const allEntries = foodLogQuery.data?.data ?? [];
  const loggedForMeal = useMemo(
    () => allEntries.filter((e) => e.meal_key === apiMealKey),
    [allEntries, apiMealKey],
  );

  const summary = useMemo(() => {
    return loggedForMeal.reduce(
      (acc, e) => {
        if (!e.food) return acc;
        const q = e.quantity || 1;
        return {
          consumed: acc.consumed + caloriesForFood(e.food, q),
          protein:
            acc.protein + macroForFood(e.food.protein_g_per_100g, e.food, q),
          carbs: acc.carbs + macroForFood(e.food.carbs_g_per_100g, e.food, q),
          fat: acc.fat + macroForFood(e.food.fat_g_per_100g, e.food, q),
        };
      },
      { consumed: 0, protein: 0, carbs: 0, fat: 0 },
    );
  }, [loggedForMeal]);

  const removeMutation = useMutation({
    mutationFn: (entryId: string) => deleteFoodLog(entryId),
    onMutate: async (entryId) => {
      await queryClient.cancelQueries({ queryKey: ["food-log", today] });
      const previous = queryClient.getQueryData<ApiResponse<FoodLogEntry[]>>([
        "food-log",
        today,
      ]);
      queryClient.setQueryData<ApiResponse<FoodLogEntry[]>>(
        ["food-log", today],
        (old) => {
          if (!old) return old;
          return { ...old, data: old.data.filter((e) => e.id !== entryId) };
        },
      );
      return { previous };
    },
    onSuccess: () => {
      invalidateFoodLogQueries(queryClient, today);
      toast.success("საკვები წაიშალა");
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["food-log", today], ctx.previous);
      }
      const message = err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const remaining = Math.max(config.goal - summary.consumed, 0);
  const overGoal = summary.consumed > config.goal;
  const pct = Math.min(summary.consumed / config.goal, 1);

  const macros = [
    {
      label: "ცილა",
      consumed: summary.protein,
      goal: config.proteinGoal,
      color: theme.macroProtein,
    },
    {
      label: "ნახშირწყ.",
      consumed: summary.carbs,
      goal: config.carbsGoal,
      color: theme.macroCarbs,
    },
    {
      label: "ცხიმი",
      consumed: summary.fat,
      goal: config.fatGoal,
      color: theme.macroFat,
    },
  ];

  const goToAdd = () => {
    router.back();
    setTimeout(() => {
      router.push({ pathname: "/add", params: { meal: mealKey } });
    }, 50);
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.surface }]}>
      <View style={[styles.handleWrap, { backgroundColor: theme.surface }]}>
        <View style={[styles.handle, { backgroundColor: theme.border }]} />
      </View>

      <View style={[styles.headerRow]}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? config.iconTintDark
                    : config.iconTint,
              },
            ]}
          >
            <config.Icon color={config.iconColor} size={24} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.title}>{mealKey}</ThemedText>
            <ThemedText type="secondary" style={styles.subtitle}>
              {config.time} · {loggedForMeal.length} საკვები
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          style={[styles.closeBtn, { backgroundColor: theme.borderLight }]}
          activeOpacity={0.6}
        >
          <X color={theme.text} size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.summaryCard,
            { backgroundColor: theme.card, borderColor: theme.borderLight },
          ]}
        >
          <View style={styles.summaryTop}>
            <View>
              <ThemedText style={styles.consumedLabel} type="secondary">
                ჩაწერილი
              </ThemedText>
              <View style={styles.consumedRow}>
                <ThemedText style={styles.consumedValue}>
                  {summary.consumed}
                </ThemedText>
                <ThemedText style={styles.consumedGoal} type="secondary">
                  / {config.goal} კალ
                </ThemedText>
              </View>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <ThemedText
                style={styles.remainingValue}
                color={overGoal ? theme.warning : theme.brand}
              >
                {overGoal ? `+${summary.consumed - config.goal}` : remaining}
              </ThemedText>
              <ThemedText style={styles.remainingLabel} type="secondary">
                {overGoal ? "გადაჭარბდა" : "დარჩა"}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.track, { backgroundColor: theme.borderLight }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${pct * 100}%`,
                  backgroundColor: overGoal ? theme.warning : theme.brand,
                },
              ]}
            />
          </View>

          <View style={styles.macros}>
            {macros.map((m) => (
              <View key={m.label} style={styles.macroCol}>
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
                        width: `${Math.min(m.consumed / m.goal, 1) * 100}%`,
                        backgroundColor: m.color,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={styles.macroLabel} type="secondary">
                  {m.label}
                </ThemedText>
                <ThemedText style={styles.macroValue}>
                  {m.consumed}
                  <ThemedText style={styles.macroValueGoal} type="secondary">
                    /{m.goal}გ
                  </ThemedText>
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.sectionTitle}>ჩაწერილი საკვები</ThemedText>
          {foodLogQuery.isLoading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color={theme.brand} />
            </View>
          ) : loggedForMeal.length === 0 ? (
            <View
              style={[
                styles.empty,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.borderLight,
                },
              ]}
            >
              <View
                style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}
              >
                <config.Icon color={theme.brand} size={22} />
              </View>
              <ThemedText style={styles.emptyTitle}>
                ჯერ არაფერი ჩაგიწერია
              </ThemedText>
              <ThemedText type="secondary" style={styles.emptyText}>
                დააწექი ქვემოთ ღილაკს და დაამატე
              </ThemedText>
            </View>
          ) : (
            <View style={{ gap: Spacing.md }}>
              {loggedForMeal.map((entry) => {
                const food = entry.food;
                if (!food) return null;
                const q = entry.quantity || 1;
                return (
                  <FoodCard
                    key={entry.id}
                    title={food.name}
                    calories={caloriesForFood(food, q)}
                    serving={`${servingLabel(food)}${q !== 1 ? ` × ${q}` : ""}`}
                    proteinG={macroForFood(food.protein_g_per_100g, food, q)}
                    carbsG={macroForFood(food.carbs_g_per_100g, food, q)}
                    fatG={macroForFood(food.fat_g_per_100g, food, q)}
                    image={imageSource(food.image_url)}
                    action="remove"
                    onActionPress={() => removeMutation.mutate(entry.id)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.borderLight,
          },
        ]}
      >
        <Button onPress={goToAdd}>
          <View style={styles.btnContent}>
            <Plus color="#FFFFFF" size={18} />
            <ThemedText style={styles.btnText} color="#FFFFFF">
              დაამატე საკვები
            </ThemedText>
          </View>
        </Button>
      </View>
      <FoodDetailSheet
        visible={!!sheetEntry}
        onClose={() => setSheetEntry(null)}
        food={sheetEntry?.food ?? null}
        entry={sheetEntry}
        defaultMealKey={apiMealKey}
        todayKey={today}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  handleWrap: {
    alignItems: "center",
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  summaryCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  summaryTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  consumedLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  consumedRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  consumedValue: {
    fontSize: Type.xxxl,
    fontWeight: "800",
    letterSpacing: -1,
  },
  consumedGoal: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  remainingValue: {
    fontSize: Type.xxl,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  remainingLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  macros: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  macroCol: {
    flex: 1,
    gap: 4,
  },
  macroTrack: {
    height: 4,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginTop: 2,
  },
  macroValue: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  macroValueGoal: {
    fontSize: 10,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  empty: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: Type.xs,
    textAlign: "center",
  },
  loaderRow: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  btnText: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
