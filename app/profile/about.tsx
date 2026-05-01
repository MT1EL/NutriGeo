import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import {
  Code,
  ExternalLink,
  FileText,
  Heart,
  Mail,
  Shield,
  Star,
} from "lucide-react-native";
import React from "react";
import { Linking, StyleSheet, useColorScheme, View } from "react-native";

export default function AboutScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <SubScreenLayout title="აპლიკაციის შესახებ" subtitle="NutriGeo · v1.0.0">
      <BaseCard style={styles.heroCard}>
        <View style={[styles.logo, { backgroundColor: theme.brandSoft }]}>
          <ThemedText style={styles.logoText} color={theme.brand}>
            N
          </ThemedText>
        </View>
        <View style={{ alignItems: "center", gap: 4 }}>
          <ThemedText style={styles.appName}>NutriGeo</ThemedText>
          <ThemedText type="secondary" style={styles.tagline}>
            შენი ნუტრიციის გზამკვლევი
          </ThemedText>
        </View>
        <View
          style={[
            styles.versionPill,
            { backgroundColor: theme.borderLight },
          ]}
        >
          <ThemedText style={styles.versionText} type="secondary">
            ვერსია 1.0.0 · build 100
          </ThemedText>
        </View>
      </BaseCard>

      <SettingsGroup title="სამართლებრივი">
        <SettingsRow
          Icon={Shield}
          iconColor={theme.brand}
          iconTint={theme.brandSoft}
          label="კონფიდენციალურობა"
          onPress={() => router.push("/profile/privacy")}
        />
        <SettingsRow
          Icon={FileText}
          iconColor="#5B6CE0"
          iconTint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
          label="წესები და პირობები"
          onPress={() => router.push("/profile/terms")}
        />
      </SettingsGroup>

      <SettingsGroup title="ჩართეთ">
        <SettingsRow
          Icon={Star}
          iconColor="#FFB020"
          iconTint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
          label="შეაფასე App Store-ში"
          onPress={() => Linking.openURL("https://apps.apple.com/")}
        />
        <SettingsRow
          Icon={Mail}
          iconColor="#34A867"
          iconTint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
          label="დაგვიკავშირდი"
          hint="hello@nutrigeo.ge"
          onPress={() => Linking.openURL("mailto:hello@nutrigeo.ge")}
        />
        <SettingsRow
          Icon={Code}
          label="ღია წყარო"
          hint="github.com/nutrigeo"
          onPress={() => Linking.openURL("https://github.com/")}
        />
      </SettingsGroup>

      <SettingsGroup title="ჩვენ შესახებ">
        <SettingsRow
          Icon={ExternalLink}
          label="ვებგვერდი"
          hint="nutrigeo.ge"
          onPress={() => Linking.openURL("https://nutrigeo.ge/")}
        />
      </SettingsGroup>

      <View style={styles.creditsWrap}>
        <View style={styles.creditsLine}>
          <ThemedText type="secondary" style={styles.credits}>
            შექმნილია სიყვარულით
          </ThemedText>
          <Heart color="#FF6B9D" size={12} fill="#FF6B9D" />
          <ThemedText type="secondary" style={styles.credits}>
            თბილისში 🇬🇪
          </ThemedText>
        </View>
        <ThemedText type="secondary" style={styles.copyright}>
          © 2026 NutriGeo. ყველა უფლება დაცულია.
        </ThemedText>
      </View>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: "center",
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: 44,
    fontWeight: "800",
  },
  appName: {
    fontSize: Type.xxl,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: Type.sm,
  },
  versionPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
  },
  versionText: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  creditsWrap: {
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.md,
  },
  creditsLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  credits: {
    fontSize: Type.xs,
  },
  copyright: {
    fontSize: 10,
    marginTop: 2,
  },
});
