import FoodCard from "@/components/cards/FoodCard";
import { MealProgressCard } from "@/components/cards/MealProgressCard";
import Header from "@/components/headers";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import {
  Food,
  isMealKey,
  LOGGED_BY_MEAL,
  MEAL_CONFIGS,
  MEAL_KEYS,
  MealKey,
} from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import {
  Camera,
  History,
  LucideIcon,
  Mic,
  ScanBarcode,
  Sparkles,
  Star,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const FREQUENT_FOODS: Food[] = [
  {
    id: "oatmeal",
    title: "შვრიის ფაფა",
    calories: 154,
    serving: "1 თასი (234გ)",
    protein: 6,
    carbs: 27,
    fat: 3,
  },
  {
    id: "egg",
    title: "კვერცხი",
    calories: 78,
    serving: "1 ცალი (50გ)",
    protein: 6,
    carbs: 0,
    fat: 5,
  },
  {
    id: "avocado",
    title: "ავოკადო",
    calories: 240,
    serving: "1 ცალი (150გ)",
    protein: 3,
    carbs: 13,
    fat: 22,
  },
  {
    id: "rice",
    title: "ბრინჯი (მოხარშული)",
    calories: 206,
    serving: "1 თასი (158გ)",
    protein: 4,
    carbs: 45,
    fat: 0,
  },
  {
    id: "salmon",
    title: "ორაგული",
    calories: 208,
    serving: "100გ",
    protein: 20,
    carbs: 0,
    fat: 13,
  },
  {
    id: "almonds",
    title: "ნუში",
    calories: 164,
    serving: "1 მუჭა (28გ)",
    protein: 6,
    carbs: 6,
    fat: 14,
  },
];

const QUICK_ACTIONS = [
  {
    Icon: ScanBarcode,
    label: "ბარკოდი",
    color: "#5B6CE0",
    tint: "#EEF0FB",
    tintDark: "#222B4A",
  },
  {
    Icon: Camera,
    label: "ფოტო",
    color: "#2FB871",
    tint: "#E8F6EC",
    tintDark: "#1F3A28",
  },
  {
    Icon: Mic,
    label: "ხმოვანი",
    color: "#E85A8C",
    tint: "#FCEAF1",
    tintDark: "#3A2030",
  },
  {
    Icon: Sparkles,
    label: "AI",
    color: "#7C5CFF",
    tint: "#F0EBFE",
    tintDark: "#2A1F4A",
  },
];

function AddScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { meal } = useLocalSearchParams<{ meal?: string }>();

  const [activeMeal, setActiveMeal] = useState<MealKey>(
    isMealKey(meal) ? meal : "საუზმე"
  );
  const [browse, setBrowse] = useState<"frequent" | "favorites" | "recent">(
    "frequent"
  );

  useEffect(() => {
    if (isMealKey(meal)) setActiveMeal(meal);
  }, [meal]);

  const config = MEAL_CONFIGS[activeMeal];
  const logged = LOGGED_BY_MEAL[activeMeal];

  const summary = useMemo(() => {
    const consumed = logged.reduce((acc, f) => acc + f.calories, 0);
    const protein = logged.reduce((acc, f) => acc + f.protein, 0);
    const carbs = logged.reduce((acc, f) => acc + f.carbs, 0);
    const fat = logged.reduce((acc, f) => acc + f.fat, 0);
    return { consumed, protein, carbs, fat };
  }, [logged]);

  const buttons = MEAL_KEYS.map((m) => ({
    Icon: MEAL_CONFIGS[m].Icon,
    label: m,
  }));

  const browseTabs: { key: typeof browse; label: string; Icon: LucideIcon }[] =
    [
      { key: "frequent", label: "ხშირი", Icon: History },
      { key: "favorites", label: "საყვარელი", Icon: Star },
      { key: "recent", label: "ბოლო", Icon: Sparkles },
    ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <Header
        title="კვების ჩაწერა"
        inputPlaceholder="მოძებნე საკვები..."
        buttons={buttons}
        onButtonPress={(button) => setActiveMeal(button.label as MealKey)}
        activeButton={activeMeal}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: Spacing.xl,
          paddingBottom: TAB_BAR_HEIGHT + 24,
          gap: Spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <MealProgressCard
          Icon={config.Icon}
          iconColor={config.iconColor}
          iconTint={
            colorScheme === "dark" ? config.iconTintDark : config.iconTint
          }
          mealLabel={activeMeal}
          consumed={summary.consumed}
          goal={config.goal}
          macros={[
            {
              label: "ცილა",
              consumed: summary.protein,
              goal: config.proteinGoal,
              color: theme.macroProtein,
            },
            {
              label: "ნახშირწყ.",
              consumed: summary.carbs,
              goal: config.carbsGoal,
              color: theme.macroCarbs,
            },
            {
              label: "ცხიმი",
              consumed: summary.fat,
              goal: config.fatGoal,
              color: theme.macroFat,
            },
          ]}
        />

        <View style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.sectionTitle}>სწრაფი ჩაწერა</ThemedText>
          <View style={styles.quickRow}>
            {QUICK_ACTIONS.map(({ Icon, label, color, tint, tintDark }) => (
              <TouchableOpacity
                key={label}
                activeOpacity={0.85}
                style={[
                  styles.quickTile,
                  {
                    backgroundColor: theme.card,
                    borderColor: theme.borderLight,
                  },
                ]}
              >
                <View
                  style={[
                    styles.quickIcon,
                    { backgroundColor: colorScheme === "dark" ? tintDark : tint },
                  ]}
                >
                  <Icon color={color} size={20} />
                </View>
                <ThemedText style={styles.quickLabel}>{label}</ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ gap: Spacing.sm }}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              ჩაწერილი — {activeMeal}
            </ThemedText>
            <ThemedText style={styles.sectionCount} type="secondary">
              {logged.length} საკვები
            </ThemedText>
          </View>
          {logged.length === 0 ? (
            <View
              style={[
                styles.empty,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.borderLight,
                },
              ]}
            >
              <View
                style={[
                  styles.emptyIcon,
                  { backgroundColor: theme.brandSoft },
                ]}
              >
                <config.Icon color={theme.brand} size={22} />
              </View>
              <ThemedText style={styles.emptyTitle}>
                ჯერ არაფერი ჩაგიწერია
              </ThemedText>
              <ThemedText type="secondary" style={styles.emptyText}>
                დაამატე საკვები ქვემოთ ხშირი სიიდან
              </ThemedText>
            </View>
          ) : (
            <View style={{ gap: Spacing.md }}>
              {logged.map((f) => (
                <FoodCard
                  key={f.id}
                  title={f.title}
                  calories={f.calories}
                  serving={f.serving}
                  proteinG={f.protein}
                  carbsG={f.carbs}
                  fatG={f.fat}
                  action="remove"
                />
              ))}
            </View>
          )}
        </View>

        <View style={{ gap: Spacing.sm }}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>დაამატე</ThemedText>
          </View>
          <View style={styles.tabsRow}>
            {browseTabs.map(({ key, label, Icon }) => {
              const isActive = browse === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setBrowse(key)}
                  activeOpacity={0.85}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isActive ? theme.brand : theme.card,
                      borderColor: isActive ? theme.brand : theme.border,
                    },
                  ]}
                >
                  <Icon
                    color={isActive ? "#FFFFFF" : theme.textSecondary}
                    size={14}
                  />
                  <ThemedText
                    style={styles.tabLabel}
                    color={isActive ? "#FFFFFF" : theme.text}
                  >
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{ gap: Spacing.md, marginTop: Spacing.xs }}>
            {FREQUENT_FOODS.map((f) => (
              <FoodCard
                key={f.id}
                title={f.title}
                calories={f.calories}
                serving={f.serving}
                proteinG={f.protein}
                carbsG={f.carbs}
                fatG={f.fat}
                action="add"
              />
            ))}
          </View>
        </View>

        <Button onPress={() => null} variant="secondary">
          + შექმენი ახალი საკვები
        </Button>
      </ScrollView>
    </View>
  );
}

export default AddScreen;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  sectionCount: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  quickRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  quickTile: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.sm,
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  quickLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  empty: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.sm,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: Type.xs,
    textAlign: "center",
  },
  tabsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
