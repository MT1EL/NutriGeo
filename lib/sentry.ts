import Constants from "expo-constants";
import * as Sentry from "@sentry/react-native";

// Init runs at module load (imported once from app/_layout.tsx). The DSN comes
// from app.json's extra.sentryDsn — leave empty in dev, set in EAS secrets for
// preview/production. With an empty DSN, Sentry.init no-ops cleanly.
const dsn = (Constants.expoConfig?.extra as { sentryDsn?: string } | undefined)
  ?.sentryDsn;

if (dsn) {
  Sentry.init({
    dsn,
    // Send a fraction of transactions for performance monitoring. Tune later;
    // 0.1 keeps cost predictable on a small subscriber base.
    tracesSampleRate: 0.1,
    // Surface PII only when we ask for it. Default off.
    sendDefaultPii: false,
    // Disable in dev so local errors don't pollute the production project.
    enabled: !__DEV__,
  });
}

export { Sentry };
