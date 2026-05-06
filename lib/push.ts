import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

// Foreground display behavior. We want banner + sound but no badge mutation —
// badge counting would require a server-driven unread state we don't have.
let handlerConfigured = false;
export function configureNotificationHandler() {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Android requires explicit notification channels for SDK 26+ — without one,
// notifications get dropped silently on newer devices. Run once on boot.
async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: "#4A90E2",
  });
}

export type PushTokenResult =
  | { ok: true; token: string }
  | { ok: false; reason: "unsupported" | "denied" | "error"; detail?: string };

// Request notification permission and resolve to an Expo push token.
// Returns { ok: false } on simulators (no real APNs/FCM connection),
// permission denial, or any underlying error — caller decides what to do.
export async function getPushToken(): Promise<PushTokenResult> {
  if (Platform.OS === "web") {
    return { ok: false, reason: "unsupported" };
  }
  if (!Device.isDevice) {
    return { ok: false, reason: "unsupported", detail: "simulator" };
  }

  await ensureAndroidChannel();

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== "granted") {
    const next = await Notifications.requestPermissionsAsync();
    status = next.status;
  }
  if (status !== "granted") {
    return { ok: false, reason: "denied" };
  }

  // SDK 49+ requires the EAS projectId; fall back through the two locations
  // Expo has historically stored it.
  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants.easConfig as { projectId?: string } | undefined)?.projectId;

  try {
    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    );
    return { ok: true, token: tokenResponse.data };
  } catch (err) {
    return {
      ok: false,
      reason: "error",
      detail: err instanceof Error ? err.message : "unknown",
    };
  }
}

export function pushPlatform(): "ios" | "android" | "web" {
  if (Platform.OS === "ios") return "ios";
  if (Platform.OS === "android") return "android";
  return "web";
}
