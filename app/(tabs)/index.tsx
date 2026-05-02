import { listArticles } from "@/api/articles";
import type { Article } from "@/api/types";
import MacrosCard from "@/components/cards/MacrosCard";
import MealsCard from "@/components/cards/MealsCard";
import HomeArticles from "@/components/home/HomeArticles";
import HomeBodyEmpty from "@/components/home/HomeBodyEmpty";
import HomeHeader, { HOME_HEADER_OVERLAP } from "@/components/home/HomeHeader";
import { Colors, Spacing } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import { formatTodayKa } from "@/utils/date";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const STALE_ARTICLES = 5 * 60_000;

export default function HomeScreen() {
  const { user } = useAuth();
  // --theme--
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const todayLabel = useMemo(() => formatTodayKa(), []);

  // --data--
  const { snapshot, meals, isLoading, isError } = useHomeData();
  const articlesQuery = useQuery({
    queryKey: ["articles", "list"],
    queryFn: () => listArticles({ limit: 4 }),
    staleTime: STALE_ARTICLES,
    placeholderData: keepPreviousData,
  });
  const articles: Article[] = articlesQuery.data?.data ?? [];

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.surface }]}>
        <ActivityIndicator color={theme.brand} />
      </View>
    );
  }

  const kcalEaten = Math.round(meals?.totals.kcal ?? 0);
  const kcalGoal = user?.goals?.daily_calorie_target ?? 0;

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: theme.surface,
        paddingBottom: TAB_BAR_HEIGHT + 40,
        minHeight: "100%",
      }}
      showsVerticalScrollIndicator={false}
    >
      <HomeHeader
        userName={user?.profile?.name || ""}
        todayLabel={todayLabel}
        kcalEaten={kcalEaten}
        kcalGoal={kcalGoal}
        snapshot={snapshot}
      />

      <View style={styles.container}>
        {isError || !meals ? (
          <HomeBodyEmpty />
        ) : (
          <>
            <MacrosCard data={meals} />
            <MealsCard data={meals} />
            <HomeArticles articles={articles} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: Spacing.xl,
    marginTop: -HOME_HEADER_OVERLAP,
    gap: Spacing.xxl,
  },
});
