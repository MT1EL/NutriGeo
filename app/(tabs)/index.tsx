import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

import ArticleCover from "@/components/cards/ArticleCover";
import MacrosCard from "@/components/cards/MacrosCard";
import MealsCard from "@/components/cards/MealsCard";
import { CalorieRing } from "@/components/charts/CalorieRing";
import ThemedText from "@/components/ui/ThemedText";
import { GradientView } from "@/components/ui/GradientView";
import { ARTICLES } from "@/constants/articles";
import {
  APPLE_HEALTH_CONNECTED,
  LAST_SYNC_LABEL,
} from "@/constants/integrations";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import { Bell, Droplet, Flame, Footprints, Heart } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./_layout";

const HEADER_OVERLAP = 56;
const USER_NAME = "თორნიკე";
const TODAY_DATE = "1 მაისი, 2026";
const CAL_GOAL = 2000;
const CAL_CONSUMED = 500;

export default function HomeScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const caloriesLeft = CAL_GOAL - CAL_CONSUMED;
  const progress = CAL_CONSUMED / CAL_GOAL;
  const initial = USER_NAME.charAt(0);

  const stats = [
    { Icon: Flame, label: "სტრიკი", value: "7 დღე", color: "#FF7A45" },
    { Icon: Droplet, label: "წყალი", value: "1.2 ლ", color: "#3FA9F5" },
    { Icon: Footprints, label: "ნაბიჯი", value: "4,820", color: "#7C5CFF" },
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
                {USER_NAME}
              </ThemedText>
              <ThemedText style={styles.date} color="rgba(255,255,255,0.85)">
                {TODAY_DATE}
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
              progress={progress}
              caloriesLeft={caloriesLeft}
              goal={CAL_GOAL}
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
        <MacrosCard />
        <MealsCard />

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
            contentContainerStyle={{ gap: Spacing.md, paddingRight: Spacing.xl }}
            style={{ marginLeft: -Spacing.xl, paddingLeft: Spacing.xl }}
          >
            {ARTICLES.slice(0, 4).map((a) => (
              <ArticleCover key={a.id} article={a} />
            ))}
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
