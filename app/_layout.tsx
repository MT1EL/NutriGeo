import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-reanimated";

import { Colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

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

export default function RootLayout() {
  const colorScheme = useColorScheme() || "light";

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <ToastProvider>
          <AuthProvider>
            <AuthGate>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="articles" options={{ headerShown: false }} />
                <Stack.Screen name="recipes" options={{ headerShown: false }} />
                <Stack.Screen name="profile" options={{ headerShown: false }} />
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
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
