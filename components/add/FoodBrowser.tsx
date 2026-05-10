import type { Food } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import { FoodListSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { BrowseTab } from "@/hooks/use-add-screen";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import {
  ChefHat,
  History,
  LayoutGrid,
  LucideIcon,
  Sparkles,
  Star,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const TABS: { key: BrowseTab; labelKey: string; Icon: LucideIcon }[] = [
  { key: "suggested", labelKey: "add.browseTabs.suggested", Icon: Sparkles },
  { key: "all", labelKey: "add.browseTabs.all", Icon: LayoutGrid },
  { key: "my", labelKey: "add.browseTabs.my", Icon: ChefHat },
  { key: "frequent", labelKey: "add.browseTabs.frequent", Icon: History },
  { key: "favorites", labelKey: "add.browseTabs.favorites", Icon: Star },
  { key: "recent", labelKey: "add.browseTabs.recent", Icon: Sparkles },
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
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm, overflow: "hidden" }}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>
          {hasQuery ? t("add.searchResult") : t("add.browseTitle")}
        </ThemedText>
      </View>

      {!hasQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
          // Bleed past the parent screen's 20px page padding so chips sit
          // edge-to-edge and the right side hints at scrollability.
          style={styles.tabsScroll}
        >
          {TABS.map(({ key, labelKey, Icon }) => {
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
                  {t(labelKey)}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {isLoading ? (
        <FoodListSkeleton count={4} />
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
              serving={servingLabel(food, t("food.perGramShort"))}
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
  tabsScroll: {
    marginHorizontal: -Spacing.xl,
    paddingHorizontal: Spacing.xl,
  },
  tabsRow: {
    flexDirection: "row",
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
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
