import type { FoodLogEntry } from "@/api/types";
import MealEntriesList from "@/components/meal/MealEntriesList";
import MealHeader from "@/components/meal/MealHeader";
import MealSummaryCard from "@/components/meal/MealSummaryCard";
import FoodDetailSheet from "@/components/sheets/FoodDetailSheet";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { isMealKey, MEAL_CONFIGS, MealKey } from "@/constants/meals";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useMealDetail } from "@/hooks/use-meal-detail";
import { router, useLocalSearchParams } from "expo-router";
import { Plus } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MealModal() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === "android" ? insets.top : 0;
  const { meal: mealParam } = useLocalSearchParams<{ meal?: string }>();

  const mealKey: MealKey = isMealKey(mealParam) ? mealParam : "საუზმე";
  const config = MEAL_CONFIGS[mealKey];
  const { today, apiMealKey, isLoading, loggedForMeal, summary, removeEntry } =
    useMealDetail(mealKey);

  const [sheetEntry, setSheetEntry] = useState<FoodLogEntry | null>(null);

  const goToAdd = () => {
    router.back();
    setTimeout(() => {
      router.push({ pathname: "/add", params: { meal: mealKey } });
    }, 50);
  };

  return (
    <View
      style={[
        styles.root,
        { backgroundColor: theme.surface, paddingTop: topPadding },
      ]}
    >
      <MealHeader
        mealKey={mealKey}
        config={config}
        count={loggedForMeal.length}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <MealSummaryCard summary={summary} config={config} />
        <MealEntriesList
          entries={loggedForMeal}
          isLoading={isLoading}
          config={config}
          onRemove={removeEntry}
        />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.background,
            borderTopColor: theme.borderLight,
          },
        ]}
      >
        <Button onPress={goToAdd}>
          <View style={styles.btnContent}>
            <Plus color="#FFFFFF" size={18} />
            <ThemedText style={styles.btnText} color="#FFFFFF">
              {t("meal.addFood")}
            </ThemedText>
          </View>
        </Button>
      </View>

      <FoodDetailSheet
        visible={!!sheetEntry}
        onClose={() => setSheetEntry(null)}
        food={sheetEntry?.food ?? null}
        entry={sheetEntry}
        defaultMealKey={apiMealKey}
        todayKey={today}
        source="meal_detail"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  btnText: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
