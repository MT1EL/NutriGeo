import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Ingredient = NonNullable<Recipe["ingredients"]>[number];

type Props = {
  ingredients: Ingredient[];
};

export default function RecipeIngredients({ ingredients }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (ingredients.length === 0) return null;

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={{ gap: 2 }}>
          <ThemedText style={styles.cardTitle}>ინგრედიენტები</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            {ingredients.length} კომპონენტი · {checked.size} მონიშნულია
          </ThemedText>
        </View>
      </View>
      <View style={{ gap: Spacing.sm }}>
        {ingredients.map((ing, i) => {
          const isChecked = checked.has(i);
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.6}
              onPress={() => toggle(i)}
              style={styles.row}
            >
              <View
                style={[
                  styles.checkBox,
                  {
                    backgroundColor: isChecked ? theme.brand : "transparent",
                    borderColor: isChecked ? theme.brand : theme.border,
                  },
                ]}
              >
                {isChecked && (
                  <ThemedText style={styles.checkText} color="#FFFFFF">
                    ✓
                  </ThemedText>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText
                  style={[
                    styles.name,
                    isChecked && {
                      textDecorationLine: "line-through",
                      opacity: 0.5,
                    },
                  ]}
                >
                  {ing.name}
                </ThemedText>
              </View>
              <ThemedText style={styles.qty} type="secondary">
                {ing.qty}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
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
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: 4,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontSize: 12,
    fontWeight: "800",
  },
  name: {
    fontSize: Type.base,
    fontWeight: "500",
  },
  qty: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
