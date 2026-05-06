import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

const CATEGORY_KEYS = [
  { key: "all", labelKey: "recipes.categoryAll" },
  { key: "breakfast", labelKey: "recipes.categoryBreakfast" },
  { key: "lunch", labelKey: "recipes.categoryLunch" },
  { key: "dinner", labelKey: "recipes.categoryDinner" },
  { key: "dessert", labelKey: "recipes.categoryDessert" },
  { key: "vegan", labelKey: "recipes.categoryVegan" },
  { key: "quick", labelKey: "recipes.categoryQuick" },
];

type Props = {
  active: string;
  onChange: (key: string) => void;
};

export default function RecipeCategoryChips({ active, onChange }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={{
        marginHorizontal: -Spacing.xl,
        paddingHorizontal: Spacing.xl,
      }}
    >
      {CATEGORY_KEYS.map((c) => {
        const isActive = c.key === active;
        return (
          <TouchableOpacity
            key={c.key}
            onPress={() => onChange(c.key)}
            activeOpacity={0.8}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? theme.brand : theme.card,
                borderColor: isActive ? theme.brand : theme.border,
              },
            ]}
          >
            <ThemedText
              style={styles.label}
              color={isActive ? "#FFFFFF" : theme.text}
            >
              {t(c.labelKey)}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
