import { getHomeToday } from "@/api/home";
import { todayISO } from "@/utils/date";
import { aggregateDayMeals } from "@/utils/meals";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const STALE_HOME = 60_000;

export function useHomeData() {
  const today = todayISO();
  const queryClient = useQueryClient();

  const homeQuery = useQuery({
    queryKey: ["home", "today"],
    queryFn: getHomeToday,
    staleTime: STALE_HOME,
    placeholderData: keepPreviousData,
  });

  // Hydrate sibling caches so /add and /meal/[key] (reading ["food-log", today])
  // and anything reading ["streak"] hit cache instead of refetching. Backend
  // guarantees food_log shape parity with /v1/food-log.
  useEffect(() => {
    const data = homeQuery.data?.data;
    if (!data) return;
    queryClient.setQueryData(["food-log", today], { data: data.food_log });
    queryClient.setQueryData(["streak"], data.streak);
  }, [homeQuery.data, queryClient, today]);

  const data = homeQuery.data?.data;
  const meals = useMemo(
    () => (data?.food_log ? aggregateDayMeals(data.food_log, today) : undefined),
    [data, today],
  );

  return {
    snapshot: data,
    meals,
    isLoading: homeQuery.isLoading,
    isError: homeQuery.isError,
  };
}
