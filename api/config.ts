function detectDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

function resolveBaseUrl(): string {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (url && url.length > 0) return url;
  if (__DEV__) return 'http://localhost:3000';
  throw new Error(
    'EXPO_PUBLIC_API_URL is not set. Configure it via `eas env:create EXPO_PUBLIC_API_URL` for the build profile.',
  );
}

export const API_CONFIG = {
  baseUrl: resolveBaseUrl(),
  defaultTimezone: detectDeviceTimezone(),
};

export function setBaseUrl(url: string) {
  API_CONFIG.baseUrl = url;
}

export function setDefaultTimezone(tz: string) {
  API_CONFIG.defaultTimezone = tz;
}
