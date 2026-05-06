import { api } from './client';
import type { ApiResponse, Range, StepsEntry } from './types';

export function syncSteps(entries: StepsEntry[]) {
  return api.post<ApiResponse<{ accepted: number }>>('/v1/steps/sync', { entries });
}

export function getSteps(range: Range = 'week') {
  return api.get<ApiResponse<StepsEntry[]>>('/v1/steps', { query: { range } });
}

// Single-day mode (date wins over range when both are sent). Returns one
// `{ date, count }` object, not an array.
export function getStepsByDate(date: string) {
  return api.get<ApiResponse<{ date: string; count: number }>>('/v1/steps', {
    query: { date },
  });
}
