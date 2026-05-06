import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { ChefHat, Zap } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";
import Skeleton from "../ui/Skeleton";

type Props = {
  total: number;
  quickCount: number;
  isLoading: boolean;
};

export default function RecipesStatsBar({
  total,
  quickCount,
  isLoading,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (!isLoading && !total) return;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: theme.card, borderColor: theme.borderLight },
      ]}
    >
      <View style={styles.item}>
        <ChefHat color={theme.brand} size={14} />
        {total ? (
          <ThemedText style={styles.value}>{total}</ThemedText>
        ) : (
          <Skeleton width={12} height={19} />
        )}
        <ThemedText type="secondary" style={styles.label}>
          {t("recipes.recipeShort")}
        </ThemedText>
      </View>
      <View style={[styles.sep, { backgroundColor: theme.borderLight }]} />
      <View style={styles.item}>
        <Zap color="#5B6CE0" size={14} />
        {quickCount ? (
          <ThemedText style={styles.value}>{quickCount}</ThemedText>
        ) : (
          <Skeleton width={12} height={19} />
        )}
        <ThemedText type="secondary" style={styles.label}>
          {t("recipes.underMin")}
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
