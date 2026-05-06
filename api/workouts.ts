import { api } from './client';
import type { ApiResponse, Range, WorkoutEntry } from './types';

export function syncWorkouts(entries: WorkoutEntry[]) {
  return api.post<ApiResponse<{ accepted: number }>>('/v1/workouts/sync', { entries });
}

export function getWorkouts(range: Range = 'week') {
  return api.get<ApiResponse<WorkoutEntry[]>>('/v1/workouts', {
    query: { range },
  });
}
