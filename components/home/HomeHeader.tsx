import type { HomeToday } from "@/api/home";
import { CalorieRing } from "@/components/charts/CalorieRing";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Calendar,
  Droplet,
  Flame,
  Footprints,
  LucideIcon,
} from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const HOME_HEADER_OVERLAP = 56;

type StatPill = {
  Icon: LucideIcon;
  label: string;
  value: string;
  color: string;
};

function buildStats(
  snapshot: HomeToday | undefined,
  includeStreak: boolean,
): StatPill[] {
  const streakDays = snapshot?.streak.current ?? 0;
  const waterLiters = ((snapshot?.water.total_ml ?? 0) / 1000).toFixed(1);
  const stepsToday = snapshot?.steps.count ?? 0;

  const stats: StatPill[] = [
    {
      Icon: Droplet,
      label: "წყალი",
      value: `${waterLiters} ლ`,
      color: "#3FA9F5",
    },
    {
      Icon: Footprints,
      label: "ნაბიჯი",
      value: stepsToday.toLocaleString(),
      color: "#7C5CFF",
    },
  ];
  // Streak is a global "current run" — only meaningful in today view.
  if (includeStreak) {
    stats.unshift({
      Icon: Flame,
      label: "სტრიკი",
      value: `${streakDays} დღე`,
      color: "#FF7A45",
    });
  }
  return stats;
}

type Props = {
  userName: string;
  todayLabel: string;
  kcalEaten: number;
  kcalGoal: number;
  snapshot: HomeToday | undefined;
  isToday: boolean;
  onCalendarPress?: () => void;
};

export default function HomeHeader({
  userName,
  todayLabel,
  kcalEaten,
  kcalGoal,
  snapshot,
  isToday,
  onCalendarPress,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const stats = buildStats(snapshot, isToday);

  return (
    <GradientView
      colors={[theme.brandDeep, theme.brand]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      borderBottomRadius={Radius.xl}
      style={styles.headerContainer}
    >
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.header}>
          <View style={{ gap: 4 }}>
            <ThemedText style={styles.greeting} color="#FFFFFF">
              გამარჯობა,
            </ThemedText>
            <ThemedText style={styles.name} color="#FFFFFF">
              {userName}
            </ThemedText>
            <ThemedText style={styles.date} color="rgba(255,255,255,0.85)">
              {todayLabel}
            </ThemedText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={onCalendarPress}
              activeOpacity={0.7}
              hitSlop={6}
              style={styles.iconButton}
            >
              <Calendar color="#FFFFFF" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ringContainer}>
          <CalorieRing
            size={210}
            strokeWidth={14}
            progress={kcalEaten}
            goal={kcalGoal}
            color={theme.accent}
          />
        </View>

        {snapshot && (
          <View style={styles.statsStrip}>
            {stats.map(({ Icon, label, value, color }) => (
              <View key={label} style={styles.statPill}>
                <View
                  style={[styles.statIcon, { backgroundColor: `${color}33` }]}
                >
                  <Icon color={color} size={16} />
                </View>
                <View style={{ gap: 2 }}>
                  <ThemedText
                    style={styles.statLabel}
                    color="rgba(255,255,255,0.75)"
                  >
                    {label}
                  </ThemedText>
                  <ThemedText style={styles.statValue} color="#FFFFFF">
                    {value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}
      </SafeAreaView>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: HOME_HEADER_OVERLAP + Spacing.xl,
    backgroundColor: "red",
  },
  headerSafe: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.xl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerActions: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: Type.base,
    fontWeight: "500",
    opacity: 0.9,
  },
  name: {
    fontSize: Type.xxl,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  date: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  ringContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  statsStrip: {
    flexDirection: "row",
    gap: Spacing.sm,
    justifyContent: "space-between",
  },
  statPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.lg,
    backgroundColor: "rgba(255,255,255,0.14)",
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  statValue: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
