import { api } from "./client";
import type { ApiResponse, Range } from "./types";

export type CaloriesPoint = {
  date: string;
  kcal: number;
  on_target: boolean;
};
export type MacrosPoint = {
  date: string;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export type TopFood = { food_id: string; name: string; count: number };

export type Records = {
  longest_streak: number;
  lowest_weight_kg: number | null;
  highest_weight_kg: number | null;
  best_logging_day: { date: string; entries: number } | null;
};

export type Insight = {
  id: string;
  title: string;
  body: string;
  severity?: "info" | "warning" | "positive";
};

export type OverviewSummary = {
  kcal_avg: number;
  weight_change_kg: number;
  streak: { current: number; longest: number };
  days_in_target: number;
  logged_days: number;
  goal_pct: number | null; // signed, unclamped; null when goal=maintain or baseline missing
  protein_avg: number;
  carbs_avg: number;
  fat_avg: number;
};

export type WeightPoint = { date: string; weight_kg: number };

export type StreakHeatmapPoint = {
  date: string;
  state: "logged" | "partial" | "missed";
};

export type StatsOverview = {
  summary: OverviewSummary;
  calories: CaloriesPoint[];
  weight: WeightPoint[];
  macros: MacrosPoint[];
  top_foods: TopFood[];
  streak_heatmap: StreakHeatmapPoint[];
  insights: Insight[] | null; // null = no premium access; [] = access but no cards
  // Range-independent — same payload for week/month/quarter/year. Nullable
  // fields go null when the user hasn't logged the relevant signal yet.
  records: Records;
};

export function getStatsOverview(range: Range = "week") {
  return api.get<ApiResponse<StatsOverview>>("/v1/stats/overview", {
    query: { range },
  });
}
