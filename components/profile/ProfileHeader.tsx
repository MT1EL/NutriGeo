import type { Profile } from "@/api/profile";
import type { OverviewSummary } from "@/api/stats";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { StyleSheet, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatWeightChange(kg: number | undefined): string {
  if (kg == null) return "—";
  if (Math.abs(kg) < 0.05) return "0 კგ";
  const sign = kg > 0 ? "+" : "−";
  return `${sign}${Math.abs(kg).toFixed(1)} კგ`;
}

type Props = {
  profile: Profile | undefined;
  summary: OverviewSummary | undefined;
};

export default function ProfileHeader({ profile, summary }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const streak = summary?.streak.current ?? 0;
  const weightChange = summary?.weight_change_kg;
  const goalPct = summary?.goal_pct ?? null;

  const stats = [
    { value: `${streak}`, label: "სტრიკი" },
    { value: formatWeightChange(weightChange), label: "პროგრესი" },
    {
      value: goalPct != null ? `${Math.max(0, Math.round(goalPct))}%` : "—",
      label: "მიზანი",
    },
  ];

  return (
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
            {profile?.display_name?.split(" ")[0][0]}
          </ThemedText>
        </View>
        <ThemedText style={styles.name} color="#FFFFFF">
          {profile?.display_name}
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
  );
}

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
    fontSize: 22,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.4,
  },
});
