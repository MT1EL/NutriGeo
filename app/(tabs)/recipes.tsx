import { getFeaturedRecipes, listRecipes } from "@/api/recipes";
import type { Recipe } from "@/api/types";
import RecipeCard from "@/components/cards/RecipeCard";
import Header from "@/components/headers";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ChefHat,
  Clock,
  Flame,
  Search,
  Star,
  Users,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const RECIPE_CATEGORIES = [
  { key: "all", label: "ყველა" },
  { key: "breakfast", label: "საუზმე" },
  { key: "lunch", label: "სადილი" },
  { key: "dinner", label: "ვახშამი" },
  { key: "dessert", label: "დესერტი" },
  { key: "vegan", label: "ვეგეტარიანული" },
  { key: "quick", label: "სწრაფი" },
];

const DIFFICULTY_LABELS: Record<NonNullable<Recipe["difficulty"]>, string> = {
  easy: "მარტივი",
  medium: "საშუალო",
  hard: "რთული",
};

function difficultyLabel(d: Recipe["difficulty"]) {
  if (!d) return "—";
  return DIFFICULTY_LABELS[d];
}

function imageSource(url: string | undefined) {
  return url ? { uri: url } : require("@/assets/images/cheesecake.png");
}

const HeroRecipe = ({ recipe }: { recipe: Recipe }) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const tagLabel = recipe.dietary_tags?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
    >
      <View style={styles.hero} onLayout={onLayout}>
        <Image
          source={imageSource(recipe.cover_url)}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {size.w > 0 && size.h > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Canvas style={StyleSheet.absoluteFill}>
              <Rect x={0} y={0} width={size.w} height={size.h}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, size.h)}
                  colors={[
                    "rgba(0,0,0,0.45)",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.85)",
                  ]}
                />
              </Rect>
            </Canvas>
          </View>
        )}
        <View style={styles.heroTopRow}>
          <View style={[styles.heroFeatured, { backgroundColor: theme.brand }]}>
            <Star color="#FFFFFF" size={11} fill="#FFFFFF" />
            <ThemedText style={styles.heroFeaturedText} color="#FFFFFF">
              კვირის რჩეული
            </ThemedText>
          </View>
          {tagLabel && (
            <View
              style={[styles.heroTag, { backgroundColor: theme.brand + "EE" }]}
            >
              <ThemedText style={styles.heroTagText} color="#FFFFFF">
                {tagLabel}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.heroBottom}>
          <ThemedText
            style={styles.heroTitle}
            color="#FFFFFF"
            numberOfLines={2}
          >
            {recipe.title}
          </ThemedText>
          {recipe.description && (
            <ThemedText
              style={styles.heroDesc}
              color="rgba(255,255,255,0.85)"
              numberOfLines={2}
            >
              {recipe.description}
            </ThemedText>
          )}
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMeta}>
              <Flame color="#FFFFFF" size={12} />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.kcal} კალ
              </ThemedText>
            </View>
            <View style={styles.heroMeta}>
              <Clock color="#FFFFFF" size={12} />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.duration_min} წთ
              </ThemedText>
            </View>
            <View style={styles.heroMeta}>
              <Users color="#FFFFFF" size={12} />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.servings} პორცია
              </ThemedText>
            </View>
            {recipe.rating.rating_count > 0 && (
              <View style={styles.heroMeta}>
                <Star color="#FFB020" size={12} fill="#FFB020" />
                <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                  {recipe.rating.avg_rating.toFixed(1)}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function RecipesScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [active, setActive] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const listQuery = useQuery({
    queryKey: ["recipes", "list", active, debouncedQuery],
    queryFn: () =>
      listRecipes({
        limit: 30,
        ...(active !== "all" ? { category: active } : {}),
        ...(debouncedQuery ? { q: debouncedQuery } : {}),
      }),
  });
  const featuredQuery = useQuery({
    queryKey: ["recipes", "featured"],
    queryFn: getFeaturedRecipes,
    enabled: !debouncedQuery,
  });

  const rawRecipes: Recipe[] = useMemo(() => {
    const raw = listQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [listQuery.data]);

  // Client-side fallback filter so search works even if backend ignores ?q=.
  const recipes: Recipe[] = useMemo(() => {
    if (!debouncedQuery) return rawRecipes;
    const needle = debouncedQuery.toLowerCase();
    return rawRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        (r.description?.toLowerCase().includes(needle) ?? false),
    );
  }, [rawRecipes, debouncedQuery]);

  const featuredList: Recipe[] = useMemo(() => {
    const raw = featuredQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [featuredQuery.data]);

  const hero: Recipe | undefined = debouncedQuery
    ? undefined
    : active === "all"
      ? (featuredList[0] ?? recipes[0])
      : recipes[0];
  const rest = useMemo(() => {
    if (!hero) return recipes;
    return recipes.filter((r) => r.id !== hero.id);
  }, [recipes, hero]);

  const avgCal = useMemo(
    () =>
      recipes.length === 0
        ? 0
        : Math.round(recipes.reduce((a, r) => a + r.kcal, 0) / recipes.length),
    [recipes],
  );
  const avgTime = useMemo(
    () =>
      recipes.length === 0
        ? 0
        : Math.round(
            recipes.reduce((a, r) => a + r.duration_min, 0) / recipes.length,
          ),
    [recipes],
  );

  const isLoading = listQuery.isLoading;

  const ListHeader = (
    <View style={{ gap: Spacing.lg }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        style={{ marginHorizontal: -Spacing.xl, paddingHorizontal: Spacing.xl }}
      >
        {RECIPE_CATEGORIES.map((c) => {
          const isActive = c.key === active;
          return (
            <TouchableOpacity
              key={c.key}
              onPress={() => setActive(c.key)}
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
                style={styles.chipLabel}
                color={isActive ? "#FFFFFF" : theme.text}
              >
                {c.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {recipes.length > 0 && (
        <View
          style={[
            styles.statsBar,
            { backgroundColor: theme.card, borderColor: theme.borderLight },
          ]}
        >
          <View style={styles.statsItem}>
            <ChefHat color={theme.brand} size={14} />
            <ThemedText style={styles.statsValue}>{recipes.length}</ThemedText>
            <ThemedText type="secondary" style={styles.statsLabel}>
              რეცეპტი
            </ThemedText>
          </View>
          <View
            style={[styles.statsSep, { backgroundColor: theme.borderLight }]}
          />
          <View style={styles.statsItem}>
            <Flame color="#FF7A45" size={14} />
            <ThemedText style={styles.statsValue}>{avgCal}</ThemedText>
            <ThemedText type="secondary" style={styles.statsLabel}>
              საშ. კალ
            </ThemedText>
          </View>
          <View
            style={[styles.statsSep, { backgroundColor: theme.borderLight }]}
          />
          <View style={styles.statsItem}>
            <Clock color="#5B6CE0" size={14} />
            <ThemedText style={styles.statsValue}>{avgTime}</ThemedText>
            <ThemedText type="secondary" style={styles.statsLabel}>
              საშ. წთ
            </ThemedText>
          </View>
        </View>
      )}

      {hero && <HeroRecipe recipe={hero} />}

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
            image={imageSource(item.cover_url)}
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
        refreshing={listQuery.isFetching}
        onRefresh={() => listQuery.refetch()}
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
  chipsRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  statsBar: {
    flexDirection: "row",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statsItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  statsValue: {
    fontSize: Type.base,
    fontWeight: "800",
  },
  statsLabel: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  statsSep: {
    width: StyleSheet.hairlineWidth,
    height: 24,
    alignSelf: "center",
  },
  hero: {
    width: "100%",
    height: 240,
    borderRadius: Radius.xl,
    overflow: "hidden",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroFeatured: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  heroFeaturedText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  heroTagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroBottom: {
    gap: 6,
  },
  heroTitle: {
    fontSize: Type.xxl,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  heroDesc: {
    fontSize: Type.sm,
    lineHeight: 18,
  },
  heroMetaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  heroMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroMetaText: {
    fontSize: Type.xs,
    fontWeight: "700",
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
