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
  User,
  UserGoals,
  UserProfile,
} from "./types";

// Re-export the canonical types so callers that imported them from
// `@/api/profile` keep compiling. Source of truth is `@/api/types`.
export type { GoalType, User, UserGoals as Goals, UserProfile as Profile };

export type PersonalInput = {
  name: string;
  biological_sex: Sex;
  birth_date: string;
  // In the user's stored units. Optional `units` switches the system.
  height: number;
  weight: number;
  units?: Units;
};

export type GoalsInput = {
  goal_type: GoalType;
  activity_level: ActivityLevel;
  // In the user's stored units; backend reads `units` from the user record.
  target_weight?: number;
  weekly_pace?: number;
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
  return api.put<ApiResponse<UserProfile>>("/v1/profile/personal", input);
}

export function updateGoals(input: GoalsInput) {
  return api.put<ApiResponse<UserGoals>>("/v1/profile/goals", input);
}

export function updateHealth(input: HealthInput) {
  return api.put<ApiResponse<UserProfile>>("/v1/profile/health", input);
}

export function updateSettings(input: SettingsInput) {
  return api.put<ApiResponse<UserProfile>>("/v1/profile/settings", input);
}

export function requestExport(format: "json" | "csv" = "json") {
  return api.post<ApiResponse<ExportJob>>("/v1/profile/export", { format });
}

export function getExportJob(jobId: string) {
  return api.get<ApiResponse<ExportJob>>(`/v1/profile/export/${jobId}`);
}
