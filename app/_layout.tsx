import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Appearance, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { registerPushToken } from "@/api/notifications";
import { Colors } from "@/constants/theme";
import { ActiveDateProvider } from "@/contexts/ActiveDateContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import i18n, { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n";
import { identify, resetIdentity } from "@/lib/analytics";
import { configurePurchases, logoutPurchases } from "@/lib/purchases";
import {
  configureNotificationHandler,
  getPushToken,
  pushPlatform,
} from "@/lib/push";
import { Sentry } from "@/lib/sentry";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";

// Push the user's saved theme preference into RN's Appearance system so every
// `useColorScheme()` consumer (i.e. the whole app) follows it. Setting the
// override to null reverts to the OS default — correct when not signed in or
// when the user picked "system".
function ThemeSync() {
  const { user } = useAuth();
  const pref = user?.profile?.theme;

  useEffect(() => {
    const override = !pref || pref === "system" ? null : pref;
    Appearance.setColorScheme(override);
  }, [pref]);

  return null;
}

// Bind/unbind the PostHog distinct ID to the auth user. We track the previous
// id in a ref so reset() only fires on real sign-outs, not the brief null
// during initial token hydration.
function AnalyticsIdentitySync() {
  const { user } = useAuth();
  const lastIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    const id = user?.id ?? null;
    if (id === lastIdRef.current) return;
    if (id) {
      identify(id);
    } else if (lastIdRef.current) {
      resetIdentity();
    }
    lastIdRef.current = id;
  }, [user?.id]);

  return null;
}

// Configure RevenueCat once and keep its user identity in sync with the
// auth user. Anonymous installs get configured with no appUserID; on sign-in
// we logIn() so any anonymous purchases attach to the named account.
function PurchasesSync() {
  const { user } = useAuth();
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const userId = user?.id ?? null;

    if (!userId && lastUserIdRef.current) {
      void logoutPurchases();
      lastUserIdRef.current = null;
      return;
    }

    if (userId === lastUserIdRef.current) return;
    void configurePurchases(userId);
    lastUserIdRef.current = userId;
  }, [user?.id]);

  return null;
}

// Register the device's Expo push token with the backend after sign-in.
// Dedupes via SecureStore so a re-mount or a re-launch with the same
// (user, token) pair doesn't re-POST. Silently skips simulators, web,
// and permission-denied — settings screen can later resurface a
// "turn on notifications" prompt if needed.
const LAST_PUSH_REGISTRATION_KEY = "forma.last_push_registration";
function PushRegistrationSync() {
  const { user } = useAuth();
  const inFlight = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    configureNotificationHandler();
  }, []);

  useEffect(() => {
    const userId = user?.id ?? null;

    // Sign-out transition: clear the cached registration so the next
    // user (or this user re-signing in) re-registers cleanly. Server-
    // side cleanup of the now-orphaned token mapping is a v1.1 task.
    if (!userId && lastUserIdRef.current) {
      void SecureStore.deleteItemAsync(LAST_PUSH_REGISTRATION_KEY).catch(
        () => {},
      );
      lastUserIdRef.current = null;
      return;
    }

    if (!userId || inFlight.current || lastUserIdRef.current === userId) {
      return;
    }

    let cancelled = false;
    inFlight.current = true;
    (async () => {
      try {
        const result = await getPushToken();
        if (cancelled || !result.ok) return;

        const cacheKey = `${userId}:${result.token}`;
        const persisted = await SecureStore.getItemAsync(
          LAST_PUSH_REGISTRATION_KEY,
        );
        if (persisted === cacheKey) {
          lastUserIdRef.current = userId;
          return;
        }

        await registerPushToken({
          token: result.token,
          platform: pushPlatform(),
        });
        await SecureStore.setItemAsync(LAST_PUSH_REGISTRATION_KEY, cacheKey);
        lastUserIdRef.current = userId;
      } catch {
        // Network blip or backend transient error — try again on next mount.
      } finally {
        inFlight.current = false;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  return null;
}

// On login, adopt the language saved on the user's account so the choice
// follows them across devices. The local SecureStore listener in i18n/index.ts
// will persist whatever we set here, so subsequent boots stay correct.
function ProfileLanguageSync() {
  const { user } = useAuth();
  const serverLang = user?.profile?.language;

  useEffect(() => {
    if (!serverLang) return;
    const code = serverLang.split("-")[0] as SupportedLanguage;
    if (!(SUPPORTED_LANGUAGES as readonly string[]).includes(code)) return;
    if (i18n.language?.split("-")[0] === code) return;
    void i18n.changeLanguage(code);
  }, [serverLang]);

  return null;
}

// Routes that an unauthenticated user is allowed to land on.
const PUBLIC_AUTH_SCREENS = new Set([
  "Login",
  "Register",
  "ForgotPassword",
  "ResetPassword",
]);

// Routes inside (auth) that an authenticated user is allowed to stay on
// (rest of (auth) bounces them to the tabs).
const AUTHENTICATED_AUTH_SCREENS = new Set(["Wizard", "Success"]);

function AuthGate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme() || "light";

  const inAuthGroup = segments[0] === "(auth)";
  const currentLeaf = segments[segments.length - 1];
  const allowedHere =
    status === "unauthenticated"
      ? inAuthGroup && PUBLIC_AUTH_SCREENS.has(currentLeaf)
      : status === "authenticated"
        ? !inAuthGroup || AUTHENTICATED_AUTH_SCREENS.has(currentLeaf)
        : false;

  useEffect(() => {
    if (status === "loading" || allowedHere) return;
    if (status === "unauthenticated") {
      router.replace("/Login");
    } else if (inAuthGroup && currentLeaf === "Register") {
      router.replace("/Wizard");
    } else {
      router.replace("/(tabs)");
    }
  }, [status, allowedHere, inAuthGroup, currentLeaf, router]);

  if (status === "loading" || !allowedHere) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: Colors[colorScheme].surface,
        }}
      >
        <ActivityIndicator color={Colors[colorScheme].brand} />
      </View>
    );
  }

  return <>{children}</>;
}

// On language switch, refetch every query: server responses are localized via
// the Accept-Language header, so the previous language's payload is stale.
function LanguageSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onChange = () => queryClient.invalidateQueries();
    i18n.on("languageChanged", onChange);
    return () => {
      i18n.off("languageChanged", onChange);
    };
  }, [queryClient]);

  return null;
}

const queryClient = new QueryClient();

function RootLayout() {
  const colorScheme = useColorScheme() || "light";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <QueryClientProvider client={queryClient}>
            <LanguageSync />
            <ToastProvider>
              <AuthProvider>
                <ThemeSync />
                <ProfileLanguageSync />
                <AnalyticsIdentitySync />
                <PurchasesSync />
                <PushRegistrationSync />
                <ActiveDateProvider>
                  <AuthGate>
                    <Stack>
                      <Stack.Screen
                        name="(auth)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="articles"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="recipes"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="profile"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="coach"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="meal-plan"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="meal/[meal]"
                        options={{
                          headerShown: false,
                          presentation: "modal",
                          sheetAllowedDetents: "fitToContents",
                          contentStyle: { backgroundColor: "transparent" },
                        }}
                      />
                    </Stack>
                    <StatusBar style="auto" />
                  </AuthGate>
                </ActiveDateProvider>
              </AuthProvider>
            </ToastProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Wrap with Sentry so unhandled render errors are reported with a stack trace
// and the offending component tree. No-op when DSN is empty.
export default Sentry.wrap(RootLayout);
