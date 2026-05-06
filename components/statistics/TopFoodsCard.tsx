import type { TopFood } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { UiRange } from "@/hooks/use-stats";
import { UtensilsCrossed } from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";
import CardEmpty from "./CardEmpty";

const MIN_DAYS_FOR_TREND = 3;

const PALETTE = [
  "#7C5CFF",
  "#F5A623",
  "#34A867",
  "#3FA9F5",
  "#FF7A45",
  "#E85A8C",
];

type Props = {
  range: UiRange;
  topFoods: TopFood[] | undefined;
  loggedDays: number;
};

export default function TopFoodsCard({ range, topFoods, loggedDays }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const items = useMemo(() => {
    const list = Array.isArray(topFoods) ? topFoods : [];
    return list.map((f, i) => ({
      name: f.name,
      count: f.count,
      color: PALETTE[i % PALETTE.length],
    }));
  }, [topFoods]);

  const max = items.length ? Math.max(...items.map((f) => f.count)) : 0;
  const hasTrendData = loggedDays >= MIN_DAYS_FOR_TREND;
  const captionN = range === "week" ? 7 : range === "month" ? 30 : 90;

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{t("statistics.frequentFoods")}</ThemedText>
        <ThemedText type="secondary" style={styles.cardCaption}>
          {t("statistics.lastNDays", { count: captionN })}
        </ThemedText>
      </View>

      {items.length && hasTrendData ? (
        <View style={{ gap: Spacing.md }}>
          {items.map((f, i) => (
            <View key={f.name} style={{ gap: Spacing.xs + 2 }}>
              <View style={styles.row}>
                <View style={styles.label}>
                  <View
                    style={[
                      styles.rank,
                      { backgroundColor: theme.borderLight },
                    ]}
                  >
                    <ThemedText style={styles.rankText} type="secondary">
                      {i + 1}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.name}>{f.name}</ThemedText>
                </View>
                <ThemedText style={styles.count} type="secondary">
                  {f.count}×
                </ThemedText>
              </View>
              <View
                style={[styles.track, { backgroundColor: theme.borderLight }]}
              >
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${(f.count / max) * 100}%`,
                      backgroundColor: f.color,
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <CardEmpty
          Icon={UtensilsCrossed}
          title={t("statistics.noFoodEntries")}
          hint={t("statistics.logsAppearHere")}
          color="#7C5CFF"
          tint={colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE"}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  rank: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  name: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  count: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
});
