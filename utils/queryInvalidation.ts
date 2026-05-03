import type { QueryClient } from "@tanstack/react-query";

export function invalidateFoodLogQueries(
  queryClient: QueryClient,
  todayKey: string,
) {
  queryClient.invalidateQueries({ queryKey: ["food-log", todayKey] });
  // Home pulls food-log inside the /home/day snapshot, so invalidate it
  // too — the refetch refreshes the calorie ring, macros card, and meal cards.
  queryClient.invalidateQueries({ queryKey: ["home", "day"] });
  queryClient.invalidateQueries({ queryKey: ["foods", "recent"] });
  queryClient.invalidateQueries({ queryKey: ["foods", "frequent"] });
  queryClient.invalidateQueries({ queryKey: ["foods", "all"] });
  queryClient.invalidateQueries({ queryKey: ["meals"] });
  queryClient.invalidateQueries({ queryKey: ["streak"] });
  queryClient.invalidateQueries({ queryKey: ["stats"] });
}
