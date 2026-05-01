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

export function getWaterToday() {
  return api.get<ApiResponse<{ entries: WaterEntry[]; total_ml: number }>>('/v1/water');
}

export function deleteWater(id: string) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/water/${id}`);
}
