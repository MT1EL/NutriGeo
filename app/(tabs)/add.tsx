import type { Food, FoodLogEntry } from "@/api/types";
import { MealProgressCard } from "@/components/cards/MealProgressCard";
import FoodBrowser from "@/components/add/FoodBrowser";
import LoggedMealList from "@/components/add/LoggedMealList";
import QuickActionsRow from "@/components/add/QuickActionsRow";
import Header from "@/components/headers";
import CustomFoodSheet from "@/components/sheets/CustomFoodSheet";
import FoodDetailSheet from "@/components/sheets/FoodDetailSheet";
import Button from "@/components/ui/Button";
import {
  isMealKey,
  MEAL_CONFIGS,
  MEAL_KEYS,
  MealKey,
} from "@/constants/meals";
import { Colors, Spacing } from "@/constants/theme";
import { useAddScreen } from "@/hooks/use-add-screen";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function AddScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { meal } = useLocalSearchParams<{ meal?: string }>();

  const [activeMeal, setActiveMeal] = useState<MealKey>(
    isMealKey(meal) ? meal : "საუზმე",
  );
  useEffect(() => {
    if (isMealKey(meal)) setActiveMeal(meal);
  }, [meal]);

  const [sheetFood, setSheetFood] = useState<Food | null>(null);
  const [sheetEntry, setSheetEntry] = useState<FoodLogEntry | null>(null);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);

  const {
    today,
    apiMealKey,
    browse,
    setBrowse,
    searchInput,
    setSearchInput,
    debouncedQuery,
    foodLogQuery,
    loggedForMeal,
    summary,
    browseQuery,
    browseFoods,
    browseEmptyText,
    addFood,
    removeEntry,
  } = useAddScreen(activeMeal);

  const config = MEAL_CONFIGS[activeMeal];
  const mealButtons = MEAL_KEYS.map((m) => ({
    Icon: MEAL_CONFIGS[m].Icon,
    label: m,
  }));

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <Header
        title="კვების ჩაწერა"
        inputPlaceholder="მოძებნე საკვები..."
        buttons={mealButtons}
        onButtonPress={(button) => setActiveMeal(button.label as MealKey)}
        activeButton={activeMeal}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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

        <QuickActionsRow />

        <LoggedMealList
          mealLabel={activeMeal}
          entries={loggedForMeal}
          isLoading={foodLogQuery.isLoading}
          config={config}
          onSelect={(entry) => {
            setSheetFood(entry.food);
            setSheetEntry(entry);
          }}
          onRemove={(entry) => removeEntry(entry.id)}
        />

        <FoodBrowser
          hasQuery={!!debouncedQuery}
          browse={browse}
          onBrowseChange={setBrowse}
          foods={browseFoods}
          isLoading={browseQuery.isLoading}
          emptyText={browseEmptyText}
          onSelect={(food) => {
            setSheetFood(food);
            setSheetEntry(null);
          }}
          onAdd={addFood}
        />

        <Button
          onPress={() => setCreateSheetVisible(true)}
          variant="secondary"
        >
          + შექმენი ახალი საკვები
        </Button>
      </ScrollView>

      <FoodDetailSheet
        visible={!!sheetFood}
        onClose={() => {
          setSheetFood(null);
          setSheetEntry(null);
        }}
        food={sheetFood}
        entry={sheetEntry}
        defaultMealKey={apiMealKey}
        todayKey={today}
      />
      <CustomFoodSheet
        visible={createSheetVisible}
        onClose={() => setCreateSheetVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.xl,
    paddingBottom: TAB_BAR_HEIGHT + 24,
    gap: Spacing.lg,
  },
});
