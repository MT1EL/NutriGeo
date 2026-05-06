import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { FileText } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function TermsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const SECTIONS: { h: string; p: string }[] = [
    { h: t("terms.section1Title"), p: t("terms.section1Body") },
    { h: t("terms.section2Title"), p: t("terms.section2Body") },
    { h: t("terms.section3Title"), p: t("terms.section3Body") },
    { h: t("terms.section4Title"), p: t("terms.section4Body") },
    { h: t("terms.section5Title"), p: t("terms.section5Body") },
    { h: t("terms.section6Title"), p: t("terms.section6Body") },
    { h: t("terms.section7Title"), p: t("terms.section7Body") },
  ];

  return (
    <SubScreenLayout title={t("terms.title")} subtitle={t("terms.subtitle")}>
      <View style={styles.heroIconWrap}>
        <View style={[styles.heroIcon, { backgroundColor: theme.brandSoft }]}>
          <FileText color={theme.brand} size={28} />
        </View>
      </View>

      <ThemedText style={styles.intro} type="secondary">
        {t("terms.intro")}
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
        {t("terms.effectiveFrom", { date: t("legal.effectiveFromDate") })}
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
