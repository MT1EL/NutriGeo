import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemeSelector from "@/components/settings/ThemeSelector";
import UnitsSegment from "@/components/settings/UnitsSegment";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
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
import { Alert, Linking, StyleSheet, useColorScheme } from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
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
    Alert.alert(
      "მონაცემის ექსპორტი",
      "გამოიგზავნება შენს ელფოსტაზე CSV ფაილის სახით. გაგრძელება?",
      [
        { text: "გაუქმება", style: "cancel" },
        { text: "გაგზავნა", onPress: requestExport },
      ],
    );

  const confirmDeleteAccount = () =>
    Alert.alert(
      "ანგარიშის წაშლა",
      "ყველა მონაცემი — კვების ჩანაწერები, მიზნები, სტრიკი — სამუდამოდ წაიშლება. გაგრძელება?",
      [
        { text: "გაუქმება", style: "cancel" },
        {
          text: "წაშლა",
          style: "destructive",
          onPress: () =>
            Alert.alert(
              "დადასტურდი",
              "ეს მოქმედება უკან არ ბრუნდება. ნამდვილად გინდა?",
              [
                { text: "არა", style: "cancel" },
                { text: "კი, წაშალე", style: "destructive", onPress: deleteAccount },
              ],
            ),
        },
      ],
    );

  return (
    <SubScreenLayout title="პარამეტრები" subtitle="ერთეულები, თემა, მონაცემები">
      <UnitsSegment value={units} onChange={setUnits} disabled={isSavingSettings} />
      <ThemeSelector
        value={themeMode}
        onChange={setThemeMode}
        disabled={isSavingSettings}
      />

      <SettingsGroup title="მონაცემები">
        <SettingsRow
          Icon={Upload}
          iconColor={theme.brand}
          iconTint={theme.brandSoft}
          label="მონაცემის ექსპორტი"
          hint={isExporting ? "მუშავდება..." : "CSV ფაილი"}
          onPress={confirmExport}
        />
        <SettingsRow
          Icon={Database}
          iconColor="#5B6CE0"
          iconTint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
          label="სარეზერვო ასლი"
          hint="iCloud · ბოლო: დღეს"
          onPress={() =>
            Alert.alert(
              "სინქრონიზაცია",
              "ბოლო ასლი: დღეს, 09:14. გავიმეორო ახლავე?",
              [
                { text: "გაუქმება", style: "cancel" },
                {
                  text: "სინქრონიზაცია",
                  onPress: () =>
                    Alert.alert("მზადაა", "შენი მონაცემები სინქრონიზებულია."),
                },
              ],
            )
          }
        />
      </SettingsGroup>

      <SettingsGroup title="უსაფრთხოება">
        <SettingsRow
          Icon={Lock}
          iconColor="#7C5CFF"
          iconTint={colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE"}
          label="პაროლის შეცვლა"
          onPress={() => router.push("/profile/change-password")}
        />
        <SettingsRow
          Icon={Shield}
          iconColor="#34A867"
          iconTint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
          label="კონფიდენციალურობა"
          onPress={() => router.push("/profile/privacy")}
        />
      </SettingsGroup>

      <SettingsGroup title="აპლიკაცია">
        <SettingsRow
          Icon={Star}
          iconColor="#FFB020"
          iconTint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
          label="შეაფასე NutriGeo"
          onPress={() =>
            Alert.alert(
              "მადლობა შენი მხარდაჭერისთვის!",
              "App Store-ზე გადახვალ შეფასების დასატოვებლად.",
              [
                { text: "მოგვიანებით", style: "cancel" },
                {
                  text: "შეფასება",
                  onPress: () => Linking.openURL("https://apps.apple.com/"),
                },
              ],
            )
          }
        />
        <SettingsRow
          Icon={HelpCircle}
          iconColor="#3FA9F5"
          iconTint={colorScheme === "dark" ? "#102A3A" : "#E5F3FE"}
          label="დახმარების ცენტრი"
          onPress={() => router.push("/profile/help")}
        />
        <SettingsRow
          Icon={FileText}
          label="წესები და პირობები"
          onPress={() => router.push("/profile/terms")}
        />
        <SettingsRow
          Icon={Info}
          label="აპლიკაციის შესახებ"
          value={`v${Constants.expoConfig?.version ?? "—"}`}
          rightAccessory="value"
          onPress={() => router.push("/profile/about")}
        />
      </SettingsGroup>

      <SettingsGroup title="საშიში ზონა">
        <SettingsRow
          Icon={Trash2}
          iconColor={theme.error}
          iconTint={theme.error + "1A"}
          label="ანგარიშის წაშლა"
          hint="ეს მოქმედება უკან არ ბრუნდება"
          destructive
          onPress={confirmDeleteAccount}
        />
      </SettingsGroup>

      <ThemedText style={styles.footer} type="secondary">
        NutriGeo · შექმნილია სიყვარულით 🇬🇪
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
