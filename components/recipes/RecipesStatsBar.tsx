import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { ChefHat, Zap } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  total: number;
  quickCount: number;
};

export default function RecipesStatsBar({ total, quickCount }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.card, borderColor: theme.borderLight },
      ]}
    >
      <View style={styles.item}>
        <ChefHat color={theme.brand} size={14} />
        <ThemedText style={styles.value}>{total}</ThemedText>
        <ThemedText type="secondary" style={styles.label}>
          რეცეპტი
        </ThemedText>
      </View>
      <View style={[styles.sep, { backgroundColor: theme.borderLight }]} />
      <View style={styles.item}>
        <Zap color="#5B6CE0" size={14} />
        <ThemedText style={styles.value}>{quickCount}</ThemedText>
        <ThemedText type="secondary" style={styles.label}>
          30 წთ-მდე
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  value: {
    fontSize: Type.base,
    fontWeight: "800",
  },
  label: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  sep: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    alignSelf: "center",
  },
});
