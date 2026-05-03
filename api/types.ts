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

export type Range = "day" | "week" | "month" | "year";
export type MealKey = "breakfast" | "lunch" | "dinner" | "snack";
export type Sex = "male" | "female" | "other";
export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";
export type GoalType = "lose" | "maintain" | "gain";
export type Diet =
  | "none"
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "keto"
  | "paleo";
export type Units = "metric" | "imperial";
export type Theme = "light" | "dark" | "system";
export type Language = "ka" | "en" | "ru";
export type IntegrationProvider =
  | "apple_health"
  | "google_fit"
  | "strava"
  | "garmin";

export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: User;
};

export type UserGoals = {
  activity_level: ActivityLevel;
  carbs_g_goal: number;
  carbs_pct: number;
  daily_calorie_target: number;
  fat_g_goal: number;
  fat_pct: number;
  goal_type: GoalType;
  protein_g_goal: number;
  protein_pct: number;
  target_weight_kg: number | null;
  weekly_pace_kg: number;
};

export type UserHealth = {
  allergies: string[];
  diet: Diet;
  restrictions: string[];
};

export type UserProfile = {
  age: number;
  avatar_url: string | null;
  birth_date: string;
  biological_sex: Sex;
  height_cm: number;
  language: Language;
  name: string | null;
  onboarded_at: string | null;
  theme: Theme;
  timezone: string;
  units: Units;
  weight_kg: number;
};

export type User = {
  id: string;
  email: string;
  email_verified: boolean;
  is_premium: boolean;
  goals: UserGoals;
  health: UserHealth;
  profile: UserProfile;
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
  // "user" = created by the current user (editable/deletable). "system" or
  // anything else = catalog food.
  source?: "user" | "system" | string;
  image_url?: string;
};

export type FoodLogQuantityUnit = "servings" | "grams";

export type FoodLogEntry = {
  id: string;
  food_id: string;
  meal_key: MealKey;
  quantity: number;
  // Unit `quantity` is expressed in. Missing/undefined → treat as "servings"
  // for back-compat with entries logged before the field existed.
  unit?: FoodLogQuantityUnit;
  logged_at: string;
  food: Food;
};

export type RecipeRating = {
  avg_rating: number;
  rating_count: number;
};

export type Recipe = {
  id: string;
  title: string;
  description?: string;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g?: number;
  duration_min: number;
  servings: number;
  difficulty?: "easy" | "medium" | "hard";
  category?: string;
  dietary_tags?: string[];
  ingredients?: { qty: string; name: string }[];
  steps?: { text: string; duration_min?: number }[];
  rating: RecipeRating;
  saved?: boolean;
  cover_url?: string;
  // Populated only on GET /v1/recipes/:id — backend returns up to 3 actually
  // related recipes (shared category/tags/cuisine), not a generic catalog page.
  related?: Recipe[];
};

export type ArticleAuthor = {
  name: string;
  avatar_url?: string;
};

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string };

export type Article = {
  id: string;
  title: string;
  excerpt?: string;
  body_blocks?: ArticleBlock[];
  category_slug: string;
  category_label: string;
  category_color?: string;
  tags?: string[];
  author: ArticleAuthor;
  published_at?: string;
  read_min?: number;
  bookmarked: boolean;
  read_pct: number;
  read_at: string | null;
  cover_url?: string;
};

export type ArticleCategory = {
  slug: string;
  label: string;
  color?: string;
  count: number;
};

export type WeightEntry = {
  id: string;
  weight_kg: number;
  // ISO YYYY-MM-DD in the user's timezone — use this for date comparisons
  // (logged_at is a UTC instant and can roll back a day for eastern TZs).
  log_date: string;
  // ISO timestamp (UTC).
  logged_at: string;
  source?: "manual" | "apple_health" | "google_fit";
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
  status: "pending" | "processing" | "ready" | "failed";
  format: "json" | "csv";
  download_url?: string;
  created_at: string;
};
