import { createFoodLog, deleteFoodLog, updateFoodLog } from "@/api/foodLog";
import { favoriteFood, unfavoriteFood } from "@/api/foods";
import type {
  MealKey as ApiMealKey,
  ApiResponse,
  Food,
  FoodLogEntry,
} from "@/api/types";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import {
  caloriesForFood,
  formatGrams,
  formatServings,
  gramsToServings,
  macroForFood,
  servingLabel,
  servingsToGrams,
} from "@/utils/foodMath";
import { makeIdempotencyKey } from "@/utils/idempotency";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Heart, Minus, Plus, Trash2, X } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVINGS_STEP = 0.5;
const GRAMS_STEP = 10;

type Unit = "servings" | "grams";

type Props = {
  visible: boolean;
  onClose: () => void;
  food: Food | null;
  entry?: FoodLogEntry | null;
  defaultMealKey: ApiMealKey;
  todayKey: string;
};

function apiMealLabel(key: ApiMealKey): string {
  switch (key) {
    case "breakfast":
      return "საუზმე";
    case "lunch":
      return "სადილი";
    case "snack":
      return "სნექი";
    case "dinner":
      return "ვახშამი";
  }
}

const ALL_API_MEAL_KEYS: ApiMealKey[] = [
  "breakfast",
  "lunch",
  "snack",
  "dinner",
];

export default function FoodDetailSheet({
  visible,
  onClose,
  food,
  entry,
  defaultMealKey,
  todayKey,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const isEdit = !!entry;
  const [unit, setUnit] = useState<Unit>("servings");
  const [quantity, setQuantity] = useState<number>(entry?.quantity ?? 1);
  const [mealKey, setMealKey] = useState<ApiMealKey>(
    entry?.meal_key ?? defaultMealKey,
  );
  const [inputValue, setInputValue] = useState<string>("");
  const [favoriteOverride, setFavoriteOverride] = useState<boolean | null>(
    null,
  );

  // Reset state when sheet opens for a new food/entry.
  useEffect(() => {
    if (!visible) return;
    setQuantity(entry?.quantity ?? 1);
    setMealKey(entry?.meal_key ?? defaultMealKey);
    setUnit("servings");
    setFavoriteOverride(null);
  }, [
    visible,
    food?.id,
    entry?.id,
    defaultMealKey,
    entry?.quantity,
    entry?.meal_key,
  ]);

  // Keep inputValue synced with quantity / unit when not actively editing.
  useEffect(() => {
    if (!food) return;
    if (unit === "servings") {
      setInputValue(formatServings(quantity));
    } else {
      setInputValue(formatGrams(servingsToGrams(quantity, food)));
    }
  }, [quantity, unit, food]);

  const isFavoriteFromCache = useMemo(() => {
    if (!food) return false;
    const cached = queryClient.getQueryData<ApiResponse<Food[]>>([
      "foods",
      "favorites",
    ]);
    if (!cached || !Array.isArray(cached.data)) return false;
    return cached.data.some((f) => f.id === food.id);
  }, [food, queryClient, visible]);

  const isFavorite =
    favoriteOverride !== null ? favoriteOverride : isFavoriteFromCache;

  const logMutation = useMutation({
    mutationFn: (input: {
      food_id: string;
      meal_key: ApiMealKey;
      quantity: number;
    }) =>
      createFoodLog(
        {
          food_id: input.food_id,
          meal_key: input.meal_key,
          quantity: input.quantity,
          logged_at: new Date().toISOString(),
        },
        makeIdempotencyKey(),
      ),
    onSuccess: () => {
      invalidateFoodLogQueries(queryClient, todayKey);
      toast.success("საკვები დაემატა");
      onClose();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "დამატება ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (input: {
      id: string;
      meal_key: ApiMealKey;
      quantity: number;
    }) =>
      updateFoodLog(input.id, {
        meal_key: input.meal_key,
        quantity: input.quantity,
      }),
    onSuccess: () => {
      invalidateFoodLogQueries(queryClient, todayKey);
      toast.success("ცვლილება შენახულია");
      onClose();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFoodLog(id),
    onSuccess: () => {
      invalidateFoodLogQueries(queryClient, todayKey);
      toast.success("საკვები წაიშალა");
      onClose();
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: boolean }) =>
      next ? favoriteFood(id) : unfavoriteFood(id),
    onMutate: ({ next }) => {
      setFavoriteOverride(next);
    },
    onError: (err, { next }) => {
      setFavoriteOverride(!next);
      const message = err instanceof Error ? err.message : "ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods", "favorites"] });
    },
  });

  if (!food) return null;

  const minQuantity = unit === "servings" ? SERVINGS_STEP : 0.01;

  const adjustQuantity = (deltaUnits: number) => {
    if (unit === "servings") {
      const next = Math.max(minQuantity, quantity + deltaUnits);
      setQuantity(parseFloat(next.toFixed(2)));
    } else {
      const currentGrams = servingsToGrams(quantity, food);
      const nextGrams = Math.max(GRAMS_STEP, currentGrams + deltaUnits);
      setQuantity(gramsToServings(nextGrams, food));
    }
  };

  const commitInput = () => {
    const parsed = parseFloat(inputValue.replace(",", "."));
    if (Number.isNaN(parsed) || parsed <= 0) {
      // restore display from current quantity
      if (unit === "servings") setInputValue(formatServings(quantity));
      else setInputValue(formatGrams(servingsToGrams(quantity, food)));
      return;
    }
    if (unit === "servings") {
      setQuantity(parsed);
    } else {
      setQuantity(gramsToServings(parsed, food));
    }
  };

  const kcal = caloriesForFood(food, quantity);
  const proteinG = macroForFood(food.protein_g_per_100g, food, quantity);
  const carbsG = macroForFood(food.carbs_g_per_100g, food, quantity);
  const fatG = macroForFood(food.fat_g_per_100g, food, quantity);
  const fiberG = food.fiber_g_per_100g
    ? macroForFood(food.fiber_g_per_100g, food, quantity)
    : null;
  const totalGrams = Math.round(servingsToGrams(quantity, food));

  const handlePrimary = () => {
    if (isEdit && entry) {
      updateMutation.mutate({
        id: entry.id,
        meal_key: mealKey,
        quantity,
      });
    } else {
      logMutation.mutate({
        food_id: food.id,
        meal_key: mealKey,
        quantity,
      });
    }
  };

  const handleDelete = () => {
    if (!entry) return;
    deleteMutation.mutate(entry.id);
  };

  const handleToggleFavorite = () => {
    favoriteMutation.mutate({ id: food.id, next: !isFavorite });
  };

  const isPending =
    logMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const macros = [
    { label: "ცილა", value: proteinG, color: theme.macroProtein },
    { label: "ნახშირწ.", value: carbsG, color: theme.macroCarbs },
    { label: "ცხიმი", value: fatG, color: theme.macroFat },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[styles.sheetWrap, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={["bottom"]} style={styles.sheetContent}>
              <View style={styles.handleRow}>
                <View
                  style={[styles.handle, { backgroundColor: theme.border }]}
                />
              </View>

              <View style={styles.headerRow}>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText style={styles.title} numberOfLines={1}>
                    {food.name}
                  </ThemedText>
                  {food.brand ? (
                    <ThemedText type="secondary" style={styles.brand}>
                      {food.brand}
                    </ThemedText>
                  ) : (
                    <ThemedText type="secondary" style={styles.brand}>
                      1 პორცია = {servingLabel(food)}
                    </ThemedText>
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleToggleFavorite}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.borderLight },
                  ]}
                  hitSlop={6}
                  activeOpacity={0.7}
                  disabled={favoriteMutation.isPending}
                >
                  <Heart
                    color={isFavorite ? "#FF4D6D" : theme.textSecondary}
                    size={18}
                    fill={isFavorite ? "#FF4D6D" : "transparent"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.borderLight },
                  ]}
                  hitSlop={6}
                  activeOpacity={0.7}
                >
                  <X color={theme.text} size={18} />
                </TouchableOpacity>
              </View>

              {/* Unit toggle */}
              <View
                style={[styles.segment, { backgroundColor: theme.borderLight }]}
              >
                {(["servings", "grams"] as Unit[]).map((u) => {
                  const active = unit === u;
                  return (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setUnit(u)}
                      activeOpacity={0.85}
                      style={[
                        styles.segmentItem,
                        active && {
                          backgroundColor: theme.card,
                          shadowColor: theme.shadow,
                          shadowOpacity: 1,
                          shadowRadius: 6,
                          shadowOffset: { width: 0, height: 2 },
                          elevation: 2,
                        },
                      ]}
                    >
                      <ThemedText
                        style={styles.segmentText}
                        color={active ? theme.text : theme.textSecondary}
                      >
                        {u === "servings" ? "პორცია" : "გრამი"}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Stepper */}
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() =>
                    adjustQuantity(
                      unit === "servings" ? -SERVINGS_STEP : -GRAMS_STEP,
                    )
                  }
                  activeOpacity={0.7}
                  style={[styles.stepBtn, { backgroundColor: theme.brandSoft }]}
                  hitSlop={6}
                >
                  <Minus color={theme.brand} size={20} />
                </TouchableOpacity>

                <View style={styles.amountWrap}>
                  <TextInput
                    value={inputValue}
                    onChangeText={setInputValue}
                    onBlur={commitInput}
                    onSubmitEditing={commitInput}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                    style={[styles.amountInput, { color: theme.text }]}
                    returnKeyType="done"
                  />
                  <ThemedText style={styles.amountUnit} type="secondary">
                    {unit === "servings" ? "პორცია" : "გრამი"}
                  </ThemedText>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    adjustQuantity(
                      unit === "servings" ? SERVINGS_STEP : GRAMS_STEP,
                    )
                  }
                  activeOpacity={0.7}
                  style={[styles.stepBtn, { backgroundColor: theme.brandSoft }]}
                  hitSlop={6}
                >
                  <Plus color={theme.brand} size={20} />
                </TouchableOpacity>
              </View>

              <ThemedText type="secondary" style={styles.equivText}>
                {unit === "servings"
                  ? `≈ ${totalGrams}გ`
                  : `≈ ${formatServings(quantity)} პორცია`}
              </ThemedText>

              {/* Nutrition */}
              <View
                style={[
                  styles.nutritionCard,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <View style={styles.kcalRow}>
                  <View>
                    <ThemedText style={styles.kcalValue}>{kcal}</ThemedText>
                    <ThemedText style={styles.kcalLabel} type="secondary">
                      კალორია
                    </ThemedText>
                  </View>
                  {fiberG !== null && (
                    <View style={{ alignItems: "flex-end" }}>
                      <ThemedText style={styles.fiberValue}>
                        {fiberG}გ
                      </ThemedText>
                      <ThemedText style={styles.kcalLabel} type="secondary">
                        ბოჭკოვანი
                      </ThemedText>
                    </View>
                  )}
                </View>
                <View style={styles.macroRow}>
                  {macros.map((m) => (
                    <View
                      key={m.label}
                      style={[
                        styles.macroPill,
                        { backgroundColor: m.color + "1A" },
                      ]}
                    >
                      <View
                        style={[styles.macroDot, { backgroundColor: m.color }]}
                      />
                      <ThemedText style={styles.macroLabel} color={m.color}>
                        {m.label} {m.value}გ
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Meal selector */}
              <View style={{ gap: Spacing.sm }}>
                <ThemedText style={styles.groupLabel} type="secondary">
                  კვებაში
                </ThemedText>
                <View style={styles.mealRow}>
                  {ALL_API_MEAL_KEYS.map((m) => {
                    const active = m === mealKey;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setMealKey(m)}
                        activeOpacity={0.85}
                        style={[
                          styles.mealChip,
                          {
                            backgroundColor: active ? theme.brand : theme.card,
                            borderColor: active ? theme.brand : theme.border,
                          },
                        ]}
                      >
                        <ThemedText
                          style={styles.mealChipText}
                          color={active ? "#FFFFFF" : theme.text}
                        >
                          {apiMealLabel(m)}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionsRow}>
                {isEdit && (
                  <TouchableOpacity
                    onPress={handleDelete}
                    activeOpacity={0.7}
                    style={[
                      styles.deleteBtn,
                      { backgroundColor: theme.error + "1A" },
                    ]}
                    disabled={isPending}
                  >
                    <Trash2 color={theme.error} size={20} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={handlePrimary}
                  activeOpacity={0.85}
                  disabled={isPending}
                  style={[
                    styles.primaryBtn,
                    {
                      backgroundColor: theme.brand,
                      opacity: isPending ? 0.6 : 1,
                    },
                  ]}
                >
                  <ThemedText
                    style={styles.primaryBtnText}
                    color={theme.textOnBrand}
                  >
                    {isEdit
                      ? isPending
                        ? "ინახება..."
                        : "შენახვა"
                      : isPending
                        ? "ემატება..."
                        : "დაამატე"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheetWrap: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  sheetContent: {
    gap: Spacing.lg,
  },
  handleRow: {
    alignItems: "center",
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  brand: {
    fontSize: Type.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: Radius.md,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Radius.sm,
  },
  segmentText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.lg,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  amountWrap: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  amountInput: {
    fontSize: Type.xxxl,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    minWidth: 80,
    paddingVertical: 0,
  },
  amountUnit: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  equivText: {
    fontSize: Type.xs,
    textAlign: "center",
    marginTop: -Spacing.md,
    fontWeight: "600",
  },
  nutritionCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  kcalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  kcalValue: {
    fontSize: Type.xxxl,
    fontWeight: "800",
    letterSpacing: -1,
  },
  kcalLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  fiberValue: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  macroRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    flexWrap: "wrap",
  },
  macroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  mealRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  mealChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  mealChipText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  actionsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  deleteBtn: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: Type.lg,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
