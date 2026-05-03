import type { Insight, OverviewSummary, WeightPoint } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import type { UiRange } from "@/hooks/use-stats";
import {
  Flame,
  LucideIcon,
  Sparkles,
  Target,
} from "lucide-react-native";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

const MIN_DAYS_FOR_TREND = 3;

const SEVERITY_STYLES: Record<
  NonNullable<Insight["severity"]>,
  { color: string; tint: string; tintDark: string; Icon: LucideIcon }
> = {
  positive: {
    color: "#34A867",
    tint: "#E6F6EA",
    tintDark: "#1F3A28",
    Icon: Sparkles,
  },
  warning: {
    color: "#FF7A45",
    tint: "#FEEDE2",
    tintDark: "#3A2010",
    Icon: Flame,
  },
  info: {
    color: "#5B6CE0",
    tint: "#EEF0FB",
    tintDark: "#222B4A",
    Icon: Target,
  },
};

type CardProps = {
  Icon: LucideIcon;
  title: string;
  body: string;
  color: string;
  tint: string;
};

const InsightRow = ({ Icon, title, body, color, tint }: CardProps) => (
  <View style={[styles.insight, { borderLeftColor: color }]}>
    <View style={[styles.insightIcon, { backgroundColor: tint }]}>
      <Icon color={color} size={16} />
    </View>
    <View style={{ flex: 1, gap: 2 }}>
      <ThemedText style={styles.insightTitle}>{title}</ThemedText>
      <ThemedText type="secondary" style={styles.insightBody}>
        {body}
      </ThemedText>
    </View>
  </View>
);

type Props = {
  range: UiRange;
  summary: OverviewSummary | undefined;
  insights: Insight[] | null | undefined;
  loggedDays: number;
  onTargetDays: number;
  weightSeries: WeightPoint[];
  weightGoal: number | null;
};

export default function InsightsCard({
  range,
  summary,
  insights,
  loggedDays,
  onTargetDays,
  weightSeries,
  weightGoal,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const isDark = colorScheme === "dark";

  const items = useMemo<CardProps[]>(() => {
    // null = no premium access; [] = has access but no cards yet.
    if (Array.isArray(insights) && insights.length) {
      return insights.map((i) => {
        const sev = i.severity ?? "info";
        const s = SEVERITY_STYLES[sev];
        return {
          Icon: s.Icon,
          title: i.title,
          body: i.body,
          color: s.color,
          tint: isDark ? s.tintDark : s.tint,
        };
      });
    }

    // Fallback: synthesize a few useful cards from the data we already have.
    const fallback: CardProps[] = [];
    const streakValue = summary?.streak.current ?? 0;
    if (streakValue > 0) {
      fallback.push({
        Icon: Flame,
        title: t("statistics.dayStreak", { count: streakValue }),
        body: t("statistics.keepIt"),
        color: "#FF7A45",
        tint: isDark ? "#3A2010" : "#FEEDE2",
      });
    }
    if (loggedDays >= MIN_DAYS_FOR_TREND) {
      fallback.push({
        Icon: Target,
        title: t("statistics.daysOnTarget", { on: onTargetDays, total: loggedDays }),
        body:
          onTargetDays / loggedDays > 0.6
            ? t("statistics.discipline")
            : t("statistics.tryHarder"),
        color: "#5B6CE0",
        tint: isDark ? "#222B4A" : "#EEF0FB",
      });
    }
    if (weightSeries.length >= MIN_DAYS_FOR_TREND && weightGoal != null) {
      const last = weightSeries[weightSeries.length - 1].weight_kg;
      const remaining = (last - weightGoal).toFixed(1);
      fallback.push({
        Icon: Sparkles,
        title: t("statistics.toGoalKg", { kg: remaining }),
        body: t("statistics.currentTempReachable"),
        color: "#7C5CFF",
        tint: isDark ? "#2A1F4A" : "#F0EBFE",
      });
    }
    return fallback;
    // `t` must be in deps: when the language changes, react-i18next gives us a
    // new `t` reference and the React Compiler keys the memo on it, so the
    // fallback strings refresh. Without it, switching language leaves stale
    // text on screen until something else invalidates this memo.
  }, [insights, summary, loggedDays, onTargetDays, weightSeries, weightGoal, isDark, t]);

  if (items.length === 0) return null;

  const caption =
    range === "week"
      ? t("statistics.thisWeek")
      : range === "month"
        ? t("statistics.thisMonth")
        : t("statistics.last3Months");

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <ThemedText style={styles.cardTitle}>{t("statistics.insightTitle")}</ThemedText>
        <ThemedText type="secondary" style={styles.cardCaption}>
          {caption}
        </ThemedText>
      </View>
      <View style={{ gap: Spacing.md }}>
        {items.map((ins) => (
          <InsightRow key={ins.title} {...ins} />
        ))}
      </View>
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
  insight: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
    paddingLeft: Spacing.md,
    borderLeftWidth: 3,
  },
  insightIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  insightTitle: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  insightBody: {
    fontSize: Type.sm,
    lineHeight: 18,
  },
});
