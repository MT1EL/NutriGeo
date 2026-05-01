import { api } from './client';
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
} from './types';

export type Profile = {
  personal: PersonalInput;
  goals: GoalsInput;
  health: HealthInput;
  settings: SettingsInput;
  avatar_url?: string;
};

export type PersonalInput = {
  name: string;
  sex: Sex;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
};

export type GoalsInput = {
  goal_type: GoalType;
  target_weight_kg?: number;
  weekly_pace_kg?: number;
  activity_level: ActivityLevel;
  daily_calorie_goal?: number;
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
  return api.get<ApiResponse<Profile>>('/v1/profile');
}

export function updatePersonal(input: PersonalInput) {
  return api.put<ApiResponse<Profile>>('/v1/profile/personal', input);
}

export function updateGoals(input: GoalsInput) {
  return api.put<ApiResponse<Profile>>('/v1/profile/goals', input);
}

export function updateHealth(input: HealthInput) {
  return api.put<ApiResponse<Profile>>('/v1/profile/health', input);
}

export function updateSettings(input: SettingsInput) {
  return api.put<ApiResponse<Profile>>('/v1/profile/settings', input);
}

export function uploadAvatar(file: { uri: string; name: string; type: string }) {
  const form = new FormData();
  form.append('avatar', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as unknown as Blob);
  return api.post<ApiResponse<{ avatar_url: string }>>('/v1/profile/avatar', form);
}

export function requestExport(format: 'json' | 'csv' = 'json') {
  return api.post<ApiResponse<ExportJob>>('/v1/profile/export', { format });
}

export function getExportJob(jobId: string) {
  return api.get<ApiResponse<ExportJob>>(`/v1/profile/export/${jobId}`);
}
