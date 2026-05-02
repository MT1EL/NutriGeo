import type { FoodLogEntry } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import ThemedText from "@/components/ui/ThemedText";
import { type MealConfig, MealKey } from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import {
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  mealLabel: MealKey;
  entries: FoodLogEntry[];
  isLoading: boolean;
  config: MealConfig;
  onSelect: (entry: FoodLogEntry) => void;
  onRemove: (entry: FoodLogEntry) => void;
};

export default function LoggedMealList({
  mealLabel,
  entries,
  isLoading,
  config,
  onSelect,
  onRemove,
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
        <View style={styles.loaderRow}>
          <ActivityIndicator color={theme.brand} />
        </View>
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
            const q = entry.quantity || 1;
            return (
              <FoodCard
                key={entry.id}
                title={food.name}
                calories={caloriesForFood(food, q)}
                serving={`${servingLabel(food)}${q !== 1 ? ` × ${q}` : ""}`}
                proteinG={macroForFood(food.protein_g_per_100g, food, q)}
                carbsG={macroForFood(food.carbs_g_per_100g, food, q)}
                fatG={macroForFood(food.fat_g_per_100g, food, q)}
                image={foodImageSource(food.image_url)}
                action="remove"
                onPress={() => onSelect(entry)}
                onActionPress={() => onRemove(entry)}
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
  loaderRow: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
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
