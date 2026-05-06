import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Beef, Droplet, Flame, Wheat } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  recipe: Recipe;
};

export default function RecipeNutrition({ recipe }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const macroTotal = recipe.protein_g + recipe.carbs_g + recipe.fat_g || 1;
  const macros = [
    {
      label: t("macros.protein"),
      g: recipe.protein_g,
      pct: Math.round((recipe.protein_g / macroTotal) * 100),
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: t("macros.carbsShort"),
      g: recipe.carbs_g,
      pct: Math.round((recipe.carbs_g / macroTotal) * 100),
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: t("macros.fat"),
      g: recipe.fat_g,
      pct: Math.round((recipe.fat_g / macroTotal) * 100),
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.cardIcon, { backgroundColor: theme.brandSoft }]}>
            <Flame color={theme.brand} size={18} />
          </View>
          <View style={{ gap: 2, flex: 1 }}>
            <ThemedText style={styles.cardTitle} numberOfLines={1}>
              {t("recipes.nutrition")}
            </ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              {t("recipes.perServing")}
            </ThemedText>
          </View>
        </View>
        <View style={[styles.calBadge, { backgroundColor: theme.brandSoft }]}>
          <ThemedText style={styles.calBadgeText} color={theme.brand}>
            {recipe.kcal} {t("macros.kcalShort")}
          </ThemedText>
        </View>
      </View>

      <View style={styles.macroBarStack}>
        {macros.map((m) => (
          <View
            key={m.label}
            style={{ width: `${m.pct}%`, backgroundColor: m.color }}
          />
        ))}
      </View>

      <View style={{ gap: Spacing.md }}>
        {macros.map(({ label, g, pct, color, Icon }) => (
          <View key={label} style={styles.macroRow}>
            <View style={[styles.macroIcon, { backgroundColor: color + "22" }]}>
              <Icon color={color} size={14} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.macroLabel}>{label}</ThemedText>
              <ThemedText style={styles.macroSub} type="secondary">
                {pct}%
              </ThemedText>
            </View>
            <ThemedText style={styles.macroValue} color={color}>
              {g}{t("macros.g")}
            </ThemedText>
          </View>
        ))}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  calBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  calBadgeText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  macroBarStack: {
    flexDirection: "row",
    height: 10,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  macroIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  macroLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  macroSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  macroValue: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
