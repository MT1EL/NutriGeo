import { getHomeDay } from "@/api/home";
import { useActiveDate } from "@/contexts/ActiveDateContext";
import { aggregateDayMeals } from "@/utils/meals";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

const STALE_HOME = 60_000;

export function useHomeData() {
  const { date, isToday } = useActiveDate();
  const queryClient = useQueryClient();

  // One bundled call for both today and past dates. `keepPreviousData`
  // holds the previous date's snapshot through the swap so the screen
  // doesn't flash to empty on date change.
  const homeQuery = useQuery({
    queryKey: ["home", "day", date],
    queryFn: () => getHomeDay(isToday ? undefined : date),
    staleTime: STALE_HOME,
    placeholderData: keepPreviousData,
  });

  // Hydrate sibling caches so /add and /meal/[key] (reading
  // ["food-log", date]) and ["streak"] consumers hit cache instead of
  // refetching. Streak is only meaningful for today.
  useEffect(() => {
    const data = homeQuery.data?.data;
    if (!data) return;
    queryClient.setQueryData(["food-log", date], { data: data.food_log });
    if (isToday) queryClient.setQueryData(["streak"], data.streak);
  }, [homeQuery.data, queryClient, date, isToday]);

  const snapshot = homeQuery.data?.data;
  const foodLog = snapshot?.food_log ?? [];

  const meals = useMemo(
    () => aggregateDayMeals(foodLog, date),
    [foodLog, date],
  );

  return {
    snapshot,
    meals,
    isToday,
    isLoading: homeQuery.isLoading,
    isError: homeQuery.isError,
  };
}
