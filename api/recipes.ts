import { api } from './client';
import type {
  ApiResponse,
  Paginated,
  Recipe,
  RecipeRating,
} from './types';

export type ListRecipesParams = {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  diet?: string;
  q?: string;
};

export function listRecipes(params: ListRecipesParams = {}) {
  const { page = 1, limit = 20, ...rest } = params;
  return api.get<Paginated<Recipe>>('/v1/recipes', {
    query: { page, limit, ...rest },
  });
}

export function getFeaturedRecipes() {
  return api.get<ApiResponse<Recipe[]>>('/v1/recipes/featured');
}

export function getSavedRecipes() {
  return api.get<ApiResponse<Recipe[]>>('/v1/recipes/saved');
}

export function getRecipeById(id: string) {
  return api.get<ApiResponse<Recipe>>(`/v1/recipes/${id}`);
}

export function saveRecipe(id: string) {
  return api.post<ApiResponse<{ ok: true }>>(`/v1/recipes/${id}/save`);
}

export function unsaveRecipe(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/recipes/${id}/save`);
}

export type RateRecipeResponse = {
  rating: RecipeRating;
  my_rating: number;
};

export function rateRecipe(id: string, rating: number) {
  return api.post<ApiResponse<RateRecipeResponse>>(
    `/v1/recipes/${id}/rate`,
    { rating },
  );
}

export type CreateRecipeInput = {
  title: string;
  description?: string;
  image_url?: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  duration_min: number;
  servings: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  category?: string;
  dietary_tags?: string[];
  ingredients: { qty: string; name: string }[];
  steps: { text: string; duration_min?: number }[];
};

export function createCustomRecipe(input: CreateRecipeInput) {
  return api.post<ApiResponse<Recipe>>('/v1/recipes', input);
}
