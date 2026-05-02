function detectDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  defaultTimezone: detectDeviceTimezone(),
};

export function setBaseUrl(url: string) {
  API_CONFIG.baseUrl = url;
}

export function setDefaultTimezone(tz: string) {
  API_CONFIG.defaultTimezone = tz;
}
