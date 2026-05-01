import { api } from './client';
import type { ApiResponse, Range, StepsEntry } from './types';

export function syncSteps(entries: StepsEntry[]) {
  return api.post<ApiResponse<{ accepted: number }>>('/v1/steps/sync', { entries });
}

export function getSteps(range: Range = 'week') {
  return api.get<ApiResponse<StepsEntry[]>>('/v1/steps', { query: { range } });
}
