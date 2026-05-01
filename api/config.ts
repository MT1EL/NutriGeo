export const API_CONFIG = {
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000',
  defaultTimezone: 'Asia/Tbilisi',
};

export function setBaseUrl(url: string) {
  API_CONFIG.baseUrl = url;
}

export function setDefaultTimezone(tz: string) {
  API_CONFIG.defaultTimezone = tz;
}
