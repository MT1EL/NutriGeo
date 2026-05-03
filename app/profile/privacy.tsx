import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Shield } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function PrivacyScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const SECTIONS: { h: string; p: string }[] = [
    { h: t("privacy.section1Title"), p: t("privacy.section1Body") },
    { h: t("privacy.section2Title"), p: t("privacy.section2Body") },
    { h: t("privacy.section3Title"), p: t("privacy.section3Body") },
    { h: t("privacy.section4Title"), p: t("privacy.section4Body") },
    { h: t("privacy.section5Title"), p: t("privacy.section5Body") },
    {
      h: t("privacy.section6Title"),
      p: t("privacy.section6Body", { date: t("legal.lastUpdatedDate") }),
    },
  ];

  return (
    <SubScreenLayout
      title={t("privacy.title")}
      subtitle={t("privacy.subtitle")}
    >
      <View style={styles.heroIconWrap}>
        <View style={[styles.heroIcon, { backgroundColor: theme.brandSoft }]}>
          <Shield color={theme.brand} size={28} />
        </View>
      </View>

      <ThemedText style={styles.intro} type="secondary">
        {t("privacy.intro")}
      </ThemedText>

      <View style={{ gap: Spacing.lg }}>
        {SECTIONS.map((s) => (
          <View key={s.h} style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.h}>{s.h}</ThemedText>
            <ThemedText style={styles.p} type="secondary">
              {s.p}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText style={styles.footer} type="secondary">
        {t("privacy.lastUpdated", { date: t("legal.lastUpdatedDate") })}
      </ThemedText>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  heroIconWrap: {
    alignItems: "center",
    paddingTop: Spacing.sm,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  intro: {
    fontSize: Type.base,
    lineHeight: 22,
  },
  h: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  p: {
    fontSize: Type.sm,
    lineHeight: 22,
  },
  footer: {
    fontSize: Type.xs,
    textAlign: "center",
    opacity: 0.7,
    marginTop: Spacing.lg,
  },
});
