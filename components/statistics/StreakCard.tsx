import BaseCard from "@/components/cards/BaseCard";
import { DayState, StreakGrid } from "@/components/charts/StreakGrid";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Activity } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";
import CardEmpty from "./CardEmpty";

type Props = {
  days: DayState[];
};

export default function StreakCard({ days }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={{ gap: 2 }}>
          <ThemedText style={styles.cardTitle}>ლოგინგ სტრიკი</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            ბოლო {days.length} დღე
          </ThemedText>
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.brand }]}
            />
            <ThemedText style={styles.legendText} type="secondary">
              ჩაწერილი
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: theme.brand + "55" },
              ]}
            />
            <ThemedText style={styles.legendText} type="secondary">
              ნაწილობრ.
            </ThemedText>
          </View>
        </View>
      </View>

      {days.length ? (
        <StreakGrid
          days={days}
          color={theme.brand}
          partialColor={theme.brand + "55"}
          mutedColor={theme.borderLight}
        />
      ) : (
        <CardEmpty
          Icon={Activity}
          title="სტრიკი ჯერ არ გაქვს"
          hint="ყოველდღე ჩაწერე საკვები რომ აიგო სტრიკი."
          color="#5B6CE0"
          tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
        />
      )}
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  legendRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: Radius.sm,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "600",
  },
});
