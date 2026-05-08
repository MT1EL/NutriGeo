import { makeIdempotencyKey } from "@/utils/idempotency";
import { api } from "./client";
import { Recipe } from "./types";

export type CoachMetrics = {
  streak_days: number;
  kcal_avg: number | null;
  weight_change_kg: number | null;
};

export type CoachComparePair = { now: number; prev: number };
export type CoachCompareWeightPair = {
  now: number | null;
  prev: number | null;
};

export type CoachCompare = {
  kcal_per_day: CoachComparePair;
  protein_per_day: CoachComparePair;
  days_logged: CoachComparePair;
  weight_kg: CoachCompareWeightPair;
};

export type CoachTrajectory = {
  series: number[]; // variable length, max 12
  target_kg: number | null;
  weeks_to_goal: number | null;
};

export type CoachInsightCard = { title: string; body: string };
// `null` outer = no LLM polish yet (cache miss / synth fallback). Inner cards
// also nullable so the headline/watch can populate independently.
export type CoachInsights = {
  highlight: CoachInsightCard | null;
  watch: CoachInsightCard | null;
} | null;

export type CoachWeekly = {
  week_of: string;
  generated_at: string;
  language: "en" | "ka";
  headline: string;
  metrics: CoachMetrics;
  compare: CoachCompare;
  trajectory: CoachTrajectory;
  insights: CoachInsights;
  recipe_picks: { items: Recipe[] }; // up to 5
  actions: string[]; // [] when synthesized
  next_refresh_available_at: string;
};

export type CoachWeeklyMeta = {
  cached?: boolean;
  synthesized?: boolean;
  remaining?: number;
  resets_at?: string;
};

// Optional `week_of` lets us fetch a past week (Monday in user TZ).
export function getCoachWeekly(weekOf?: string) {
  return api.get<{ data: CoachWeekly; meta?: CoachWeeklyMeta }>(
    "/v1/coach/weekly",
    {
      query: weekOf ? { week_of: weekOf } : undefined,
    },
  );
}

// Idempotent. Throttled to 3 LLM-polishes per user-tz week.
export function refreshCoach(weekOf?: string, idempotencyKey?: string) {
  return api.post<{ data: CoachWeekly; meta?: CoachWeeklyMeta }>(
    "/v1/coach/refresh",
    weekOf ? { week_of: weekOf } : {},
    { idempotencyKey: idempotencyKey ?? makeIdempotencyKey() },
  );
}

export type CoachWeeklyResponse = Awaited<ReturnType<typeof getCoachWeekly>>;
