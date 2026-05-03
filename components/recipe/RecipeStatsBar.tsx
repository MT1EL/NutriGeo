import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { difficultyLabelKey } from "@/utils/recipe";
import { ChefHat, Clock, Users } from "lucide-react-native";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  recipe: Recipe;
};

export default function RecipeStatsBar({ recipe }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const difficultyKey = difficultyLabelKey(recipe.difficulty);
  const cols = [
    {
      Icon: Clock,
      value: `${recipe.duration_min} ${t("recipes.minShort")}`,
      label: t("recipes.time"),
    },
    {
      Icon: Users,
      value: `${recipe.servings}`,
      label: t("recipes.servingsLabel"),
    },
    {
      Icon: ChefHat,
      value: difficultyKey ? t(difficultyKey) : "—",
      label: t("recipes.difficulty"),
    },
  ];

  return (
    <View style={styles.outer}>
      <BaseCard style={styles.inner}>
        {cols.map(({ Icon, value, label }, i) => (
          <Fragment key={label}>
            {i > 0 && (
              <View
                style={[styles.sep, { backgroundColor: theme.borderLight }]}
              />
            )}
            <View style={styles.col}>
              <Icon color={theme.brand} size={18} />
              <ThemedText style={styles.value} numberOfLines={1}>
                {value}
              </ThemedText>
              <ThemedText style={styles.label} type="secondary">
                {label}
              </ThemedText>
            </View>
          </Fragment>
        ))}
      </BaseCard>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    paddingHorizontal: Spacing.xl,
    marginTop: -28,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
  },
  col: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  sep: {
    width: StyleSheet.hairlineWidth,
    height: 36,
  },
  value: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    opacity: 0.7,
  },
});
