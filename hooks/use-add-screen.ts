import {
  createFoodLog,
  deleteFoodLog,
  getFoodLog,
  updateFoodLog,
} from "@/api/foodLog";
import {
  getFavoriteFoods,
  getFrequentFoods,
  getMyFoods,
  getRecentFoods,
  listFoods,
  searchFoods,
} from "@/api/foods";
import type { ApiResponse, Food, FoodLogEntry, MealKey } from "@/api/types";
import { MEAL_KEY_TO_API, MealKey as UiMealKey } from "@/constants/meals";
import { useActiveDate } from "@/contexts/ActiveDateContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { loggedAtForDate } from "@/utils/date";
import { entryDisplay } from "@/utils/foodMath";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

export type BrowseTab = "all" | "frequent" | "favorites" | "recent" | "my";

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

  // The "today" cache key is dynamic now — it tracks the active date the
  // user selected on the home screen. Mutations log entries to this date.
  const { date: today } = useActiveDate();
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
  const myFoodsQuery = useQuery({
    queryKey: ["foods", "mine"],
    queryFn: getMyFoods,
    enabled: !debouncedQuery && browse === "my",
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
        logged_at: loggedAtForDate(today),
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
        logged_at: loggedAtForDate(today),
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
      toast.success(i18n.t("add.added"));
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["food-log", today], ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : i18n.t("add.addFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      updateFoodLog(id, { quantity }),
    onMutate: async ({ id, quantity }) => {
      await queryClient.cancelQueries({ queryKey: ["food-log", today] });
      const previous = queryClient.getQueryData<ApiResponse<FoodLogEntry[]>>([
        "food-log",
        today,
      ]);
      queryClient.setQueryData<ApiResponse<FoodLogEntry[]>>(
        ["food-log", today],
        (old) => {
          const prev = old && Array.isArray(old.data) ? old.data : [];
          return {
            data: prev.map((e) => (e.id === id ? { ...e, quantity } : e)),
          };
        },
      );
      return { previous };
    },
    onSuccess: () => {
      invalidateFoodLogQueries(queryClient, today);
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["food-log", today], ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : i18n.t("add.updateFailed");
      toast.error(message, i18n.t("common.error"));
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
      toast.success(i18n.t("add.deleted"));
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["food-log", today], ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : i18n.t("add.deleteFailed");
      toast.error(message, i18n.t("common.error"));
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
          const d = entryDisplay(e);
          return {
            consumed: acc.consumed + d.kcal,
            protein: acc.protein + d.protein_g,
            carbs: acc.carbs + d.carbs_g,
            fat: acc.fat + d.fat_g,
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
          : browse === "my"
            ? myFoodsQuery
            : recentQuery;

  const rawBrowseFoods: Food[] = debouncedQuery
    ? (searchQuery.data?.data ?? [])
    : ((browseQuery.data?.data as Food[] | undefined) ?? []);

  const loggedFoodIds = useMemo(
    () => new Set(loggedForMeal.map((e) => e.food_id)),
    [loggedForMeal],
  );
  const browseFoods: Food[] = useMemo(
    () => rawBrowseFoods.filter((f) => !loggedFoodIds.has(f.id)),
    [rawBrowseFoods, loggedFoodIds],
  );

  const browseEmptyText = debouncedQuery
    ? i18n.t("add.emptySearch")
    : browse === "favorites"
      ? i18n.t("add.emptyFavorites")
      : browse === "recent"
        ? i18n.t("add.emptyRecent")
        : browse === "frequent"
          ? i18n.t("add.emptyFrequent")
          : browse === "my"
            ? i18n.t("add.emptyMy")
            : i18n.t("add.emptyAll");

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
    removeEntry: (entry: FoodLogEntry) => removeMutation.mutate(entry.id),
    incrementEntry: (entry: FoodLogEntry) =>
      updateQuantityMutation.mutate({
        id: entry.id,
        quantity: entry.quantity + 1,
      }),
    decrementEntry: (entry: FoodLogEntry) => {
      if (entry.quantity <= 1) {
        removeMutation.mutate(entry.id);
      } else {
        updateQuantityMutation.mutate({
          id: entry.id,
          quantity: entry.quantity - 1,
        });
      }
    },
  };
}
