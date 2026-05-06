import type { FoodLogEntry } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import { FoodListSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { type MealConfig, MEAL_KEY_TO_I18N, MealKey } from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { entryDisplay, entryDisplayServing } from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  mealLabel: MealKey;
  entries: FoodLogEntry[];
  isLoading: boolean;
  config: MealConfig;
  onSelect: (entry: FoodLogEntry) => void;
  onIncrement: (entry: FoodLogEntry) => void;
  onDecrement: (entry: FoodLogEntry) => void;
  onRemove: (entry: FoodLogEntry) => void;
};

export default function LoggedMealList({
  mealLabel,
  entries,
  isLoading,
  config,
  onSelect,
  onIncrement,
  onDecrement,
  onRemove,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          {t("add.logged", { meal: t(MEAL_KEY_TO_I18N[mealLabel]) })}
        </ThemedText>
        <ThemedText style={styles.count} type="secondary">
          {t("add.loggedCount", { count: entries.length })}
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
            {t("add.nothingLogged")}
          </ThemedText>
          <ThemedText type="secondary" style={styles.emptyText}>
            {t("add.addFromFrequent")}
          </ThemedText>
        </View>
      ) : (
        <View style={{ gap: Spacing.md }}>
          {entries.map((entry) => {
            const d = entryDisplay(entry, t("add.quickAdd"));
            return (
              <FoodCard
                key={entry.id}
                title={d.title}
                calories={d.kcal}
                serving={entryDisplayServing(entry, t("food.perGramShort"), t("add.quickAdd"))}
                proteinG={d.protein_g}
                carbsG={d.carbs_g}
                fatG={d.fat_g}
                image={foodImageSource(d.imageUrl)}
                action={d.isQuickAdd ? "remove" : "stepper"}
                quantity={entry.quantity}
                onPress={d.isQuickAdd ? undefined : () => onSelect(entry)}
                onIncrement={() => onIncrement(entry)}
                onDecrement={() => onDecrement(entry)}
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
