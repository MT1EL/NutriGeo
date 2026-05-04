import * as Sentry from "@sentry/react-native";

// DSN comes from the EXPO_PUBLIC_SENTRY_DSN env var. Configure it via:
//   - Local dev: `.env` file (Expo CLI inlines EXPO_PUBLIC_* automatically).
//   - EAS builds: `eas env:create EXPO_PUBLIC_SENTRY_DSN` per environment,
//     or set inline in eas.json's per-profile `env` block.
// Empty DSN → Sentry.init no-ops cleanly. Dev runs are also silenced via
// `enabled: !__DEV__` so local errors never leak into the prod project.
const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Fraction of transactions captured for performance monitoring.
    // 0.1 keeps cost predictable on a small subscriber base; tune later.
    tracesSampleRate: 0.1,
    // Surface PII only when we ask for it. Default off.
    sendDefaultPii: false,
    enabled: !__DEV__,
  });
}

export { Sentry };
