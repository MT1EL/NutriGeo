import type { DayMeals } from "@/api/meals";
import { MEAL_CONFIGS, MEAL_KEY_TO_API, MEAL_KEYS } from "@/constants/meals";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import { ChevronRight, CirclePlus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

const MealsCard = ({ data }: { data?: DayMeals }) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <BaseCard>
      <View style={[styles.row, styles.spaced]}>
        <ThemedText style={styles.title}>{t("home.todaysFood")}</ThemedText>
        <TouchableOpacity
          onPress={() => router.navigate("/add")}
          hitSlop={8}
          style={[styles.addBtn, { backgroundColor: theme.brandSoft }]}
        >
          <CirclePlus size={18} color={theme.brand} />
        </TouchableOpacity>
      </View>

      {MEAL_KEYS.map((key) => {
        const cfg = MEAL_CONFIGS[key];
        const meal = data?.meals?.find(
          (m) => m.meal_key === MEAL_KEY_TO_API[key],
        );
        const entries = meal?.entries ?? [];
        const calories = Math.round(meal?.kcal ?? 0);
        const summary =
          entries.length === 0
            ? t("home.noEntriesYet")
            : entries
                .map((e) => e.food?.name)
                .filter(Boolean)
                .join(", ");

        return (
          <TouchableOpacity
            key={key}
            activeOpacity={0.7}
            onPress={() =>
              router.push({ pathname: "/meal/[meal]", params: { meal: key } })
            }
            style={[styles.row, { gap: Spacing.md }]}
          >
            <View
              style={[
                styles.iconWrapper,
                {
                  backgroundColor:
                    colorScheme === "dark" ? cfg.iconTintDark : cfg.iconTint,
                },
              ]}
            >
              <cfg.Icon color={cfg.iconColor} size={22} />
            </View>
            <View style={{ flex: 1, gap: Spacing.xs }}>
              <View style={[styles.row, styles.spaced]}>
                <View style={[styles.row, { gap: Spacing.sm }]}>
                  <ThemedText style={styles.mealTypeTitle}>
                    {t(`meal.${MEAL_KEY_TO_API[key]}`)}
                  </ThemedText>
                </View>
                <View style={[styles.row, { gap: 2 }]}>
                  <ThemedText
                    style={styles.caloriesLabel}
                    color={
                      entries.length === 0 ? theme.textSecondary : theme.text
                    }
                  >
                    {calories} {t("macros.kcalShort")}
                  </ThemedText>
                  <ChevronRight color={theme.textSecondary} size={16} />
                </View>
              </View>
              <ThemedText
                style={styles.mealsLabel}
                type="secondary"
                numberOfLines={1}
              >
                {summary}
              </ThemedText>
            </View>
          </TouchableOpacity>
        );
      })}
    </BaseCard>
  );
};

export default MealsCard;
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaced: {
    justifyContent: "space-between",
  },
  title: { fontSize: Type.lg, fontWeight: "700", lineHeight: 22 },
  addBtn: {
    padding: Spacing.sm,
    borderRadius: Radius.pill,
  },
  iconWrapper: {
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  mealTypeTitle: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  timelabel: {
    fontSize: Type.xs,
  },
  caloriesLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  mealsLabel: {
    fontSize: Type.xs,
  },
});
