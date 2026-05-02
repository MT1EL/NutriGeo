import RecipeCard from "@/components/cards/RecipeCard";
import Header from "@/components/headers";
import FeaturedRecipeHero from "@/components/recipes/FeaturedRecipeHero";
import RecipeCategoryChips from "@/components/recipes/RecipeCategoryChips";
import RecipesStatsBar from "@/components/recipes/RecipesStatsBar";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useRecipesList } from "@/hooks/use-recipes-list";
import { foodImageSource } from "@/utils/image";
import { difficultyLabel } from "@/utils/recipe";
import { Search } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function RecipesScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const {
    active,
    setActive,
    searchInput,
    setSearchInput,
    recipes,
    hero,
    rest,
    quickCount,
    isLoading,
    refetch,
  } = useRecipesList();

  const ListHeader = (
    <View style={{ gap: Spacing.lg }}>
      <RecipeCategoryChips active={active} onChange={setActive} />
      {recipes.length > 0 && (
        <RecipesStatsBar total={recipes.length} quickCount={quickCount} />
      )}
      {hero && <FeaturedRecipeHero recipe={hero} />}
      {rest.length > 0 && (
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>ყველა რეცეპტი</ThemedText>
          <ThemedText type="secondary" style={styles.sectionCount}>
            {rest.length} ნიმუში
          </ThemedText>
        </View>
      )}
    </View>
  );

  const ListEmpty = isLoading ? (
    <View style={styles.loaderRow}>
      <ActivityIndicator color={theme.brand} />
    </View>
  ) : (
    <View style={styles.empty}>
      <View style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}>
        <Search color={theme.brand} size={28} />
      </View>
      <ThemedText style={styles.emptyTitle}>ვერ ვიპოვე რეცეპტი</ThemedText>
      <ThemedText type="secondary" style={styles.emptyText}>
        სცადე სხვა კატეგორია
      </ThemedText>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: theme.surface }]}>
      <Header
        title="რეცეპტები"
        inputPlaceholder="მოძებნე რეცეპტი..."
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            id={item.id}
            title={item.title}
            description={item.description ?? ""}
            calories={item.kcal}
            durationMin={item.duration_min}
            servings={item.servings}
            difficulty={difficultyLabel(item.difficulty)}
            image={foodImageSource(item.cover_url)}
            tag={
              item.dietary_tags?.[0]
                ? { label: item.dietary_tags[0], color: theme.brand }
                : undefined
            }
            initiallySaved={item.saved}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={hero ? null : ListEmpty}
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        refreshing={isManualRefreshing}
        onRefresh={async () => {
          setIsManualRefreshing(true);
          try {
            await refetch();
          } finally {
            setIsManualRefreshing(false);
          }
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: Spacing.lg,
  },
  container: {
    gap: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    paddingBottom: TAB_BAR_HEIGHT + 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  sectionCount: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: Type.sm,
  },
  loaderRow: {
    paddingVertical: Spacing.huge,
    alignItems: "center",
  },
});
