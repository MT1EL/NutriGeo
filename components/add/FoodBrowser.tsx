import type { Food } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { BrowseTab } from "@/hooks/use-add-screen";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import {
  History,
  LayoutGrid,
  LucideIcon,
  Sparkles,
  Star,
} from "lucide-react-native";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const TABS: { key: BrowseTab; label: string; Icon: LucideIcon }[] = [
  { key: "all", label: "ყველა", Icon: LayoutGrid },
  { key: "frequent", label: "ხშირი", Icon: History },
  { key: "favorites", label: "საყვარელი", Icon: Star },
  { key: "recent", label: "ბოლო", Icon: Sparkles },
];

type Props = {
  hasQuery: boolean;
  browse: BrowseTab;
  onBrowseChange: (next: BrowseTab) => void;
  foods: Food[];
  isLoading: boolean;
  emptyText: string;
  onSelect: (food: Food) => void;
  onAdd: (food: Food) => void;
};

export default function FoodBrowser({
  hasQuery,
  browse,
  onBrowseChange,
  foods,
  isLoading,
  emptyText,
  onSelect,
  onAdd,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          {hasQuery ? "ძიების შედეგი" : "დაამატე"}
        </ThemedText>
      </View>

      {!hasQuery && (
        <View style={styles.tabsRow}>
          {TABS.map(({ key, label, Icon }) => {
            const isActive = browse === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => onBrowseChange(key)}
                activeOpacity={0.85}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive ? theme.brand : theme.card,
                    borderColor: isActive ? theme.brand : theme.border,
                  },
                ]}
              >
                <Icon
                  color={isActive ? "#FFFFFF" : theme.textSecondary}
                  size={14}
                />
                <ThemedText
                  style={styles.tabLabel}
                  color={isActive ? "#FFFFFF" : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {isLoading ? (
        <View style={styles.loaderRow}>
          <ActivityIndicator color={theme.brand} />
        </View>
      ) : foods.length === 0 ? (
        <View
          style={[
            styles.empty,
            { backgroundColor: theme.card, borderColor: theme.borderLight },
          ]}
        >
          <ThemedText type="secondary" style={styles.emptyText}>
            {emptyText}
          </ThemedText>
        </View>
      ) : (
        <View style={{ gap: Spacing.md, marginTop: Spacing.xs }}>
          {foods.map((food) => (
            <FoodCard
              key={food.id}
              title={food.name}
              calories={caloriesForFood(food)}
              serving={servingLabel(food)}
              proteinG={macroForFood(food.protein_g_per_100g, food)}
              carbsG={macroForFood(food.carbs_g_per_100g, food)}
              fatG={macroForFood(food.fat_g_per_100g, food)}
              image={foodImageSource(food.image_url)}
              action="add"
              onPress={() => onSelect(food)}
              onActionPress={() => onAdd(food)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  tabsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  tabLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  loaderRow: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  empty: {
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  emptyText: {
    fontSize: Type.xs,
    textAlign: "center",
  },
});
