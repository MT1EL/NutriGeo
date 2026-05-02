import type { FoodLogEntry } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import ThemedText from "@/components/ui/ThemedText";
import type { MealConfig } from "@/constants/meals";
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
  entries: FoodLogEntry[];
  isLoading: boolean;
  config: MealConfig;
  onRemove: (entryId: string) => void;
};

export default function MealEntriesList({
  entries,
  isLoading,
  config,
  onRemove,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.sectionTitle}>ჩაწერილი საკვები</ThemedText>
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
            დააწექი ქვემოთ ღილაკს და დაამატე
          </ThemedText>
        </View>
      ) : (
        <View style={{ gap: Spacing.md }}>
          {entries.map((entry) => {
            const food = entry.food;
            if (!food) return null;
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
                onActionPress={() => onRemove(entry.id)}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
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
