import { getDailyAdvice } from "@/api/advice";
import { HttpError } from "@/api/client";
import BaseCard from "@/components/cards/BaseCard";
import Skeleton from "@/components/ui/Skeleton";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ChevronRight, Sparkles } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

// Personalized one-liner from /v1/advice/daily. Server picks the rule and
// localizes the text; client just renders it. CTA is server-supplied when
// the rule has a deeplink (low_logging, weight_stale); otherwise we fall
// back to the static "Read full analysis" → /coach handoff.
export default function HomeTipCard() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const adviceQuery = useQuery({
    queryKey: ["advice", "daily"],
    queryFn: () => getDailyAdvice(),
    // Backend returns deterministic content per (user, date); 30 min keeps
    // the home tab snappy without missing the daily rollover.
    staleTime: 30 * 60_000,
    retry: (count, err) => !(err instanceof HttpError && err.status === 404),
  });

  const advice = adviceQuery.data?.data;

  // Pre-onboarded users get 404 no_data. Hide the card entirely rather than
  // showing a fallback string that would look orphaned.
  if (
    adviceQuery.error instanceof HttpError &&
    adviceQuery.error.status === 404
  ) {
    return null;
  }

  const text = advice?.text;
  const ctaLabel = advice?.cta?.label ?? t("home.tipCta");
  const ctaTarget = advice?.cta?.deeplink ?? "/coach";

  return (
    <BaseCard style={styles.card} flat>
      <View style={[styles.iconWrap, { backgroundColor: theme.brandSoft }]}>
        <Sparkles color={theme.brand} size={20} />
      </View>
      <View style={styles.content}>
        {text ? (
          <ThemedText style={styles.tip}>{text}</ThemedText>
        ) : (
          <View style={{ gap: 6 }}>
            <Skeleton height={14} width="100%" />
            <Skeleton height={14} width="80%" />
          </View>
        )}
        <Pressable
          onPress={() => router.push(ctaTarget as never)}
          hitSlop={6}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.6 }]}
        >
          <ThemedText style={styles.ctaText} color={theme.brand}>
            {ctaLabel}
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
