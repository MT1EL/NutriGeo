export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type Paginated<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total?: number;
    has_more?: boolean;
  };
};

export type Range = 'day' | 'week' | 'month' | 'year';
export type MealKey = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type Sex = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type GoalType = 'lose' | 'maintain' | 'gain';
export type Diet = 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo';
export type Units = 'metric' | 'imperial';
export type Theme = 'light' | 'dark' | 'system';
export type Language = 'ka' | 'en' | 'ru';
export type IntegrationProvider = 'apple_health' | 'google_fit' | 'strava' | 'garmin';

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: User;
};

export type User = {
  id: string;
  email: string;
  name?: string;
  email_verified?: boolean;
  created_at?: string;
};

export type Food = {
  id: string;
  name: string;
  brand?: string;
  serving_label?: string;
  serving_grams?: number;
  kcal_per_100g: number;
  protein_g_per_100g: number;
  carbs_g_per_100g: number;
  fat_g_per_100g: number;
  fiber_g_per_100g?: number;
  is_custom?: boolean;
};

export type FoodLogEntry = {
  id: string;
  food_id: string;
  meal_key: MealKey;
  quantity: number;
  logged_at: string;
  food?: Food;
};

export type Recipe = {
  id: string;
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
  ingredients?: { qty: string; name: string }[];
  steps?: { text: string; duration_min?: number }[];
  rating?: number;
  saved?: boolean;
};

export type Article = {
  id: string;
  title: string;
  excerpt?: string;
  body?: string;
  image_url?: string;
  category?: string;
  read_min?: number;
  bookmarked?: boolean;
  read_pct?: number;
};

export type WeightEntry = {
  id: string;
  weight_kg: number;
  recorded_at: string;
  source?: 'manual' | 'apple_health' | 'google_fit';
};

export type WaterEntry = {
  id: string;
  amount_ml: number;
  logged_at: string;
};

export type StepsEntry = {
  date: string;
  count: number;
  source?: string;
};

export type WorkoutEntry = {
  id?: string;
  type: string;
  duration_min: number;
  kcal_burned?: number;
  started_at: string;
  source?: string;
};

export type Integration = {
  provider: IntegrationProvider;
  connected: boolean;
  enabled_data_types?: string[];
  last_sync_at?: string;
};

export type NotificationPreferences = {
  all_enabled: boolean;
  meal_reminders: boolean;
  water_reminders: boolean;
  streak_keeper: boolean;
  weekly_summary: boolean;
  motivational: boolean;
  social: boolean;
};

export type PremiumStatus = {
  active: boolean;
  product_id?: string;
  expires_at?: string;
  will_renew?: boolean;
};

export type ExportJob = {
  id: string;
  status: 'pending' | 'processing' | 'ready' | 'failed';
  format: 'json' | 'csv';
  download_url?: string;
  created_at: string;
};
