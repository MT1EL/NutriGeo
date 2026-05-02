import { createFoodLog, deleteFoodLog, getFoodLog } from "@/api/foodLog";
import {
  getFavoriteFoods,
  getFrequentFoods,
  getRecentFoods,
  listFoods,
  searchFoods,
} from "@/api/foods";
import type { ApiResponse, Food, FoodLogEntry, MealKey } from "@/api/types";
import { MEAL_KEY_TO_API, MealKey as UiMealKey } from "@/constants/meals";
import { useToast } from "@/contexts/ToastContext";
import { todayISO } from "@/utils/date";
import { caloriesForFood, macroForFood } from "@/utils/foodMath";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export type BrowseTab = "all" | "frequent" | "favorites" | "recent";

const SEARCH_DEBOUNCE_MS = 300;

export function useAddScreen(activeMeal: UiMealKey) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [browse, setBrowse] = useState<BrowseTab>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(
      () => setDebouncedQuery(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(id);
  }, [searchInput]);

  const today = useMemo(() => todayISO(), []);
  const apiMealKey: MealKey = MEAL_KEY_TO_API[activeMeal];

  // Today's full food log (shared with /home and /meal/[key]).
  const foodLogQuery = useQuery({
    queryKey: ["food-log", today],
    queryFn: () => getFoodLog({ date: today }),
  });

  // Browse tabs — only the active one fetches.
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
          // Tolerate any cache shape (legacy flat array, missing data, etc.).
          const prev = old && Array.isArray(old.data) ? old.data : [];
          return { data: [...prev, optimisticEntry] };
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
          const prev = old && Array.isArray(old.data) ? old.data : [];
          const replaced = prev.map((e) =>
            e.id === ctx?.optimisticId ? serverEntry : e,
          );
          return {
            data:
              replaced.length && replaced.some((e) => e.id === serverEntry.id)
                ? replaced
                : [...prev, serverEntry],
          };
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
          const prev = old && Array.isArray(old.data) ? old.data : [];
          return { data: prev.filter((e) => e.id !== entryId) };
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
      const message =
        err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const allEntries = foodLogQuery.data?.data ?? [];
  const loggedForMeal = useMemo(
    () => allEntries.filter((e) => e.meal_key === apiMealKey),
    [allEntries, apiMealKey],
  );

  const summary = useMemo(
    () =>
      loggedForMeal.reduce(
        (acc, e) => {
          if (!e.food) return acc;
          const q = e.quantity || 1;
          return {
            consumed: acc.consumed + caloriesForFood(e.food, q),
            protein:
              acc.protein + macroForFood(e.food.protein_g_per_100g, e.food, q),
            carbs:
              acc.carbs + macroForFood(e.food.carbs_g_per_100g, e.food, q),
            fat: acc.fat + macroForFood(e.food.fat_g_per_100g, e.food, q),
          };
        },
        { consumed: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [loggedForMeal],
  );

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

  return {
    today,
    apiMealKey,
    browse,
    setBrowse,
    searchInput,
    setSearchInput,
    debouncedQuery,
    foodLogQuery,
    loggedForMeal,
    summary,
    browseQuery,
    browseFoods,
    browseEmptyText,
    addFood: (food: Food) => addMutation.mutate({ food }),
    removeEntry: (entryId: string) => removeMutation.mutate(entryId),
  };
}
