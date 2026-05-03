import { listArticles } from "@/api/articles";
import type { Article } from "@/api/types";
import MacrosCard from "@/components/cards/MacrosCard";
import MealsCard from "@/components/cards/MealsCard";
import HomeArticles from "@/components/home/HomeArticles";
import HomeBodyEmpty from "@/components/home/HomeBodyEmpty";
import HomeHeader, { HOME_HEADER_OVERLAP } from "@/components/home/HomeHeader";
import WeightLogPill from "@/components/home/WeightLogPill";
import DatePickerSheet from "@/components/ui/DatePickerSheet";
import { HomeSkeleton } from "@/components/ui/Skeletons";
import { Colors, Spacing } from "@/constants/theme";
import { useActiveDate } from "@/contexts/ActiveDateContext";
import { useAuth } from "@/contexts/AuthContext";
import { useHomeData } from "@/hooks/use-home-data";
import { formatTodayKa, todayISO } from "@/utils/date";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const STALE_ARTICLES = 5 * 60_000;

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { date, setDate, isToday } = useActiveDate();
  const [pickerOpen, setPickerOpen] = useState(false);

  const months = useMemo(() => {
    const arr = t("dates.months", { returnObjects: true });
    return Array.isArray(arr) ? (arr as string[]) : [];
  }, [t]);

  const dateLabel = useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    return formatTodayKa(new Date(y, (m || 1) - 1, d || 1), months);
  }, [date, months]);

  const { snapshot, meals, isLoading, isError } = useHomeData();
  const articlesQuery = useQuery({
    queryKey: ["articles", "list"],
    queryFn: () => listArticles({ limit: 4 }),
    staleTime: STALE_ARTICLES,
    placeholderData: keepPreviousData,
  });
  const articles: Article[] = articlesQuery.data?.data ?? [];

  // Cold-start spinner only — once we've ever rendered real data, never
  // gate the whole screen again. Date changes use placeholderData on the
  // hook's queries to keep the previous date's content visible until the
  // new one arrives, instead of fading the screen to black.
  const hasLoadedRef = useRef(false);
  if (snapshot) hasLoadedRef.current = true;
  if (isLoading && !hasLoadedRef.current) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <HomeSkeleton />
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
        todayLabel={dateLabel}
        kcalEaten={kcalEaten}
        kcalGoal={kcalGoal}
        snapshot={snapshot}
        isToday={isToday}
        onCalendarPress={() => setPickerOpen(true)}
      />

      <View style={styles.container}>
        {isError || !meals ? (
          <HomeBodyEmpty />
        ) : (
          <>
            <MacrosCard data={meals} />
            <WeightLogPill weight={snapshot?.weight ?? null} />
            <MealsCard data={meals} />
            <HomeArticles articles={articles} />
          </>
        )}
      </View>

      <DatePickerSheet
        visible={pickerOpen}
        value={date}
        onChange={setDate}
        onClose={() => setPickerOpen(false)}
        // Don't let the user pick the future — we don't pre-log meals.
        maximumDate={todayISO()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    marginTop: -HOME_HEADER_OVERLAP,
    gap: Spacing.xxl,
  },
});
