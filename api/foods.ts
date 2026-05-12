import { MealKey } from "@/constants/meals";
import { api } from "./client";
import type {
  ApiResponse,
  Food,
  Paginated,
  SuggestedFoodsResponse,
} from "./types";

export type ListFoodsParams = {
  page?: number;
  limit?: number;
};

export type suggestedFoodParams = {
  page?: number;
  limit?: number;
  meal_type: MealKey;
};

export function listFoods({ page = 1, limit = 50 }: ListFoodsParams = {}) {
  return api.get<Paginated<Food>>("/v1/foods", {
    query: { page, limit },
  });
}

export function listSuggestedFoods({
  limit = 5,
  meal_type,
}: suggestedFoodParams) {
  return api.get<ApiResponse<SuggestedFoodsResponse>>("/v1/foods/suggestions", {
    query: { limit, meal_type },
  });
}

export type SearchFoodsParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export function searchFoods({ q, page = 1, limit = 20 }: SearchFoodsParams) {
  return api.get<Paginated<Food>>("/v1/foods/search", {
    query: { ...(q ? { q } : {}), page, limit },
  });
}

export function getFrequentFoods({ limit = 5 }) {
  return api.get<ApiResponse<Food[]>>("/v1/foods/frequent", {
    query: { limit },
  });
}

export function getRecentFoods({ limit = 5 }) {
  return api.get<ApiResponse<Food[]>>("/v1/foods/recent", {
    query: { limit },
  });
}

export function getFavoriteFoods({ limit = 5 }) {
  return api.get<ApiResponse<Food[]>>("/v1/foods/favorites", {
    query: { limit },
  });
}

// User's own custom-created foods (source === "user").
export function getMyFoods() {
  return api.get<ApiResponse<Food[]>>("/v1/foods/mine");
}

export function favoriteFood(foodId: string) {
  return api.post<ApiResponse<{ ok: true }>>(`/v1/foods/favorites/${foodId}`);
}

export function unfavoriteFood(foodId: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/foods/favorites/${foodId}`);
}

export function getFoodByBarcode(code: string) {
  return api.get<ApiResponse<Food>>(
    `/v1/foods/barcode/${encodeURIComponent(code)}`,
  );
}

export type CreateFoodInput = {
  name: string;
  brand?: string;
  serving_label?: string;
  serving_grams?: number;
  kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  fiber_g_per_100g?: number;
  // null explicitly clears an existing image; undefined leaves it unchanged.
  image_url?: string | null;
};

export function createCustomFood(input: CreateFoodInput) {
  return api.post<ApiResponse<Food>>("/v1/foods", input);
}

export function updateCustomFood(id: string, input: Partial<CreateFoodInput>) {
  return api.put<ApiResponse<Food>>(`/v1/foods/${id}`, input);
}

export function deleteCustomFood(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/foods/${id}`);
}

export function recognizeFoodByImage(imageUrl: string) {
  return api.post<ApiResponse<{ candidates: Food[] }>>("/v1/foods/recognize", {
    image_url: imageUrl,
  });
}

export function recognizeFoodByVoice(transcript: string) {
  return api.post<ApiResponse<{ candidates: Food[] }>>("/v1/foods/voice", {
    transcript,
  });
}

export function getFoodById(id: string) {
  return api.get<ApiResponse<Food>>(`/v1/foods/${id}`);
}
