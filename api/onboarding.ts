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
  // Numbers are interpreted using the `units` field below.
  height: number;
  weight: number;
  activity_level: ActivityLevel;
  goal_type: GoalType;
  target_weight?: number;
  weekly_pace?: number;
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
