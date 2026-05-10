import type { Food, FoodLogEntry } from "@/api/types";
import FoodBrowser from "@/components/add/FoodBrowser";
import LoggedMealList from "@/components/add/LoggedMealList";
import QuickActionsRow from "@/components/add/QuickActionsRow";
import { MealProgressCard } from "@/components/cards/MealProgressCard";
import Header from "@/components/headers";
import BarcodeScannerSheet from "@/components/sheets/BarcodeScannerSheet";
import CustomFoodSheet from "@/components/sheets/CustomFoodSheet";
import FoodDetailSheet from "@/components/sheets/FoodDetailSheet";
import QuickAddSheet from "@/components/sheets/QuickAddSheet";
import Button from "@/components/ui/Button";
import { isMealKey, MEAL_CONFIGS, MEAL_KEYS, MealKey } from "@/constants/meals";
import { Colors, Spacing } from "@/constants/theme";
import { useAddScreen } from "@/hooks/use-add-screen";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function AddScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { meal } = useLocalSearchParams<{ meal?: string }>();

  const [activeMeal, setActiveMeal] = useState<MealKey>(
    isMealKey(meal) ? meal : "breakfast",
  );
  useEffect(() => {
    if (isMealKey(meal)) setActiveMeal(meal);
  }, [meal]);

  const [sheetFood, setSheetFood] = useState<Food | null>(null);
  const [sheetEntry, setSheetEntry] = useState<FoodLogEntry | null>(null);
  const [createSheetVisible, setCreateSheetVisible] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);

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
    incrementEntry,
    decrementEntry,
    removeEntry,
  } = useAddScreen(activeMeal);
  const config = MEAL_CONFIGS[activeMeal];
  const mealButtons = MEAL_KEYS.map((m) => ({
    key: m,

    Icon: MEAL_CONFIGS[m].Icon,
    label: t(`meal.${m}`),
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.surface }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-TAB_BAR_HEIGHT}
    >
      <Header
        title={t("add.title")}
        inputPlaceholder={t("add.search")}
        buttons={mealButtons}
        onButtonPress={(button) => setActiveMeal(button.key as MealKey)}
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
          config={config}
          mealLabel={t(`meal.${activeMeal}`)}
          consumed={summary.consumed}
          goal={config.goal}
          macros={[
            {
              label: t("macros.protein"),
              consumed: summary.protein,
              goal: config.proteinGoal,
              color: theme.macroProtein,
              tintColor: theme.macroProteinTint,
              textColor: theme.macroProteinText,
            },
            {
              label: t("macros.carbsShorter"),
              consumed: summary.carbs,
              goal: config.carbsGoal,
              color: theme.macroCarbs,
              tintColor: theme.macroCarbsTint,
              textColor: theme.macroCarbsText,
            },
            {
              label: t("macros.fat"),
              consumed: summary.fat,
              goal: config.fatGoal,
              color: theme.macroFat,
              tintColor: theme.macroFatTint,
              textColor: theme.macroFatText,
            },
          ]}
        />

        <QuickActionsRow
          onScanBarcode={() => setScannerOpen(true)}
          onQuickAdd={() => setQuickAddOpen(true)}
        />

        <LoggedMealList
          mealLabel={activeMeal}
          entries={loggedForMeal}
          isLoading={foodLogQuery.isLoading}
          config={config}
          onSelect={(entry) => {
            if (!entry.food) return;
            setSheetFood(entry.food);
            setSheetEntry(entry);
          }}
          onIncrement={incrementEntry}
          onDecrement={decrementEntry}
          onRemove={removeEntry}
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

        <Button onPress={() => setCreateSheetVisible(true)} variant="secondary">
          {t("add.addNewFood")}
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
        source="add"
        onEditFood={(food) => {
          setSheetFood(null);
          setSheetEntry(null);
          setEditingFood(food);
        }}
      />
      <CustomFoodSheet
        visible={createSheetVisible || !!editingFood}
        editingFood={editingFood}
        onClose={() => {
          setCreateSheetVisible(false);
          setEditingFood(null);
        }}
      />
      <BarcodeScannerSheet
        visible={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onFoodFound={(food) => {
          setScannerOpen(false);
          setSheetFood(food);
          setSheetEntry(null);
        }}
      />
      <QuickAddSheet
        visible={quickAddOpen}
        onClose={() => setQuickAddOpen(false)}
        defaultMealKey={apiMealKey}
        todayKey={today}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: Spacing.xl,
    paddingBottom: TAB_BAR_HEIGHT + 24,
    gap: Spacing.lg,
  },
});
