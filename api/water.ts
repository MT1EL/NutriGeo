import { makeIdempotencyKey } from '@/utils/idempotency';
import { api } from './client';
import type { ApiResponse, WaterEntry } from './types';

export function logWater(amountMl: number, idempotencyKey?: string) {
  return api.post<ApiResponse<WaterEntry>>(
    '/v1/water',
    { amount_ml: amountMl },
    { idempotencyKey: idempotencyKey ?? makeIdempotencyKey() },
  );
}

// Today's totals when no date is passed; specific day's totals when ISO
// YYYY-MM-DD is passed (backend resolves "today" via X-Timezone).
export function getWater(date?: string) {
  return api.get<
    ApiResponse<{ entries: WaterEntry[]; total_ml: number; date: string }>
  >('/v1/water', date ? { query: { date } } : undefined);
}

export function deleteWater(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/water/${id}`);
}
