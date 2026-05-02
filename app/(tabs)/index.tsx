import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { listArticles } from "@/api/articles";
import { getTodayMeals } from "@/api/meals";
import { getStreak } from "@/api/stats";
import { getSteps } from "@/api/steps";
import type { Article } from "@/api/types";
import { getWaterToday } from "@/api/water";
import ArticleCover from "@/components/cards/ArticleCover";
import MacrosCard from "@/components/cards/MacrosCard";
import MealsCard from "@/components/cards/MealsCard";
import { CalorieRing } from "@/components/charts/CalorieRing";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import {
  APPLE_HEALTH_CONNECTED,
  LAST_SYNC_LABEL,
} from "@/constants/integrations";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useQueries, useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { Bell, Droplet, Flame, Footprints, Heart } from "lucide-react-native";
import { useMemo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./_layout";

const HEADER_OVERLAP = 56;

const KA_MONTHS = [
  "იანვარი",
  "თებერვალი",
  "მარტი",
  "აპრილი",
  "მაისი",
  "ივნისი",
  "ივლისი",
  "აგვისტო",
  "სექტემბერი",
  "ოქტომბერი",
  "ნოემბერი",
  "დეკემბერი",
];

function formatTodayKa(d = new Date()) {
  return `${d.getDate()} ${KA_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
}

function useHomeData() {
  return useQueries({
    queries: [
      {
        queryKey: ["meals", "today"],
        queryFn: () => getTodayMeals().then((r) => r.data),
      },
      { queryKey: ["streak"], queryFn: () => getStreak().then((r) => r.data) },
      {
        queryKey: ["water", "today"],
        queryFn: () => getWaterToday().then((r) => r.data),
      },
      {
        queryKey: ["steps", "today"],
        queryFn: () => getSteps("day").then((r) => r.data),
      },
    ],
    combine: ([meals, streak, water, steps]) => ({
      meals: meals.data,
      streak: streak.data,
      water: water.data,
      steps: steps.data,
      isLoading:
        meals.isLoading ||
        streak.isLoading ||
        water.isLoading ||
        steps.isLoading,
      isError:
        meals.isError || streak.isError || water.isError || steps.isError,
    }),
  });
}

export default function HomeScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const userName = user?.profile?.name?.trim() || user?.email?.split("@")[0] || "";
  const initial = userName.charAt(0).toUpperCase() || "?";
  const todayLabel = useMemo(() => formatTodayKa(), []);

  const { meals, streak, water, steps, isLoading, isError } = useHomeData();
  const articlesQuery = useQuery({
    queryKey: ["articles", "list"],
    queryFn: () => listArticles({ limit: 4 }),
  });
  const homeArticles: Article[] = useMemo(() => {
    const raw = articlesQuery.data?.data;
    return Array.isArray(raw) ? raw.slice(0, 4) : [];
  }, [articlesQuery.data]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.surface }]}>
        <ActivityIndicator color={theme.brand} />
      </View>
    );
  }
  if (isError || !meals) return null;

  const kcalEaten = Math.round(meals.totals.kcal);
  const kcalGoal = user?.goals?.daily_calorie_target ?? 0;
  const waterLiters = ((water?.total_ml ?? 0) / 1000).toFixed(1);
  const stepsToday = steps?.[0]?.count ?? 0;
  const streakDays = streak?.current ?? 0;

  const stats = [
    {
      Icon: Flame,
      label: "სტრიკი",
      value: `${streakDays} დღე`,
      color: "#FF7A45",
    },
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

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: theme.surface,
        paddingBottom: TAB_BAR_HEIGHT + 40,
        minHeight: "100%",
      }}
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
              <View style={styles.iconButton}>
                <Bell color="#FFFFFF" size={20} />
              </View>
              <View style={styles.avatar}>
                <ThemedText style={styles.avatarText} color={theme.brand}>
                  {initial}
                </ThemedText>
              </View>
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

          {APPLE_HEALTH_CONNECTED && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/profile/connections")}
              style={styles.sourcePill}
              hitSlop={6}
            >
              <Heart color="#FFFFFF" size={11} fill="#FF3B5C" />
              <ThemedText
                style={styles.sourceText}
                color="rgba(255,255,255,0.9)"
              >
                Apple Health-დან · {LAST_SYNC_LABEL}
              </ThemedText>
            </TouchableOpacity>
          )}
        </SafeAreaView>
      </GradientView>

      <View style={styles.container}>
        <MacrosCard data={meals} />
        <MealsCard data={meals} />

        <View style={{ gap: Spacing.md }}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>სტატიები</ThemedText>
            <TouchableOpacity
              onPress={() => router.push("/articles")}
              hitSlop={8}
              activeOpacity={0.6}
            >
              <ThemedText style={styles.sectionLink} color={theme.brand}>
                ყველა
              </ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: Spacing.md,
              paddingRight: Spacing.xl,
            }}
            style={{ marginLeft: -Spacing.xl, paddingLeft: Spacing.xl }}
          >
            {homeArticles.map((a) => (
              <ArticleCover key={a.id} article={a} />
            ))}
          </ScrollView>
        </View>
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
    marginTop: -HEADER_OVERLAP,
    gap: Spacing.xxl,
  },
  headerContainer: {
    paddingBottom: HEADER_OVERLAP + Spacing.xl,
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
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: Type.lg,
    fontWeight: "700",
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
  sourcePill: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  sourceText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  sectionLink: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
