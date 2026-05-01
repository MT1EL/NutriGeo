import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import {
  ChartLine,
  CirclePlus,
  House,
  Search,
  User,
} from "lucide-react-native";
import { StyleSheet, useColorScheme } from "react-native";
export const TAB_BAR_HEIGHT = 92;
export default function TabLayout() {
  const colorScheme = useColorScheme() || "light";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].brand,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          ...styles.tabBarStyle,
          borderColor: Colors[colorScheme].border,
          backgroundColor: Colors[colorScheme].background,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: "Recipes",
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => <CirclePlus size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: "Statistics",
          tabBarIcon: ({ color }) => <ChartLine size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarStyle: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 0,

    paddingTop: 12,

    borderRadius: 20,

    height: 92,

    borderWidth: 1,

    elevation: 0, // Android shadow off
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
});
