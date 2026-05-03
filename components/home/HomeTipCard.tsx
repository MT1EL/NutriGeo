import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { tipIndexForToday } from "@/utils/dailyTip";
import { router } from "expo-router";
import { ChevronRight, Sparkles } from "lucide-react-native";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

const TIP_POOL_SIZE = 15;

// Daily motivational/educational one-liner. Same string for everyone on
// a given date (rotated by day-of-year). The CTA hands off to the
// premium coach screen for the actual personalized analysis.
export default function HomeTipCard() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const tip = useMemo(() => {
    const idx = tipIndexForToday(TIP_POOL_SIZE);
    return t(`home.tips.${idx}`);
  }, [t]);

  return (
    <BaseCard style={styles.card} flat>
      <View style={[styles.iconWrap, { backgroundColor: theme.brandSoft }]}>
        <Sparkles color={theme.brand} size={20} />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.tip}>{tip}</ThemedText>
        <Pressable
          onPress={() => router.push("/coach")}
          hitSlop={6}
          style={({ pressed }) => [
            styles.cta,
            pressed && { opacity: 0.6 },
          ]}
        >
          <ThemedText style={styles.ctaText} color={theme.brand}>
            {t("home.tipCta")}
          </ThemedText>
          <ChevronRight color={theme.brand} size={14} />
        </Pressable>
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: Spacing.md,
    padding: Spacing.lg,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    gap: Spacing.sm,
  },
  tip: {
    fontSize: Type.sm,
    lineHeight: 20,
    fontWeight: "500",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    alignSelf: "flex-start",
  },
  ctaText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
