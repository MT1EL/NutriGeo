import { api } from './client';
import type { ApiResponse, Integration, IntegrationProvider } from './types';

export function listIntegrations() {
  return api.get<ApiResponse<Integration[]>>('/v1/integrations');
}

export function connectAppleHealth() {
  return api.post<ApiResponse<Integration>>('/v1/integrations/apple_health/connect');
}

export function connectStrava() {
  return api.post<ApiResponse<{ authorize_url: string }>>(
    '/v1/integrations/strava/connect',
  );
}

export function stravaCallback(code: string) {
  return api.post<ApiResponse<Integration>>('/v1/integrations/strava/callback', {
    code,
  });
}

export function syncIntegration(provider: IntegrationProvider) {
  return api.post<ApiResponse<{ ok: true; synced_at: string }>>(
    `/v1/integrations/${provider}/sync`,
  );
}

export function updateIntegrationDataTypes(
  provider: IntegrationProvider,
  enabled: string[],
) {
  return api.put<ApiResponse<Integration>>(
    `/v1/integrations/${provider}/data-types`,
    { enabled },
  );
}

export function disconnectIntegration(provider: IntegrationProvider) {
  return api.delete<ApiResponse<{ ok: true }>>(`/v1/integrations/${provider}`);
}
