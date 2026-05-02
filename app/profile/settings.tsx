import { deleteMe } from "@/api/me";
import {
  getProfile,
  requestExport,
  updateSettings,
  type SettingsInput,
} from "@/api/profile";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Constants from "expo-constants";
import { router } from "expo-router";
import {
  Database,
  FileText,
  Globe,
  HelpCircle,
  Info,
  Lock,
  Moon,
  Ruler,
  Shield,
  Star,
  Sun,
  Trash2,
  Upload,
} from "lucide-react-native";
import {
  Alert,
  Linking,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const PROFILE_QUERY_KEY = ["Profile"] as const;

type Units = "metric" | "imperial";
type ThemeMode = "system" | "light" | "dark";

export default function SettingsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();
  const { signOut, refreshUser } = useAuth();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });
  const profile = profileQuery.data?.data;

  const units = (profile?.units as Units) ?? "metric";
  const themeMode = (profile?.theme as ThemeMode) ?? "system";

  const settingsMutation = useMutation({
    mutationFn: (input: Partial<SettingsInput>) => {
      const payload: SettingsInput = {
        units: input.units ?? (profile?.units as Units) ?? "metric",
        theme: input.theme ?? (profile?.theme as ThemeMode) ?? "system",
        language: input.language ?? profile?.language ?? "ka",
        timezone: input.timezone ?? profile?.timezone ?? "Asia/Tbilisi",
      };
      return updateSettings(payload);
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: PROFILE_QUERY_KEY });
      const previous = queryClient.getQueryData(PROFILE_QUERY_KEY);
      queryClient.setQueryData(
        PROFILE_QUERY_KEY,
        (old: typeof profileQuery.data) => {
          if (!old) return old;
          return { ...old, data: { ...old.data, ...input } };
        },
      );
      return { previous };
    },
    onError: (err, _input, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(PROFILE_QUERY_KEY, ctx.previous);
      }
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
    onSuccess: async (res) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      await refreshUser();
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => requestExport("csv"),
    onSuccess: () => {
      toast.success("ექსპორტი დაიწყო", "ელფოსტა მიიღებ რამდენიმე წუთში");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "ექსპორტი ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: () => deleteMe(),
    onSuccess: async () => {
      toast.success("ანგარიში წაშლილია");
      await signOut();
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : "წაშლა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const handleUnitsChange = (next: Units) => {
    if (next === units) return;
    settingsMutation.mutate({ units: next });
  };

  const handleThemeChange = (next: ThemeMode) => {
    if (next === themeMode) return;
    settingsMutation.mutate({ theme: next });
  };

  const confirmExport = () => {
    Alert.alert(
      "მონაცემის ექსპორტი",
      "გამოიგზავნება შენს ელფოსტაზე CSV ფაილის სახით. გაგრძელება?",
      [
        { text: "გაუქმება", style: "cancel" },
        { text: "გაგზავნა", onPress: () => exportMutation.mutate() },
      ],
    );
  };

  const confirmDeleteAccount = () => {
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
                {
                  text: "კი, წაშალე",
                  style: "destructive",
                  onPress: () => deleteAccountMutation.mutate(),
                },
              ],
            ),
        },
      ],
    );
  };

  return (
    <SubScreenLayout title="პარამეტრები" subtitle="ერთეულები, თემა, მონაცემები">
      <View style={{ gap: Spacing.sm }}>
        <ThemedText style={styles.groupLabel} type="secondary">
          ერთეულები
        </ThemedText>
        <View style={[styles.segment, { backgroundColor: theme.borderLight }]}>
          {(
            [
              { key: "metric", label: "მეტრული (კგ, სმ)" },
              { key: "imperial", label: "იმპერ. (lb, ft)" },
            ] as { key: Units; label: string }[]
          ).map((opt) => {
            const isActive = units === opt.key;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => handleUnitsChange(opt.key)}
                disabled={settingsMutation.isPending}
                activeOpacity={0.85}
                style={[
                  styles.segmentItem,
                  isActive && {
                    backgroundColor: theme.card,
                    shadowColor: theme.shadow,
                    shadowOpacity: 1,
                    shadowRadius: 6,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 2,
                  },
                ]}
              >
                <Ruler
                  color={isActive ? theme.brand : theme.textSecondary}
                  size={14}
                />
                <ThemedText
                  style={styles.segmentText}
                  color={isActive ? theme.text : theme.textSecondary}
                >
                  {opt.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ gap: Spacing.sm }}>
        <ThemedText style={styles.groupLabel} type="secondary">
          თემა
        </ThemedText>
        <View style={styles.themeRow}>
          {(
            [
              { key: "system", label: "სისტემა", Icon: Globe },
              { key: "light", label: "ღია", Icon: Sun },
              { key: "dark", label: "მუქი", Icon: Moon },
            ] as { key: ThemeMode; label: string; Icon: typeof Sun }[]
          ).map(({ key, label, Icon }) => {
            const isActive = themeMode === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => handleThemeChange(key)}
                disabled={settingsMutation.isPending}
                activeOpacity={0.85}
                style={[
                  styles.themeCard,
                  {
                    backgroundColor: isActive ? theme.brandSoft : theme.card,
                    borderColor: isActive ? theme.brand : theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.themeIcon,
                    {
                      backgroundColor: isActive
                        ? theme.brand
                        : theme.borderLight,
                    },
                  ]}
                >
                  <Icon
                    color={isActive ? "#FFFFFF" : theme.textSecondary}
                    size={18}
                  />
                </View>
                <ThemedText
                  style={styles.themeLabel}
                  color={isActive ? theme.brand : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <SettingsGroup title="მონაცემები">
        <SettingsRow
          Icon={Upload}
          iconColor={theme.brand}
          iconTint={theme.brandSoft}
          label="მონაცემის ექსპორტი"
          hint={exportMutation.isPending ? "მუშავდება..." : "CSV ფაილი"}
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
  groupLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: Radius.md,
  },
  segmentItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs + 2,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.sm,
  },
  segmentText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  themeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  themeCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    gap: Spacing.sm,
  },
  themeIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  themeLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    fontSize: Type.xs,
    marginTop: Spacing.lg,
  },
});
