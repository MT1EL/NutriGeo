import type { FoodLogEntry } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import { FoodListSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { type MealConfig, MealKey } from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  caloriesForFood,
  entryDisplayServing,
  entryServings,
  macroForFood,
} from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  mealLabel: MealKey;
  entries: FoodLogEntry[];
  isLoading: boolean;
  config: MealConfig;
  onSelect: (entry: FoodLogEntry) => void;
  onIncrement: (entry: FoodLogEntry) => void;
  onDecrement: (entry: FoodLogEntry) => void;
};

export default function LoggedMealList({
  mealLabel,
  entries,
  isLoading,
  config,
  onSelect,
  onIncrement,
  onDecrement,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>ჩაწერილი — {mealLabel}</ThemedText>
        <ThemedText style={styles.count} type="secondary">
          {entries.length} საკვები
        </ThemedText>
      </View>

      {isLoading ? (
        <FoodListSkeleton count={2} />
      ) : entries.length === 0 ? (
        <View
          style={[
            styles.empty,
            { backgroundColor: theme.card, borderColor: theme.borderLight },
          ]}
        >
          <View
            style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}
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
          {entries.map((entry) => {
            const food = entry.food;
            const q = entryServings(entry);
            return (
              <FoodCard
                key={entry.id}
                title={food.name}
                calories={caloriesForFood(food, q)}
                serving={entryDisplayServing(entry)}
                proteinG={macroForFood(food.protein_g_per_100g, food, q)}
                carbsG={macroForFood(food.carbs_g_per_100g, food, q)}
                fatG={macroForFood(food.fat_g_per_100g, food, q)}
                image={foodImageSource(food.image_url)}
                action="stepper"
                quantity={entry.quantity}
                onPress={() => onSelect(entry)}
                onIncrement={() => onIncrement(entry)}
                onDecrement={() => onDecrement(entry)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  count: {
    fontSize: Type.xs,
    fontWeight: "600",
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
});
