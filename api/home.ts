import { api } from "./client";
import type { ApiResponse, FoodLogEntry } from "./types";

// Home snapshot — bundles the signals the home screen needs into one
// round-trip. Backend guarantees food_log shape parity with /v1/food-log
// (same ENTRY_SELECT/shapeEntry helpers), so the data can be hydrated
// into the shared ["food-log", date] cache for /add and /meal/[key]
// to reuse. Streak is global (current run), so it's only populated when
// the resolved date is today; for past dates it returns zeros.
export type DayWeight = {
  log_date: string;
  weight_kg: number;
  source: "manual" | "apple_health" | "google_fit";
};

export type HomeToday = {
  food_log: FoodLogEntry[];
  water: { total_ml: number };
  steps: { count: number };
  streak: { current: number; longest: number };
  weight: DayWeight | null;
};

// Date is optional — omit for today. Backend resolves the day through the
// user's timezone (X-Timezone header), so the YYYY-MM-DD we send must be
// the local date, not a UTC one.
export function getHomeDay(date?: string) {
  return api.get<ApiResponse<HomeToday>>("/v1/home/day", {
    query: date ? { date } : undefined,
  });
}
