import type { QueryClient } from "@tanstack/react-query";

export function invalidateFoodLogQueries(
  queryClient: QueryClient,
  todayKey: string,
) {
  queryClient.invalidateQueries({ queryKey: ["food-log", todayKey] });
  queryClient.invalidateQueries({ queryKey: ["foods", "recent"] });
  queryClient.invalidateQueries({ queryKey: ["foods", "frequent"] });
  queryClient.invalidateQueries({ queryKey: ["foods", "all"] });
  queryClient.invalidateQueries({ queryKey: ["meals"] });
  queryClient.invalidateQueries({ queryKey: ["streak"] });
  queryClient.invalidateQueries({ queryKey: ["stats"] });
}
