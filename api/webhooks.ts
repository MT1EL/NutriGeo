import { api } from './client';
import type { ApiResponse } from './types';

export type RevenueCatEventType =
  | 'INITIAL_PURCHASE'
  | 'RENEWAL'
  | 'CANCELLATION'
  | 'EXPIRATION'
  | 'BILLING_ISSUE'
  | 'PRODUCT_CHANGE'
  | 'NON_RENEWING_PURCHASE'
  | 'UNCANCELLATION';

export type RevenueCatEvent = {
  type: RevenueCatEventType;
  app_user_id: string;
  product_id: string;
  transaction_id?: string;
  purchased_at_ms?: number;
  expiration_at_ms?: number;
};

export function postRevenueCatWebhook(event: RevenueCatEvent, secret: string) {
  return api.post<ApiResponse<{ ok: true }>>(
    '/webhooks/revenuecat',
    { event },
    {
      auth: false,
      headers: { Authorization: `Bearer ${secret}` },
    },
  );
}
