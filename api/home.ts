import { api } from "./client";
import type { ApiResponse, FoodLogEntry } from "./types";

// Home snapshot — bundles the 4 "today" signals that the home screen needs
// into one round-trip. Backend guarantees food_log shape parity with
// /v1/food-log (same ENTRY_SELECT/shapeEntry helpers), so the data can be
// hydrated into the shared ["food-log", today] cache for /add and /meal/[key]
// to reuse.
export type HomeToday = {
  food_log: FoodLogEntry[];
  water: { total_ml: number };
  steps: { count: number };
  streak: { current: number; longest: number };
};

export function getHomeToday() {
  return api.get<ApiResponse<HomeToday>>("/v1/home/today");
}
