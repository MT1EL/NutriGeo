import { api } from "./client";
import type {
  ActivityLevel,
  ApiResponse,
  Diet,
  ExportJob,
  Language,
  Sex,
  Theme,
  Units,
} from "./types";
export type GoalType = "lose" | "gain" | "maintain";

export type WeeklyPaceOptions = {
  min: number;
  max: number;
  presets: number[];
};

export type Goals = {
  goal_type: GoalType;
  target_weight_kg: number;
  weekly_pace_kg: number;

  daily_calorie_target: number;

  bmr_kcal: number | null;
  tdee_kcal: number | null;
  activity_kcal: number | null;
  calorie_adjustment_kcal: number | null;

  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;

  protein_g_goal: number | null;
  carbs_g_goal: number | null;
  fat_g_goal: number | null;

  weekly_pace_options: WeeklyPaceOptions;
};

export type Profile = {
  name: string;
  avatar_url: string | null;

  biological_sex: "male" | "female";
  birth_date: string; // ISO string
  age: number;

  height_cm: number;
  weight_kg: number;

  language: Language;
  units: "metric" | "imperial";
  theme: "light" | "dark" | "system";
  timezone: string;

  onboarded_at: string; // ISO string
};

export type User = {
  id: string;
  email: string;
  email_verified: boolean;

  profile: Profile;
  goals: Goals;
};

export type PersonalInput = {
  name: string;
  biological_sex: Sex;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
};

export type GoalsInput = {
  goal_type: GoalType;
  target_weight_kg?: number;
  weekly_pace_kg?: number;
  activity_level: ActivityLevel;
  daily_calorie_target?: number;
  protein_pct?: number;
  carbs_pct?: number;
  fat_pct?: number;
};

export type HealthInput = {
  diet: Diet;
  allergies: string[];
  restrictions: string[];
};

export type SettingsInput = {
  units: Units;
  theme: Theme;
  language: Language;
  timezone: string;
};

export function getProfile() {
  return api.get<ApiResponse<User>>("/v1/profile");
}

export function updatePersonal(input: PersonalInput) {
  return api.put<ApiResponse<Profile>>("/v1/profile/personal", input);
}

export function updateGoals(input: GoalsInput) {
  return api.put<ApiResponse<Profile>>("/v1/profile/goals", input);
}

export function updateHealth(input: HealthInput) {
  return api.put<ApiResponse<Profile>>("/v1/profile/health", input);
}

export function updateSettings(input: SettingsInput) {
  return api.put<ApiResponse<Profile>>("/v1/profile/settings", input);
}

export function requestExport(format: "json" | "csv" = "json") {
  return api.post<ApiResponse<ExportJob>>("/v1/profile/export", { format });
}

export function getExportJob(jobId: string) {
  return api.get<ApiResponse<ExportJob>>(`/v1/profile/export/${jobId}`);
}
