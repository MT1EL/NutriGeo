import ThemedText from "@/components/ui/ThemedText";
import { type MealConfig, MealKey } from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  mealKey: MealKey;
  config: MealConfig;
  count: number;
};

export default function MealHeader({ mealKey, config, count }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <>
      <View style={[styles.handleWrap, { backgroundColor: theme.surface }]}>
        <View style={[styles.handle, { backgroundColor: theme.border }]} />
      </View>
      <View style={styles.row}>
        <View style={styles.left}>
          <View
            style={[
              styles.icon,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? config.iconTintDark
                    : config.iconTint,
              },
            ]}
          >
            <config.Icon color={config.iconColor} size={24} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.title}>{t(`meal.${mealKey}`)}</ThemedText>
            <ThemedText type="secondary" style={styles.subtitle}>
              {t("meal.foodCount", { count })}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={8}
          style={[styles.closeBtn, { backgroundColor: theme.borderLight }]}
          activeOpacity={0.6}
        >
          <X color={theme.text} size={18} />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  handleWrap: {
    alignItems: "center",
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
