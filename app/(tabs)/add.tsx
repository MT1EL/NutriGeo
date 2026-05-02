import { createFoodLog, deleteFoodLog, getFoodLog } from "@/api/foodLog";
import {
  getFavoriteFoods,
  getFrequentFoods,
  getRecentFoods,
  listFoods,
  searchFoods,
} from "@/api/foods";
import type { ApiResponse, Food, FoodLogEntry } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import { MealProgressCard } from "@/components/cards/MealProgressCard";
import Header from "@/components/headers";
import CustomFoodSheet from "@/components/sheets/CustomFoodSheet";
import FoodDetailSheet from "@/components/sheets/FoodDetailSheet";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import {
  isMealKey,
  MEAL_CONFIGS,
  MEAL_KEY_TO_API,
  MEAL_KEYS,
  MealKey,
} from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import {
  Camera,
  History,
  LayoutGrid,
  LucideIcon,
  Mic,
  ScanBarcode,
  Sparkles,
  Star,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const QUICK_ACTIONS = [
  {
    Icon: ScanBarcode,
    label: "ბარკოდი",
    color: "#5B6CE0",
    tint: "#EEF0FB",
    tintDark: "#222B4A",
  },
  {
    Icon: Camera,
    label: "ფოტო",
    color: "#2FB871",
    tint: "#E8F6EC",
    tintDark: "#1F3A28",
  },
  {
    Icon: Mic,
    label: "ხმოვანი",
    color: "#E85A8C",
    tint: "#FCEAF1",
    tintDark: "#3A2030",
  },
  {
    Icon: Sparkles,
    label: "AI",
    color: "#7C5CFF",
    tint: "#F0EBFE",
    tintDark: "#2A1F4A",
  },
];

type BrowseTab = "all" | "frequent" | "favorites" | "recent";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function imageSource(url: string | undefined) {
  return url ? { uri: url } : require("@/assets/images/cheesecake.png");
}

export default function AddScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();
  const { meal } = useLocalSearchParams<{ meal?: string }>();

  const [activeMeal, setActiveMeal] = useState<MealKey>(
    isMealKey(meal) ? meal : "საუზმე",
  );
  const [browse, setBrowse] = useState<BrowseTab>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sheetFood, setSheetFood] = useState<Food | null>(null);
  const [sheetEntry, setSheetEntry] = useState<FoodLogEntry | null>(null);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);

  useEffect(() => {
    if (isMealKey(meal)) setActiveMeal(meal);
  }, [meal]);

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const today = useMemo(() => todayISO(), []);
  const apiMealKey = MEAL_KEY_TO_API[activeMeal];

  const foodLogQuery = useQuery({
    queryKey: ["food-log", today],
    queryFn: () => getFoodLog({ date: today }),
  });

  const allFoodsQuery = useQuery({
    queryKey: ["foods", "all"],
    queryFn: () => listFoods({ limit: 100 }),
    enabled: !debouncedQuery && browse === "all",
  });
  const frequentQuery = useQuery({
    queryKey: ["foods", "frequent"],
    queryFn: getFrequentFoods,
    enabled: !debouncedQuery && browse === "frequent",
  });
  const favoritesQuery = useQuery({
    queryKey: ["foods", "favorites"],
    queryFn: getFavoriteFoods,
    enabled: !debouncedQuery && browse === "favorites",
  });
  const recentQuery = useQuery({
    queryKey: ["foods", "recent"],
    queryFn: getRecentFoods,
    enabled: !debouncedQuery && browse === "recent",
  });
  const searchQuery = useQuery({
    queryKey: ["foods", "search", debouncedQuery],
    queryFn: () => searchFoods({ q: debouncedQuery, limit: 20 }),
    enabled: debouncedQuery.length > 0,
  });

  const addMutation = useMutation({
    mutationFn: ({ food }: { food: Food }) =>
      createFoodLog({
        food_id: food.id,
        meal_key: apiMealKey,
        quantity: 1,
        logged_at: new Date().toISOString(),
      }),
    onMutate: async ({ food }) => {
      await queryClient.cancelQueries({ queryKey: ["food-log", today] });
      const previous = queryClient.getQueryData<ApiResponse<FoodLogEntry[]>>([
        "food-log",
        today,
      ]);
      const optimisticEntry: FoodLogEntry = {
        id: `optimistic-${Date.now()}`,
        food_id: food.id,
        meal_key: apiMealKey,
        quantity: 1,
        logged_at: new Date().toISOString(),
        food,
      };
      queryClient.setQueryData<ApiResponse<FoodLogEntry[]>>(
        ["food-log", today],
        (old) => {
          if (!old) return { data: [optimisticEntry] };
          return { ...old, data: [...old.data, optimisticEntry] };
        },
      );
      return { previous, optimisticId: optimisticEntry.id };
    },
    onSuccess: (res, { food }, ctx) => {
      const serverEntry: FoodLogEntry = {
        ...res.data,
        food: res.data.food ?? food,
      };
      queryClient.setQueryData<ApiResponse<FoodLogEntry[]>>(
        ["food-log", today],
        (old) => {
          if (!old) return { data: [serverEntry] };
          const replaced = old.data.map((e) =>
            e.id === ctx?.optimisticId ? serverEntry : e,
          );
          return { ...old, data: replaced };
        },
      );
      invalidateFoodLogQueries(queryClient, today);
      toast.success("საკვები დაემატა");
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["food-log", today], ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : "დამატება ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

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

  const config = MEAL_CONFIGS[activeMeal];
  const mealButtons = MEAL_KEYS.map((m) => ({
    Icon: MEAL_CONFIGS[m].Icon,
    label: m,
  }));

  const browseTabs: { key: BrowseTab; label: string; Icon: LucideIcon }[] = [
    { key: "all", label: "ყველა", Icon: LayoutGrid },
    { key: "frequent", label: "ხშირი", Icon: History },
    { key: "favorites", label: "საყვარელი", Icon: Star },
    { key: "recent", label: "ბოლო", Icon: Sparkles },
  ];

  const browseQuery = debouncedQuery
    ? searchQuery
    : browse === "all"
      ? allFoodsQuery
      : browse === "frequent"
        ? frequentQuery
        : browse === "favorites"
          ? favoritesQuery
          : recentQuery;

  const browseFoods: Food[] = debouncedQuery
    ? (searchQuery.data?.data ?? [])
    : ((browseQuery.data?.data as Food[] | undefined) ?? []);

  const browseEmptyText = debouncedQuery
    ? "ამ ძიებაზე საკვები ვერ მოიძებნა"
    : browse === "favorites"
      ? "საყვარელი საკვები ჯერ არ გაქვს"
      : browse === "recent"
        ? "ბოლო ჩანაწერები არ არის"
        : browse === "frequent"
          ? "ხშირი საკვები ჯერ არ არის"
          : "კატალოგი ცარიელია";

  const handleAdd = (food: Food) => addMutation.mutate({ food });
  const handleRemove = (entry: FoodLogEntry) => removeMutation.mutate(entry.id);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <Header
        title="კვების ჩაწერა"
        inputPlaceholder="მოძებნე საკვები..."
        buttons={mealButtons}
        onButtonPress={(button) => setActiveMeal(button.label as MealKey)}
        activeButton={activeMeal}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: Spacing.xl,
          paddingBottom: TAB_BAR_HEIGHT + 24,
          gap: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MealProgressCard
          Icon={config.Icon}
          iconColor={config.iconColor}
          iconTint={
            colorScheme === "dark" ? config.iconTintDark : config.iconTint
          }
          mealLabel={activeMeal}
          consumed={summary.consumed}
          goal={config.goal}
          macros={[
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
          ]}
        />

        <View style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.sectionTitle}>სწრაფი ჩაწერა</ThemedText>
          <View style={styles.quickRow}>
            {QUICK_ACTIONS.map(({ Icon, label, color, tint, tintDark }) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.85}
                style={[
                  styles.quickTile,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.quickIcon,
                    {
                      backgroundColor: colorScheme === "dark" ? tintDark : tint,
                    },
                  ]}
                >
                  <Icon color={color} size={20} />
                </View>
                <ThemedText style={styles.quickLabel}>{label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              ჩაწერილი — {activeMeal}
            </ThemedText>
            <ThemedText style={styles.sectionCount} type="secondary">
              {loggedForMeal.length} საკვები
            </ThemedText>
          </View>
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
                დაამატე საკვები ქვემოთ ხშირი სიიდან
              </ThemedText>
            </View>
          ) : (
            <View style={{ gap: Spacing.md }}>
              {loggedForMeal.map((entry) => {
                const food = entry.food;
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
                    onPress={() => {
                      setSheetFood(food);
                      setSheetEntry(entry);
                    }}
                    onActionPress={() => handleRemove(entry)}
                  />
                );
              })}
            </View>
          )}
        </View>

        <View style={{ gap: Spacing.sm }}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              {debouncedQuery ? "ძიების შედეგი" : "დაამატე"}
            </ThemedText>
          </View>
          {!debouncedQuery && (
            <View style={styles.tabsRow}>
              {browseTabs.map(({ key, label, Icon }) => {
                const isActive = browse === key;
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => setBrowse(key)}
                    activeOpacity={0.85}
                    style={[
                      styles.tab,
                      {
                        backgroundColor: isActive ? theme.brand : theme.card,
                        borderColor: isActive ? theme.brand : theme.border,
                      },
                    ]}
                  >
                    <Icon
                      color={isActive ? "#FFFFFF" : theme.textSecondary}
                      size={14}
                    />
                    <ThemedText
                      style={styles.tabLabel}
                      color={isActive ? "#FFFFFF" : theme.text}
                    >
                      {label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
          {browseQuery.isLoading ? (
            <View style={styles.loaderRow}>
              <ActivityIndicator color={theme.brand} />
            </View>
          ) : browseFoods.length === 0 ? (
            <View
              style={[
                styles.empty,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.borderLight,
                },
              ]}
            >
              <ThemedText type="secondary" style={styles.emptyText}>
                {browseEmptyText}
              </ThemedText>
            </View>
          ) : (
            <View style={{ gap: Spacing.md, marginTop: Spacing.xs }}>
              {browseFoods.map((food) => (
                <FoodCard
                  key={food.id}
                  title={food.name}
                  calories={caloriesForFood(food)}
                  serving={servingLabel(food)}
                  proteinG={macroForFood(food.protein_g_per_100g, food)}
                  carbsG={macroForFood(food.carbs_g_per_100g, food)}
                  fatG={macroForFood(food.fat_g_per_100g, food)}
                  image={imageSource(food.image_url)}
                  action="add"
                  onPress={() => {
                    setSheetFood(food);
                    setSheetEntry(null);
                  }}
                  onActionPress={() => handleAdd(food)}
                />
              ))}
            </View>
          )}
        </View>

        <Button onPress={() => setCreateSheetVisible(true)} variant="secondary">
          + შექმენი ახალი საკვები
        </Button>
      </ScrollView>
      <FoodDetailSheet
        visible={!!sheetFood}
        onClose={() => {
          setSheetFood(null);
          setSheetEntry(null);
        }}
        food={sheetFood}
        entry={sheetEntry}
        defaultMealKey={apiMealKey}
        todayKey={today}
      />
      <CustomFoodSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  sectionCount: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  quickRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  quickTile: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.sm,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontSize: Type.xs,
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
  tabsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  loaderRow: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
});
