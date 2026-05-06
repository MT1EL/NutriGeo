import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Bell,
  BellOff,
  Calendar,
  Coffee,
  Droplet,
  Flame,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useNotifications } from "@/hooks/use-notifications";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const { prefs, allOn, update, setAllOn, setAllOff } = useNotifications();

  return (
    <SubScreenLayout
      title={t("notifications.title")}
      subtitle={t("notifications.subtitle")}
    >
      {/* BANNER */}
      <View
        style={[
          styles.banner,
          {
            backgroundColor: allOn ? theme.brandSoft : theme.borderLight,
          },
        ]}
      >
        <View
          style={[
            styles.bannerIcon,
            {
              backgroundColor: allOn ? theme.brand : theme.textSecondary,
            },
          ]}
        >
          {allOn ? (
            <Bell color="#fff" size={20} />
          ) : (
            <BellOff color="#fff" size={20} />
          )}
        </View>

        <View style={{ flex: 1 }}>
          <ThemedText style={styles.bannerTitle}>
            {allOn ? t("notifications.allOn") : t("notifications.allOff")}
          </ThemedText>

          <ThemedText type="secondary" style={styles.bannerSub}>
            {allOn
              ? t("notifications.morePersistent")
              : t("notifications.noReminders")}
          </ThemedText>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={allOn ? setAllOff : setAllOn}
          style={[styles.bannerBtn, { backgroundColor: theme.card }]}
        >
          <ThemedText style={styles.bannerBtnText} color={theme.brand}>
            {allOn ? t("notifications.off") : t("notifications.on")}
          </ThemedText>
        </TouchableOpacity>
      </View>

      {/* DAILY */}
      <SettingsGroup title={t("notifications.groupDaily")}>
        <SettingsRow
          Icon={Coffee}
          iconColor="#E8A02C"
          iconTint={colorScheme === "dark" ? "#3A2E10" : "#FEF6E4"}
          label={t("notifications.mealReminder")}
          hint={t("notifications.mealReminderHint")}
          rightAccessory="switch"
          switchOn={prefs.mealReminders}
          onSwitchChange={(v) => update({ mealReminders: v })}
        />

        <SettingsRow
          Icon={Droplet}
          iconColor="#3FA9F5"
          iconTint={colorScheme === "dark" ? "#102A3A" : "#E5F3FE"}
          label={t("notifications.waterReminder")}
          hint={t("notifications.waterReminderHint")}
          rightAccessory="switch"
          switchOn={prefs.waterReminders}
          onSwitchChange={(v) => update({ waterReminders: v })}
        />

        <SettingsRow
          Icon={Flame}
          iconColor="#FF7A45"
          iconTint={colorScheme === "dark" ? "#3A2010" : "#FEEDE2"}
          label={t("notifications.streakKeeper")}
          hint={t("notifications.streakKeeperHint")}
          rightAccessory="switch"
          switchOn={prefs.streakKeeper}
          onSwitchChange={(v) => update({ streakKeeper: v })}
        />
      </SettingsGroup>

      {/* SUMMARY */}
      <SettingsGroup title={t("notifications.groupSummary")}>
        <SettingsRow
          Icon={Calendar}
          iconColor="#5B6CE0"
          iconTint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
          label={t("notifications.weeklyReport")}
          hint={t("notifications.weeklyReportHint")}
          rightAccessory="switch"
          switchOn={prefs.weeklySummary}
          onSwitchChange={(v) => update({ weeklySummary: v })}
        />

        <SettingsRow
          Icon={Trophy}
          iconColor="#FFB020"
          iconTint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
          label={t("notifications.achievements")}
          hint={t("notifications.achievementsHint")}
          rightAccessory="switch"
          switchOn={prefs.motivational}
          onSwitchChange={(v) => update({ motivational: v })}
        />
      </SettingsGroup>

      {/* EXTRA */}
      <SettingsGroup title={t("notifications.groupExtra")}>
        <SettingsRow
          Icon={Sparkles}
          iconColor="#7C5CFF"
          iconTint={colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE"}
          label={t("notifications.motivation")}
          hint={t("notifications.motivationHint")}
          rightAccessory="switch"
          switchOn={prefs.motivational}
          onSwitchChange={(v) => update({ motivational: v })}
        />

        <SettingsRow
          Icon={Users}
          iconColor="#E85A8C"
          iconTint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
          label={t("notifications.social")}
          hint={t("notifications.socialHint")}
          rightAccessory="switch"
          switchOn={prefs.social}
          onSwitchChange={(v) => update({ social: v })}
        />
      </SettingsGroup>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  bannerSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  bannerBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    minWidth: 76,
    alignItems: "center",
  },
  bannerBtnText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
});
