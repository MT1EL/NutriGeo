import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { UiRange } from "@/hooks/use-stats";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  range: UiRange;
  onRangeChange: (next: UiRange) => void;
  weightLabel: string;
  streakDays: number;
};

export default function StatisticsHeader({
  range,
  onRangeChange,
  weightLabel,
  streakDays,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const RANGES: { key: UiRange; label: string }[] = [
    { key: "week", label: t("statistics.rangeWeekShort") },
    { key: "month", label: t("statistics.rangeMonthShort") },
    { key: "quarter", label: t("statistics.rangeQuarterShort") },
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
        <View style={{ gap: 4 }}>
          <ThemedText style={styles.headerTitle} color="#FFFFFF">
            {t("statistics.yourJourney")}
          </ThemedText>
          <ThemedText
            style={styles.headerSubtitle}
            color="rgba(255,255,255,0.85)"
          >
            {weightLabel} · {t("statistics.dayStreak", { count: streakDays })}
          </ThemedText>
        </View>

        <View style={styles.rangeRow}>
          {RANGES.map((r) => {
            const isActive = r.key === range;
            return (
              <TouchableOpacity
                key={r.key}
                onPress={() => onRangeChange(r.key)}
                activeOpacity={0.85}
                style={[
                  styles.rangeChip,
                  {
                    backgroundColor: isActive
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.18)",
                  },
                ]}
              >
                <ThemedText
                  style={styles.rangeChipLabel}
                  color={isActive ? theme.brand : "#FFFFFF"}
                >
                  {r.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
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
    gap: Spacing.lg,
  },
  headerTitle: {
    fontSize: Type.xxl,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: Type.sm,
  },
  rangeRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  rangeChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  rangeChipLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
