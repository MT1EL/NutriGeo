import { deleteFoodLog, getFoodLog } from "@/api/foodLog";
import type { ApiResponse, FoodLogEntry } from "@/api/types";
import { MEAL_KEY_TO_API, MealKey } from "@/constants/meals";
import { useActiveDate } from "@/contexts/ActiveDateContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { caloriesForFood, entryServings, macroForFood } from "@/utils/foodMath";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function useMealDetail(mealKey: MealKey) {
  const toast = useToast();
  const queryClient = useQueryClient();
  const { date: today } = useActiveDate();
  const apiMealKey = MEAL_KEY_TO_API[mealKey];

  const foodLogQuery = useQuery({
    queryKey: ["food-log", today],
    queryFn: () => getFoodLog({ date: today }),
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
          const q = entryServings(e);
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

  return {
    today,
    apiMealKey,
    isLoading: foodLogQuery.isLoading,
    loggedForMeal,
    summary,
    removeEntry: (entryId: string) => removeMutation.mutate(entryId),
  };
}
