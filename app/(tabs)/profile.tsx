import { getProfile } from "@/api/profile";
import { getStreak, getSummary, getWeightSeries } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Href, router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Globe,
  Heart,
  LogOut,
  LucideIcon,
  Settings,
  Target,
  User,
} from "lucide-react-native";
import { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./_layout";

function formatWeightChange(kg: number | undefined): string {
  if (kg == null) return "—";
  if (Math.abs(kg) < 0.05) return "0 კგ";
  const sign = kg > 0 ? "+" : "−";
  return `${sign}${Math.abs(kg).toFixed(1)} კგ`;
}

type RowProps = {
  Icon: LucideIcon;
  label: string;
  hint?: string;
  tint: string;
  iconColor: string;
  href?: Href;
};

const Row = ({ Icon, label, hint, tint, iconColor, href }: RowProps) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.row}
      onPress={() => href && router.push(href)}
    >
      <View style={[styles.rowIcon, { backgroundColor: tint }]}>
        <Icon color={iconColor} size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.rowLabel}>{label}</ThemedText>
        {hint && (
          <ThemedText type="secondary" style={styles.rowHint}>
            {hint}
          </ThemedText>
        )}
      </View>
      <ChevronRight color={theme.textSecondary} size={18} />
    </TouchableOpacity>
  );
};

const ProfilePage = () => {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Profile"],
    queryFn: getProfile,
  });
  const profile = data?.data;

  const streakQuery = useQuery({
    queryKey: ["stats", "streak", "week"],
    queryFn: () => getStreak("week"),
  });
  const summaryQuery = useQuery({
    queryKey: ["stats", "summary", "month"],
    queryFn: () => getSummary("month"),
  });
  // Year span gives the longest available history, so we can anchor "% to goal"
  // against an early baseline weight rather than today's weight.
  const weightSeriesQuery = useQuery({
    queryKey: ["stats", "weight", "year"],
    queryFn: () => getWeightSeries("year"),
  });

  const streak = streakQuery.data?.data.current ?? 0;
  const weightChange = summaryQuery.data?.data.weight_change_kg;

  const goalPct = useMemo<number | null>(() => {
    if (!profile) return null;
    const target = profile.target_weight_kg;
    const current = profile.weight_kg;
    if (target == null || !current) return null;
    if (profile.goal_type === "maintain") return null;
    const series = weightSeriesQuery.data?.data ?? [];
    const start = series.length > 0 ? series[0].value : current;
    const total = Math.abs(start - target);
    if (total < 0.1) return null;
    const done =
      profile.goal_type === "lose"
        ? Math.max(0, start - current)
        : Math.max(0, current - start);
    return Math.min(100, Math.max(0, Math.round((done / total) * 100)));
  }, [profile, weightSeriesQuery.data]);

  const stats = [
    { value: `${streak}`, label: "სტრიკი" },
    { value: formatWeightChange(weightChange), label: "პროგრესი" },
    { value: goalPct != null ? `${goalPct || 0}%` : "—", label: "მიზანი" },
  ];

  return (
    <ScrollView
      style={{ backgroundColor: theme.surface }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <GradientView
        colors={[theme.brandDeep, theme.brand]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius={Radius.xl}
        style={styles.headerContainer}
      >
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText} color={theme.brand}>
              {data?.data.display_name?.split(" ")[0][0]}
            </ThemedText>
          </View>
          <ThemedText style={styles.name} color="#FFFFFF">
            {data?.data.display_name}
          </ThemedText>
          <ThemedText style={styles.email} color="rgba(255,255,255,0.85)">
            {data?.data?.activity_level}
          </ThemedText>

          <View style={styles.statsStrip}>
            {stats.map((s) => (
              <View key={s.label} style={styles.statBlock}>
                <ThemedText style={styles.statValue} color="#FFFFFF">
                  {s.value}
                </ThemedText>
                <ThemedText
                  style={styles.statLabel}
                  color="rgba(255,255,255,0.8)"
                >
                  {s.label}
                </ThemedText>
              </View>
            ))}
          </View>
        </SafeAreaView>
      </GradientView>

      <View style={styles.body}>
        <ThemedText style={styles.sectionTitle}>ანგარიში</ThemedText>
        <BaseCard style={styles.cardList}>
          <Row
            Icon={User}
            label="პირადი ინფორმაცია"
            hint="სახელი, ასაკი, სქესი"
            tint={colorScheme === "dark" ? "#22335A" : "#EAF2FE"}
            iconColor={theme.brand}
            href="/profile/personal"
          />
          <Row
            Icon={Target}
            label="მიზნები"
            hint="წონა, კალორია, მაკრო"
            tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
            iconColor="#34A867"
            href="/profile/goals"
          />
          <Row
            Icon={Heart}
            label="ჯანმრთელობა"
            hint="ალერგია, შეზღუდვა"
            tint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
            iconColor="#E85A8C"
            href="/profile/health"
          />
          {/* <Row
            Icon={Plug}
            label="კავშირები"
            hint="Apple Health, Garmin, Strava"
            tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
            iconColor="#34A867"
            href="/profile/connections"
          /> */}
        </BaseCard>

        <ThemedText style={styles.sectionTitle}>აპლიკაცია</ThemedText>
        <BaseCard style={styles.cardList}>
          <Row
            Icon={Bell}
            label="შეტყობინებები"
            tint={colorScheme === "dark" ? "#3A2E10" : "#FEF6E4"}
            iconColor="#E8A02C"
            href="/profile/notifications"
          />
          <Row
            Icon={Globe}
            label="ენა"
            hint="ქართული"
            tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
            iconColor="#5B6CE0"
            href="/profile/language"
          />
          <Row
            Icon={Settings}
            label="პარამეტრები"
            tint={theme.borderLight}
            iconColor={theme.text}
            href="/profile/settings"
          />
        </BaseCard>

        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.logout}
          onPress={() => signOut()}
        >
          <LogOut color={theme.error} size={18} />
          <ThemedText style={styles.logoutText} color={theme.error}>
            გასვლა
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: Spacing.xxxl,
  },
  headerSafe: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    alignItems: "center",
    gap: Spacing.xs,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: Radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: Type.xxxl,
    fontWeight: "700",
  },
  name: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  email: {
    fontSize: Type.sm,
  },
  statsStrip: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginTop: Spacing.lg,
    width: "100%",
  },
  statBlock: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    gap: 2,
  },
  statValue: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  cardList: {
    padding: Spacing.sm,
    gap: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.md,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  rowHint: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  logout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontSize: Type.base,
    fontWeight: "600",
  },
});
