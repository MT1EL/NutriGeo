import CaloriesCard from "@/components/statistics/CaloriesCard";
import EmptyState from "@/components/statistics/EmptyState";
import InsightsCard from "@/components/statistics/InsightsCard";
import MacroBalanceCard from "@/components/statistics/MacroBalanceCard";
import RecordsCard from "@/components/statistics/RecordsCard";
import StatisticsHeader from "@/components/statistics/StatisticsHeader";
import StreakCard from "@/components/statistics/StreakCard";
import SummaryCards from "@/components/statistics/SummaryCards";
import TopFoodsCard from "@/components/statistics/TopFoodsCard";
import WeightCard from "@/components/statistics/WeightCard";
import { StatisticsSkeleton } from "@/components/ui/Skeletons";
import { Colors, Spacing } from "@/constants/theme";
import { useStats } from "@/hooks/use-stats";
import { formatWeightChange } from "@/utils/format";
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function StatisticsPage() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const stats = useStats();

  const weightLabel =
    stats.summary?.weight_change_kg != null
      ? `${formatWeightChange(stats.summary.weight_change_kg)} ${
          stats.range === "week"
            ? "კვირაში"
            : stats.range === "month"
              ? "თვეში"
              : "3 თვეში"
        }`
      : "მონაცემი არ არის";

  return (
    <ScrollView
      style={{ backgroundColor: theme.surface }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 24 }}
      showsVerticalScrollIndicator={false}
    >
      <StatisticsHeader
        range={stats.range}
        onRangeChange={stats.setRange}
        weightLabel={weightLabel}
        streakDays={stats.currentStreak}
      />

      <View style={styles.body}>
        {stats.isInitialLoading ? (
          <StatisticsSkeleton />
        ) : stats.isTotallyEmpty ? (
          <EmptyState />
        ) : (
          <>
            <SummaryCards summary={stats.summary} />
            <InsightsCard
              range={stats.range}
              summary={stats.summary}
              insights={stats.overview?.insights}
              loggedDays={stats.loggedDays}
              onTargetDays={stats.onTargetDays}
              weightSeries={stats.weightSeries}
              weightGoal={stats.weightGoal}
            />
            <WeightCard
              weightSeries={stats.weightSeries}
              weightGoal={stats.weightGoal}
              summary={stats.summary}
            />
            <CaloriesCard
              range={stats.range}
              series={stats.caloriesSeries}
              calGoal={stats.calGoal}
              hasAnyCalories={stats.hasAnyCalories}
            />
            <MacroBalanceCard
              range={stats.range}
              macrosSeries={stats.macrosSeries}
              loggedDays={stats.loggedDays}
            />
            <StreakCard days={stats.streakDays} />
            <TopFoodsCard
              range={stats.range}
              topFoods={stats.overview?.top_foods}
              loggedDays={stats.loggedDays}
            />
            <RecordsCard records={stats.records} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    marginTop: -Spacing.lg,
  },
});
