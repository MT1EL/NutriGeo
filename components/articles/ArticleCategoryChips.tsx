import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type Category = { slug: string; label: string };

type Props = {
  categories: Category[];
  active: string;
  onChange: (slug: string) => void;
};

export default function ArticleCategoryChips({
  categories,
  active,
  onChange,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (categories.length <= 1) return null;

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
      {categories.map((c) => {
        const isActive = c.slug === active;
        return (
          <TouchableOpacity
            key={c.slug}
            onPress={() => onChange(c.slug)}
            activeOpacity={0.85}
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
              {c.label}
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
