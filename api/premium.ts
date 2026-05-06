import { api } from './client';
import type { ApiResponse, PremiumStatus } from './types';

export type PremiumProduct = {
  id: string;
  title: string;
  description?: string;
  price_string: string;
  period: 'monthly' | 'yearly' | 'lifetime';
};

export function getPremiumStatus() {
  return api.get<ApiResponse<PremiumStatus>>('/v1/premium/status');
}

export function getPremiumProducts() {
  return api.get<ApiResponse<PremiumProduct[]>>('/v1/premium/products');
}

export function restorePremium() {
  return api.post<ApiResponse<PremiumStatus>>('/v1/premium/restore');
}
