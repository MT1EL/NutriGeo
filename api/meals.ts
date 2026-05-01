import { api } from './client';
import type { ApiResponse, FoodLogEntry, MealKey } from './types';

export type MealSummary = {
  meal_key: MealKey;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  entries: FoodLogEntry[];
};

export type DayMeals = {
  date: string;
  totals: {
    kcal: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    fiber_g?: number;
  };
  meals: MealSummary[];
};

export function getTodayMeals() {
  return api.get<ApiResponse<DayMeals>>('/v1/meals/today');
}

export function getTodayMealByKey(mealKey: MealKey) {
  return api.get<ApiResponse<MealSummary>>(`/v1/meals/today/${mealKey}`);
}

export function getMealsByDate(date: string) {
  return api.get<ApiResponse<DayMeals>>('/v1/meals', { query: { date } });
}
