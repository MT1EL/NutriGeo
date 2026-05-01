import { api } from './client';
import type { ApiResponse, NotificationPreferences } from './types';

export function getNotificationPreferences() {
  return api.get<ApiResponse<NotificationPreferences>>(
    '/v1/notifications/preferences',
  );
}

export function updateNotificationPreferences(prefs: NotificationPreferences) {
  return api.put<ApiResponse<NotificationPreferences>>(
    '/v1/notifications/preferences',
    prefs,
  );
}

export type RegisterPushTokenInput = {
  token: string;
  platform: 'ios' | 'android' | 'web';
};

export function registerPushToken(input: RegisterPushTokenInput) {
  return api.post<ApiResponse<{ ok: true }>>('/v1/notifications/push-tokens', input);
}

export function deletePushToken(token: string) {
  return api.delete<ApiResponse<{ ok: true }>>(
    `/v1/notifications/push-tokens/${encodeURIComponent(token)}`,
  );
}
