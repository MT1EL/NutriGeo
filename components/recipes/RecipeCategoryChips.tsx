import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

const CATEGORIES = [
  { key: "all", label: "ყველა" },
  { key: "breakfast", label: "საუზმე" },
  { key: "lunch", label: "სადილი" },
  { key: "dinner", label: "ვახშამი" },
  { key: "dessert", label: "დესერტი" },
  { key: "vegan", label: "ვეგეტარიანული" },
  { key: "quick", label: "სწრაფი" },
];

type Props = {
  active: string;
  onChange: (key: string) => void;
};

export default function RecipeCategoryChips({ active, onChange }: Props) {
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
      {CATEGORIES.map((c) => {
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
