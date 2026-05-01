import RecipeCard from "@/components/cards/RecipeCard";
import Header from "@/components/headers";
import ThemedText from "@/components/ui/ThemedText";
import { Recipe, RECIPE_CATEGORIES, RECIPES } from "@/constants/recipes";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Canvas,
  LinearGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
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
import React, { useMemo, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const HeroRecipe = ({ recipe }: { recipe: Recipe }) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [size, setSize] = useState({ w: 0, h: 0 });
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
    >
      <View style={styles.hero} onLayout={onLayout}>
        <Image
          source={recipe.cover}
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
          <View
            style={[
              styles.heroFeatured,
              { backgroundColor: theme.brand },
            ]}
          >
            <Star color="#FFFFFF" size={11} fill="#FFFFFF" />
            <ThemedText style={styles.heroFeaturedText} color="#FFFFFF">
              კვირის რჩეული
            </ThemedText>
          </View>
          {recipe.tag && (
            <View
              style={[
                styles.heroTag,
                { backgroundColor: recipe.tag.color + "EE" },
              ]}
            >
              <recipe.tag.Icon color="#FFFFFF" size={11} />
              <ThemedText style={styles.heroTagText} color="#FFFFFF">
                {recipe.tag.label}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.heroBottom}>
          <ThemedText style={styles.heroTitle} color="#FFFFFF" numberOfLines={2}>
            {recipe.title}
          </ThemedText>
          <ThemedText
            style={styles.heroDesc}
            color="rgba(255,255,255,0.85)"
            numberOfLines={2}
          >
            {recipe.description}
          </ThemedText>
          <View style={styles.heroMetaRow}>
            <View style={styles.heroMeta}>
              <Flame color="#FFFFFF" size={12} />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.calories} კალ
              </ThemedText>
            </View>
            <View style={styles.heroMeta}>
              <Clock color="#FFFFFF" size={12} />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.durationMin} წთ
              </ThemedText>
            </View>
            <View style={styles.heroMeta}>
              <Users color="#FFFFFF" size={12} />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.servings} პორცია
              </ThemedText>
            </View>
            <View style={styles.heroMeta}>
              <Star color="#FFB020" size={12} fill="#FFB020" />
              <ThemedText style={styles.heroMetaText} color="#FFFFFF">
                {recipe.rating}
              </ThemedText>
            </View>
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

  const filtered = useMemo(() => {
    if (active === "all") return RECIPES;
    return RECIPES.filter((r) => r.categories.includes(active));
  }, [active]);

  const [hero, ...rest] = filtered;
  const avgCal = useMemo(
    () =>
      filtered.length === 0
        ? 0
        : Math.round(
            filtered.reduce((a, r) => a + r.calories, 0) / filtered.length
          ),
    [filtered]
  );
  const avgTime = useMemo(
    () =>
      filtered.length === 0
        ? 0
        : Math.round(
            filtered.reduce((a, r) => a + r.durationMin, 0) / filtered.length
          ),
    [filtered]
  );

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

      {filtered.length > 0 && (
        <View
          style={[
            styles.statsBar,
            { backgroundColor: theme.card, borderColor: theme.borderLight },
          ]}
        >
          <View style={styles.statsItem}>
            <ChefHat color={theme.brand} size={14} />
            <ThemedText style={styles.statsValue}>{filtered.length}</ThemedText>
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

  const ListEmpty = (
    <View style={styles.empty}>
      <View
        style={[
          styles.emptyIcon,
          { backgroundColor: theme.brandSoft },
        ]}
      >
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
      <Header title="რეცეპტები" />
      <FlatList
        data={rest}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            id={item.id}
            title={item.title}
            description={item.description}
            calories={item.calories}
            durationMin={item.durationMin}
            servings={item.servings}
            difficulty={item.difficulty}
            tag={item.tag}
            initiallySaved={item.saved}
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={hero ? null : ListEmpty}
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
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
});
