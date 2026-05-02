import { api } from './client';
import type { ApiResponse, Range } from './types';

export type Summary = {
  range: Range;
  kcal_avg: number;
  protein_avg: number;
  carbs_avg: number;
  fat_avg: number;
  weight_change_kg?: number;
  streak_days?: number;
};

export type SeriesPoint = { date: string; value: number };
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
  best_logging_day: { date: string; entries: number };
  lowest_weight_kg?: number;
  highest_weight_kg?: number;
};

export type Insight = {
  id: string;
  title: string;
  body: string;
  severity?: 'info' | 'warning' | 'positive';
};

function rangeQuery(range: Range = 'week') {
  return { query: { range } };
}

export function getSummary(range: Range = 'week') {
  return api.get<ApiResponse<Summary>>('/v1/stats/summary', rangeQuery(range));
}

export function getCaloriesSeries(range: Range = 'week') {
  return api.get<ApiResponse<CaloriesPoint[]>>('/v1/stats/calories', rangeQuery(range));
}

export function getMacrosSeries(range: Range = 'week') {
  return api.get<ApiResponse<MacrosPoint[]>>('/v1/stats/macros', rangeQuery(range));
}

export function getWeightSeries(range: Range = 'week') {
  return api.get<ApiResponse<SeriesPoint[]>>('/v1/stats/weight', rangeQuery(range));
}

export function getStreak(range: Range = 'week') {
  return api.get<ApiResponse<{ current: number; longest: number }>>(
    '/v1/stats/streak',
    rangeQuery(range),
  );
}

export function getTopFoods(range: Range = 'week') {
  return api.get<ApiResponse<TopFood[]>>('/v1/stats/top-foods', rangeQuery(range));
}

export function getRecords() {
  return api.get<ApiResponse<Records>>('/v1/stats/records');
}

export function getInsights(range: Range = 'week') {
  return api.get<ApiResponse<Insight[]>>('/v1/stats/insights', rangeQuery(range));
}
