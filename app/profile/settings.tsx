import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemeSelector from "@/components/settings/ThemeSelector";
import UnitsSegment from "@/components/settings/UnitsSegment";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { usePremium } from "@/hooks/use-premium";
import { useRequirePremium } from "@/hooks/use-require-premium";
import { useSettings } from "@/hooks/use-settings";
import Constants from "expo-constants";
import { router } from "expo-router";
import {
  Database,
  FileText,
  HelpCircle,
  Info,
  Lock,
  Shield,
  Star,
  Trash2,
  Upload,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Alert, Linking, StyleSheet, useColorScheme } from "react-native";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { isPremium } = usePremium();
  const requirePremium = useRequirePremium();
  const {
    units,
    themeMode,
    isSavingSettings,
    isExporting,
    setUnits,
    setThemeMode,
    requestExport,
    deleteAccount,
  } = useSettings();

  const confirmExport = () =>
    requirePremium(
      () =>
        Alert.alert(t("settings.exportTitle"), t("settings.exportConfirm"), [
          { text: t("common.cancel"), style: "cancel" },
          { text: t("common.send"), onPress: requestExport },
        ]),
      { featureName: t("settings.exportTitle") },
    );

  const confirmBackup = () =>
    requirePremium(
      () =>
        Alert.alert(t("settings.sync"), t("settings.lastBackup"), [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("settings.sync"),
            onPress: () =>
              Alert.alert(t("common.done"), t("settings.syncedDescription")),
          },
        ]),
      { featureName: t("settings.backup") },
    );

  const confirmDeleteAccount = () =>
    Alert.alert(
      t("settings.deleteAccount"),
      t("settings.deleteAccountConfirm"),
      [
        { text: t("common.cancel"), style: "cancel" },
        {
          text: t("common.delete"),
          style: "destructive",
          onPress: () =>
            Alert.alert(
              t("common.confirm"),
              t("settings.irreversibleConfirm"),
              [
                { text: t("common.no"), style: "cancel" },
                {
                  text: t("settings.yesDelete"),
                  style: "destructive",
                  onPress: deleteAccount,
                },
              ],
            ),
        },
      ],
    );
  return (
    <SubScreenLayout
      title={t("settings.title")}
      subtitle={t("settings.subtitle")}
    >
      <UnitsSegment
        value={units}
        onChange={setUnits}
        disabled={isSavingSettings}
      />
      <ThemeSelector
        value={themeMode}
        onChange={setThemeMode}
        disabled={isSavingSettings}
      />

      <SettingsGroup title={t("settings.data")}>
        <SettingsRow
          Icon={Upload}
          iconColor={theme.brand}
          iconTint={theme.brandSoft}
          label={t("settings.exportTitle")}
          hint={isExporting ? t("common.processing") : t("settings.exportFile")}
          onPress={confirmExport}
          premiumLocked={!isPremium}
        />
        <SettingsRow
          Icon={Database}
          iconColor="#5B6CE0"
          iconTint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
          label={t("settings.backup")}
          hint={t("settings.iCloudLast")}
          onPress={confirmBackup}
          premiumLocked={!isPremium}
        />
      </SettingsGroup>

      <SettingsGroup title={t("settings.security")}>
        <SettingsRow
          Icon={Lock}
          iconColor="#7C5CFF"
          iconTint={colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE"}
          label={t("changePassword.title")}
          onPress={() => router.push("/profile/change-password")}
        />
        <SettingsRow
          Icon={Shield}
          iconColor="#34A867"
          iconTint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
          label={t("privacy.title")}
          onPress={() => router.push("/profile/privacy")}
        />
      </SettingsGroup>

      <SettingsGroup title={t("settings.appSection")}>
        <SettingsRow
          Icon={Star}
          iconColor="#FFB020"
          iconTint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
          label={t("about.rate")}
          onPress={() =>
            Alert.alert(t("about.thanks"), t("about.rateRedirect"), [
              { text: t("common.later"), style: "cancel" },
              {
                text: t("recipes.rating"),
                onPress: () => Linking.openURL("https://apps.apple.com/"),
              },
            ])
          }
        />
        <SettingsRow
          Icon={HelpCircle}
          iconColor="#3FA9F5"
          iconTint={colorScheme === "dark" ? "#102A3A" : "#E5F3FE"}
          label={t("help.title")}
          onPress={() => router.push("/profile/help")}
        />
        <SettingsRow
          Icon={FileText}
          label={t("terms.title")}
          onPress={() => router.push("/terms")}
        />
        <SettingsRow
          Icon={Info}
          label={t("about.subtitle")}
          value={`v${Constants.expoConfig?.version ?? "—"}`}
          rightAccessory="value"
          onPress={() => router.push("/profile/about")}
        />
      </SettingsGroup>

      <SettingsGroup title={t("settings.danger")}>
        <SettingsRow
          Icon={Trash2}
          iconColor={theme.error}
          iconTint={theme.error + "1A"}
          label={t("settings.deleteAccount")}
          hint={t("settings.irreversible")}
          destructive
          onPress={confirmDeleteAccount}
        />
      </SettingsGroup>

      <ThemedText style={styles.footer} type="secondary">
        {t("settings.footerCredit")}
      </ThemedText>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    textAlign: "center",
    fontSize: Type.xs,
    marginTop: Spacing.lg,
  },
});
