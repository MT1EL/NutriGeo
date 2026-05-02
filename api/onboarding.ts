import { api } from './client';
import type {
  ActivityLevel,
  ApiResponse,
  Diet,
  GoalType,
  Language,
  Sex,
  Units,
} from './types';

export type OnboardingInput = {
  name: string;
  biological_sex: Sex;
  birth_date: string;
  height_cm: number;
  weight_kg: number;
  activity_level: ActivityLevel;
  goal_type: GoalType;
  target_weight_kg?: number;
  weekly_pace_kg?: number;
  diet: Diet;
  allergies: string[];
  restrictions: string[];
  timezone: string;
  language: Language;
  units: Units;
};

export function submitOnboarding(input: OnboardingInput) {
  return api.post<ApiResponse<{ ok: true }>>('/v1/onboarding', input);
}
