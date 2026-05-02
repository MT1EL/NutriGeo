import { makeIdempotencyKey } from '@/utils/idempotency';
import { api } from './client';
import type {
  ApiResponse,
  FoodLogEntry,
  FoodLogQuantityUnit,
  MealKey,
} from './types';

export type CreateFoodLogInput = {
  food_id: string;
  meal_key: MealKey;
  quantity: number;
  // Unit `quantity` is in. Backend defaults to "servings" if omitted.
  unit?: FoodLogQuantityUnit;
  logged_at?: string;
};

export function createFoodLog(input: CreateFoodLogInput, idempotencyKey?: string) {
  return api.post<ApiResponse<FoodLogEntry>>('/v1/food-log', input, {
    idempotencyKey: idempotencyKey ?? makeIdempotencyKey(),
  });
}

export function getFoodLog(params: { date: string } | { from: string; to: string }) {
  return api.get<ApiResponse<FoodLogEntry[]>>('/v1/food-log', { query: params });
}

export function updateFoodLog(id: string, input: Partial<CreateFoodLogInput>) {
  return api.put<ApiResponse<FoodLogEntry>>(`/v1/food-log/${id}`, input);
}

export function deleteFoodLog(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/food-log/${id}`);
}
