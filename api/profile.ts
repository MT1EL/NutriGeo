import { api } from "./client";
import type {
  ActivityLevel,
  ApiResponse,
  Diet,
  ExportJob,
  GoalType,
  Language,
  Sex,
  Theme,
  Units,
} from "./types";

export type Profile = {
  id: string;
  name: string | null;
  display_name: string | null;
  avatar_url: string | null;
  email_verified_at: string | null;
  last_seen_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  onboarded_at: string | null;

  birth_date: string;
  age: number;
  biological_sex: Sex;
  height_cm: number;
  weight_kg: number;
  height: number;
  weight: number;

  activity_level: ActivityLevel;
  goal_type: GoalType;
  goal_weight: number | null;
  goal_body_fat: number | null;
  target_weight_kg: number | null;
  weekly_pace_kg: number;
  goal_baseline_weight_kg: number | null;

  daily_calorie_target: number;
  protein_pct: number;
  carbs_pct: number;
  fat_pct: number;
  protein_g_goal: number;
  carbs_g_goal: number;
  fat_g_goal: number;

  diet: Diet;
  allergies: string[];
  restrictions: string[];

  chest: number | null;
  waist: number | null;
  hips: number | null;
  body_fat: number | null;

  language: Language;
  units: Units;
  theme: Theme;
  timezone: string;
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
  return api.get<ApiResponse<Profile>>("/v1/profile");
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

export function uploadAvatar(file: {
  uri: string;
  name: string;
  type: string;
}) {
  const form = new FormData();
  form.append("avatar", {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  return api.post<ApiResponse<{ avatar_url: string }>>(
    "/v1/profile/avatar",
    form,
  );
}

export function requestExport(format: "json" | "csv" = "json") {
  return api.post<ApiResponse<ExportJob>>("/v1/profile/export", { format });
}

export function getExportJob(jobId: string) {
  return api.get<ApiResponse<ExportJob>>(`/v1/profile/export/${jobId}`);
}
