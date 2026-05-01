import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme() || "light";

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      {/* <SafeAreaView
        style={{ flex: 1, backgroundColor: Colors[colorScheme].surface }}
      > */}
      <Stack initialRouteName="(auth)">
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
      {/* </SafeAreaView> */}
    </ThemeProvider>
  );
}
