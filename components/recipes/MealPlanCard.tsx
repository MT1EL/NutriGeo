import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { usePremium } from "@/hooks/use-premium";
import { router } from "expo-router";
import { CalendarDays, ChevronRight, Crown } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

// Top-of-Recipes-tab entry into the weekly meal plan. Free users get a
// crown-locked card that routes to the upgrade screen; premium users get
// a live card linking into /meal-plan.
export default function MealPlanCard() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { isPremium } = usePremium();

  const onPress = () => {
    if (isPremium) router.push("/meal-plan");
    else router.push("/profile/premium");
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [pressed && { opacity: 0.85 }]}
    >
      <BaseCard
        style={[
          styles.card,
          isPremium
            ? { backgroundColor: theme.brand }
            : { backgroundColor: theme.card },
        ]}
        flat={!isPremium}
      >
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: isPremium
                ? "rgba(255,255,255,0.18)"
                : theme.brandSoft,
            },
          ]}
        >
          <CalendarDays
            color={isPremium ? "#FFFFFF" : theme.brand}
            size={22}
          />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <View style={styles.titleRow}>
            <ThemedText
              style={styles.title}
              color={isPremium ? "#FFFFFF" : theme.text}
            >
              {isPremium
                ? t("mealPlan.tabCardActiveTitle")
                : t("mealPlan.tabCardLockedTitle")}
            </ThemedText>
            {!isPremium && (
              <View style={[styles.badge, { backgroundColor: theme.brandSoft }]}>
                <Crown color={theme.brand} size={11} />
              </View>
            )}
          </View>
          <ThemedText
            style={styles.body}
            color={isPremium ? "#FFFFFFCC" : theme.textSecondary}
          >
            {isPremium
              ? t("mealPlan.tabCardActiveBody")
              : t("mealPlan.tabCardLockedBody")}
          </ThemedText>
        </View>
        <ChevronRight
          color={isPremium ? "#FFFFFF" : theme.textSecondary}
          size={18}
        />
      </BaseCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderWidth: 0,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: Type.base,
    fontWeight: "800",
  },
  badge: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    fontSize: Type.xs,
    lineHeight: 18,
  },
});
