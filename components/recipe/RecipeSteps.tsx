import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Clock } from "lucide-react-native";
import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Step = NonNullable<Recipe["steps"]>[number];

type Props = {
  steps: Step[];
};

export default function RecipeSteps({ steps }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [done, setDone] = useState<Set<number>>(new Set());

  if (steps.length === 0) return null;

  const toggle = (i: number) => {
    setDone((prev) => {
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
          <ThemedText style={styles.cardTitle}>მომზადება</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            {steps.length} ნაბიჯი · {done.size}/{steps.length} შესრულებულია
          </ThemedText>
        </View>
      </View>
      <View style={{ gap: Spacing.md }}>
        {steps.map((step, i) => {
          const isDone = done.has(i);
          return (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              onPress={() => toggle(i)}
              style={styles.row}
            >
              <View
                style={[
                  styles.num,
                  {
                    backgroundColor: isDone ? theme.brand : theme.brandSoft,
                    borderColor: theme.brand,
                  },
                ]}
              >
                <ThemedText
                  style={styles.numText}
                  color={isDone ? "#FFFFFF" : theme.brand}
                >
                  {i + 1}
                </ThemedText>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText
                  style={[styles.text, isDone && { opacity: 0.5 }]}
                >
                  {step.text}
                </ThemedText>
                {step.duration_min !== undefined && (
                  <View style={styles.meta}>
                    <Clock color={theme.textSecondary} size={11} />
                    <ThemedText style={styles.metaText} type="secondary">
                      ~{step.duration_min} წთ
                    </ThemedText>
                  </View>
                )}
              </View>
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
    gap: Spacing.md,
  },
  num: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  numText: {
    fontSize: Type.sm,
    fontWeight: "800",
  },
  text: {
    fontSize: Type.base,
    lineHeight: 22,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
});
