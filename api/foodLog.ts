import { makeIdempotencyKey } from "@/utils/idempotency";
import { api } from "./client";
import type {
  ApiResponse,
  FoodLogEntry,
  FoodLogQuantityUnit,
  MealKey,
  QuickAddPayload,
} from "./types";

// Catalog-food path: log an existing Food at a given quantity.
export type CreateFoodLogFoodInput = {
  food_id: string;
  meal_key: MealKey;
  quantity: number;
  // Unit `quantity` is in. Backend defaults to "servings" if omitted.
  unit?: FoodLogQuantityUnit;
  logged_at?: string;
};

// Quick-add path: log inline macros without a Food row.
export type CreateFoodLogQuickAddInput = {
  meal_key: MealKey;
  quick_add: QuickAddPayload;
  logged_at?: string;
};

export type CreateFoodLogInput =
  | CreateFoodLogFoodInput
  | CreateFoodLogQuickAddInput;

export function createFoodLog(
  input: CreateFoodLogInput,
  idempotencyKey?: string,
) {
  return api.post<ApiResponse<FoodLogEntry>>("/v1/food-log", input, {
    idempotencyKey: idempotencyKey ?? makeIdempotencyKey(),
  });
}

export function getFoodLog(
  params: { date: string } | { from: string; to: string },
) {
  return api.get<ApiResponse<FoodLogEntry[]>>("/v1/food-log", {
    query: params,
  });
}

export type UpdateFoodLogInput = Partial<CreateFoodLogFoodInput> & {
  quick_add?: QuickAddPayload;
};

export function updateFoodLog(id: string, input: UpdateFoodLogInput) {
  return api.put<ApiResponse<FoodLogEntry>>(`/v1/food-log/${id}`, input);
}

export function deleteFoodLog(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/food-log/${id}`);
}
