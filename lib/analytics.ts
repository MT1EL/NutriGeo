import type { PostHogEventProperties } from "@posthog/core";
import Constants from "expo-constants";
import PostHog from "posthog-react-native";

// Single PostHog client for the whole app. Reads its config from app.json's
// `extra` block; left empty in dev so events aren't reported, populated via
// EAS env / app config for preview & production builds.
type Extra = {
  posthogApiKey?: string;
  posthogHost?: string;
};

const extra = (Constants.expoConfig?.extra as Extra | undefined) ?? {};
const apiKey = extra.posthogApiKey;
const host = extra.posthogHost ?? "https://us.i.posthog.com";

let client: PostHog | null = null;

if (apiKey && !__DEV__) {
  // Skip in __DEV__ so local clicks don't pollute the production project.
  // Flip the condition (or set a dev-only project key) once we want to test
  // event wiring against a staging PostHog project.
  client = new PostHog(apiKey, {
    host,
    // Auto-emits "Application Opened/Backgrounded/Updated/Installed" so we
    // can build retention curves without instrumenting them by hand.
    captureAppLifecycleEvents: true,
  });
}

// Property values must be JSON-serializable. Keep them flat: strings, numbers,
// booleans. Don't pass nested objects unless you've checked PostHog renders
// them sensibly in the dashboard.
export type EventProperties = PostHogEventProperties;

// Track a single event. Use snake_case names; properties are flat key-values.
// Don't put PII in here (no email, no full name) — distinct ID is enough to
// correlate events to the user via identify() below.
export function track(event: string, properties?: EventProperties): void {
  client?.capture(event, properties);
}

// Associate the current device with a stable user ID. Call right after auth
// resolves to a logged-in user, and on app boot when we hydrate an existing
// session. Safe to call repeatedly with the same ID.
export function identify(
  distinctId: string,
  properties?: EventProperties,
): void {
  client?.identify(distinctId, properties);
}

// Drop the current user association. Call on sign-out so the next session on
// the same device starts as an anonymous visitor.
export function resetIdentity(): void {
  client?.reset();
}

export function getAnalyticsClient(): PostHog | null {
  return client;
}
