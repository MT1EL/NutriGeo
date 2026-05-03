import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors, Radius } from "@/constants/theme";
import {
  ChartLine,
  CirclePlus,
  House,
  Search,
  User,
} from "lucide-react-native";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TAB_BAR_BASE = 64;
// Generous static estimate (icon area + worst-case bottom inset) so screens can
// safely add their own bottom padding without importing the safe-area hook.
export const TAB_BAR_HEIGHT = 100;

type IconRenderProps = {
  Icon: React.ComponentType<{ size: number; color: string }>;
  focused: boolean;
  theme: ReturnType<typeof getTheme>;
};

const getTheme = (scheme: "light" | "dark") => Colors[scheme];

const TabIcon = ({ Icon, focused, theme }: IconRenderProps) => (
  <View
    style={[
      styles.iconWrap,
      focused && {
        backgroundColor: theme.brandSoft,
      },
    ]}
  >
    <Icon size={24} color={focused ? theme.brand : theme.tabIconDefault} />
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme() || "light";
  const theme = getTheme(colorScheme);
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.brand,
        tabBarInactiveTintColor: theme.tabIconDefault,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          ...styles.tabBarStyle,
          backgroundColor: theme.card,
          borderColor: theme.borderLight,
          shadowColor: theme.shadow,
          height: TAB_BAR_BASE + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarItemStyle: { paddingTop: 6 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={House} focused={focused} theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={Search} focused={focused} theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={CirclePlus} focused={focused} theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={ChartLine} focused={focused} theme={theme} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon Icon={User} focused={focused} theme={theme} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
    ...Platform.select({
      ios: {
        shadowOpacity: 1,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 12 },
    }),
  },
  iconWrap: {
    width: 44,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});
