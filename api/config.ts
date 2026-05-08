function detectDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function resolveBaseUrl(): string {
  // 1. Highest priority: EAS injected env var
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Fallback for local development
  if (__DEV__) {
    return "http://localhost:3000"; // or your machine IP: e.g. http://192.168.1.XX:3000
  }

  // 3. Safety net
  throw new Error(
    "EXPO_PUBLIC_API_URL is not configured. Please set it in EAS Environment Variables.",
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
