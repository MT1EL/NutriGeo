import { getProfile } from "@/api/profile";
import { getStatsOverview } from "@/api/stats";
import type { Range as ApiRange } from "@/api/types";
import { DayState } from "@/components/charts/StreakGrid";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export type UiRange = "week" | "month" | "quarter";

const UI_TO_API_RANGE: Record<UiRange, ApiRange> = {
  week: "week",
  month: "month",
  quarter: "year",
};

// Quarter view trims the year payload from the backend down to ~3 months
// so charts and counts reflect the visible window.
const QUARTER_DAYS = 90;

export function useStats() {
  const [range, setRange] = useState<UiRange>("week");
  const apiRange = UI_TO_API_RANGE[range];

  const profileQuery = useQuery({
    queryKey: ["Profile"] as const,
    queryFn: getProfile,
  });
  const overviewQuery = useQuery({
    queryKey: ["stats", "overview", apiRange],
    queryFn: () => getStatsOverview(apiRange),
  });

  const profile = profileQuery.data?.data;
  const overview = overviewQuery.data?.data;
  const records = overview?.records;
  const summary = overview?.summary;

  const sliceForRange = useCallback(
    <T>(arr: T[] | undefined): T[] => {
      const all = Array.isArray(arr) ? arr : [];
      return range === "quarter" ? all.slice(-QUARTER_DAYS) : all;
    },
    [range],
  );

  const caloriesSeries = useMemo(
    () => sliceForRange(overview?.calories),
    [overview, sliceForRange],
  );
  const weightSeries = useMemo(
    () => sliceForRange(overview?.weight),
    [overview, sliceForRange],
  );
  const macrosSeries = useMemo(
    () => sliceForRange(overview?.macros),
    [overview, sliceForRange],
  );
  const streakDays: DayState[] = useMemo(
    () => sliceForRange(overview?.streak_heatmap).map((p) => p.state),
    [overview, sliceForRange],
  );

  const calGoal = profile?.daily_calorie_target ?? 2000;
  const weightGoal = profile?.target_weight_kg ?? null;
  const loggedDays = summary?.logged_days ?? 0;
  const onTargetDays = summary?.days_in_target ?? 0;
  const currentStreak = summary?.streak.current ?? 0;

  const hasAnyCalories = caloriesSeries.some((p) => p.kcal > 0);
  const hasAnyWeight = weightSeries.length > 0;
  const hasAnyTopFoods = (overview?.top_foods?.length ?? 0) > 0;
  const isInitialLoading = overviewQuery.isLoading;
  const isError = overviewQuery.isError;
  const isTotallyEmpty =
    !isInitialLoading &&
    !isError &&
    !hasAnyCalories &&
    !hasAnyWeight &&
    !hasAnyTopFoods &&
    currentStreak === 0 &&
    !summary?.kcal_avg;

  return {
    range,
    setRange,
    profile,
    summary,
    overview,
    records,
    caloriesSeries,
    weightSeries,
    macrosSeries,
    streakDays,
    calGoal,
    weightGoal,
    loggedDays,
    onTargetDays,
    currentStreak,
    isInitialLoading,
    isError,
    isTotallyEmpty,
    hasAnyCalories,
    refetch: () => {
      void overviewQuery.refetch();
      void profileQuery.refetch();
    },
  };
}
