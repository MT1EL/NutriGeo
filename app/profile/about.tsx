import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import Constants from "expo-constants";
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
import { useTranslation } from "react-i18next";
import { Linking, StyleSheet, useColorScheme, View } from "react-native";

export default function AboutScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const appVersion = Constants.expoConfig?.version ?? "—";
  const nativeBuild = Constants.nativeBuildVersion;

  return (
    <SubScreenLayout
      title={t("about.subtitle")}
      subtitle={`Forma · v${appVersion}`}
    >
      <BaseCard style={styles.heroCard}>
        <View style={[styles.logo, { backgroundColor: theme.brandSoft }]}>
          <ThemedText style={styles.logoText} color={theme.brand}>
            M
          </ThemedText>
        </View>
        <View style={{ alignItems: "center", gap: 4 }}>
          <ThemedText style={styles.appName}>Forma</ThemedText>
          <ThemedText type="secondary" style={styles.tagline}>
            {t("about.tagline")}
          </ThemedText>
        </View>
        <View
          style={[styles.versionPill, { backgroundColor: theme.borderLight }]}
        >
          <ThemedText style={styles.versionText} type="secondary">
            {t("about.version")} {appVersion}
            {nativeBuild ? ` · build ${nativeBuild}` : ""}
          </ThemedText>
        </View>
      </BaseCard>

      <SettingsGroup title={t("about.legal")}>
        <SettingsRow
          Icon={Shield}
          iconColor={theme.brand}
          iconTint={theme.brandSoft}
          label={t("privacy.title")}
          onPress={() => router.push("/profile/privacy")}
        />
        <SettingsRow
          Icon={FileText}
          iconColor="#5B6CE0"
          iconTint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
          label={t("terms.title")}
          onPress={() => router.push("/terms")}
        />
      </SettingsGroup>

      <SettingsGroup title={t("about.engage")}>
        <SettingsRow
          Icon={Star}
          iconColor="#FFB020"
          iconTint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
          label={t("about.rateInStore")}
          onPress={() => Linking.openURL("https://apps.apple.com/")}
        />
        <SettingsRow
          Icon={Mail}
          iconColor="#34A867"
          iconTint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
          label={t("about.contact")}
          hint="hello@forma.app"
          onPress={() => Linking.openURL("mailto:hello@forma.app")}
        />
        <SettingsRow
          Icon={Code}
          label={t("about.openSource")}
          hint="github.com/forma"
          onPress={() => Linking.openURL("https://github.com/")}
        />
      </SettingsGroup>

      <SettingsGroup title={t("about.title")}>
        <SettingsRow
          Icon={ExternalLink}
          label={t("about.website")}
          hint="forma.app"
          onPress={() => Linking.openURL("https://forma.app/")}
        />
      </SettingsGroup>

      <View style={styles.creditsWrap}>
        <View style={styles.creditsLine}>
          <ThemedText type="secondary" style={styles.credits}>
            {t("about.madeWith")}
          </ThemedText>
          <Heart color="#FF6B9D" size={12} fill="#FF6B9D" />
          <ThemedText type="secondary" style={styles.credits}>
            {t("about.tbilisi")}
          </ThemedText>
        </View>
        <ThemedText type="secondary" style={styles.copyright}>
          {t("about.rights")}
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
