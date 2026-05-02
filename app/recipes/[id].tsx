import {
  getRecipeById,
  getSavedRecipes,
  listRecipes,
  saveRecipe,
  unsaveRecipe,
} from "@/api/recipes";
import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import {
  Beef,
  ChefHat,
  ChevronLeft,
  Clock,
  Droplet,
  Flame,
  Heart,
  Leaf,
  Share2,
  Star,
  Users,
  Wheat,
} from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HERO_HEIGHT = 360;

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

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const recipeQuery = useQuery({
    queryKey: ["recipes", "detail", id],
    queryFn: () => getRecipeById(id!),
    enabled: !!id,
  });
  const relatedQuery = useQuery({
    queryKey: ["recipes", "list"],
    queryFn: () => listRecipes({ limit: 10 }),
  });
  const savedListQuery = useQuery({
    queryKey: ["recipes", "saved"],
    queryFn: getSavedRecipes,
  });

  const recipe = recipeQuery.data?.data;
  const relatedAll: Recipe[] = useMemo(() => {
    const raw = relatedQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [relatedQuery.data]);
  const related = useMemo(
    () => relatedAll.filter((r) => r.id !== id).slice(0, 3),
    [relatedAll, id],
  );

  const isSavedFromList = useMemo(() => {
    if (!id) return false;
    const raw = savedListQuery.data?.data;
    if (!Array.isArray(raw)) return false;
    return raw.some((r) => r.id === id);
  }, [savedListQuery.data, id]);

  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const saved =
    savedOverride !== null
      ? savedOverride
      : !!recipe?.saved || isSavedFromList;

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());

  const saveMutation = useMutation({
    mutationFn: ({ next }: { next: boolean }) =>
      next ? saveRecipe(id!) : unsaveRecipe(id!),
    onMutate: ({ next }) => {
      setSavedOverride(next);
    },
    onError: (err, { next }) => {
      setSavedOverride(!next);
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipes", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["recipes", "saved"] });
    },
  });

  const handleShare = async () => {
    if (!recipe) return;
    try {
      await Share.share({
        title: recipe.title,
        message: `${recipe.title}\n\n${recipe.description ?? ""}`.trim(),
      });
    } catch {
      // user cancelled
    }
  };

  if (recipeQuery.isLoading) {
    return (
      <SafeAreaView
        style={[styles.notFound, { backgroundColor: theme.surface }]}
      >
        <ActivityIndicator color={theme.brand} />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView
        style={[styles.notFound, { backgroundColor: theme.surface }]}
      >
        <ThemedText style={styles.notFoundText}>
          რეცეპტი ვერ მოიძებნა
        </ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText color={theme.brand} style={styles.notFoundLink}>
            უკან დაბრუნება
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const toggleIngredient = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const toggleStep = (i: number) => {
    setDoneSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const ingredients = recipe.ingredients ?? [];
  const steps = recipe.steps ?? [];
  const dietaryTags = recipe.dietary_tags ?? [];

  const macroTotal = recipe.protein_g + recipe.carbs_g + recipe.fat_g || 1;
  const macros = [
    {
      label: "ცილა",
      g: recipe.protein_g,
      pct: Math.round((recipe.protein_g / macroTotal) * 100),
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: "ნახშირწყ.",
      g: recipe.carbs_g,
      pct: Math.round((recipe.carbs_g / macroTotal) * 100),
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: "ცხიმი",
      g: recipe.fat_g,
      pct: Math.round((recipe.fat_g / macroTotal) * 100),
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image
            source={imageSource(recipe.cover_url)}
            style={styles.hero}
            contentFit="cover"
          />
          <Canvas
            style={[StyleSheet.absoluteFill, { height: HERO_HEIGHT }]}
            pointerEvents="none"
          >
            <Rect x={0} y={0} width={500} height={HERO_HEIGHT}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, HERO_HEIGHT)}
                colors={[
                  "rgba(0,0,0,0.55)",
                  "rgba(0,0,0,0)",
                  "rgba(0,0,0,0.85)",
                ]}
              />
            </Rect>
          </Canvas>

          <SafeAreaView edges={["top"]} style={styles.heroOverlay}>
            <View style={styles.topRow}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.iconBtn}
                activeOpacity={0.8}
                hitSlop={6}
              >
                <ChevronLeft color="#FFFFFF" size={22} />
              </TouchableOpacity>
              <View style={styles.topRowRight}>
                <TouchableOpacity
                  onPress={() => saveMutation.mutate({ next: !saved })}
                  style={styles.iconBtn}
                  activeOpacity={0.8}
                  hitSlop={6}
                  disabled={saveMutation.isPending}
                >
                  <Heart
                    color={saved ? "#FF4D6D" : "#FFFFFF"}
                    size={18}
                    fill={saved ? "#FF4D6D" : "transparent"}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.iconBtn}
                  activeOpacity={0.8}
                  hitSlop={6}
                  onPress={handleShare}
                >
                  <Share2 color="#FFFFFF" size={18} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroBottom}>
              {dietaryTags[0] && (
                <View
                  style={[styles.tag, { backgroundColor: theme.brand + "EE" }]}
                >
                  <ThemedText style={styles.tagText} color="#FFFFFF">
                    {dietaryTags[0]}
                  </ThemedText>
                </View>
              )}
              <ThemedText
                style={styles.title}
                color="#FFFFFF"
                numberOfLines={2}
              >
                {recipe.title}
              </ThemedText>
              {recipe.rating.rating_count > 0 && (
                <View style={styles.ratingRow}>
                  <Star color="#FFB020" size={13} fill="#FFB020" />
                  <ThemedText
                    style={styles.ratingText}
                    color="rgba(255,255,255,0.95)"
                  >
                    {recipe.rating.avg_rating.toFixed(1)}
                  </ThemedText>
                  <ThemedText
                    style={styles.ratingCount}
                    color="rgba(255,255,255,0.7)"
                  >
                    ({recipe.rating.rating_count} შეფასება)
                  </ThemedText>
                </View>
              )}
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.statsCard}>
          <BaseCard style={styles.statsCardInner}>
            <View style={styles.statCol}>
              <Clock color={theme.brand} size={18} />
              <ThemedText style={styles.statValue}>
                {recipe.duration_min} წთ
              </ThemedText>
              <ThemedText style={styles.statLabel} type="secondary">
                დრო
              </ThemedText>
            </View>
            <View
              style={[styles.statSep, { backgroundColor: theme.borderLight }]}
            />
            <View style={styles.statCol}>
              <Users color={theme.brand} size={18} />
              <ThemedText style={styles.statValue}>
                {recipe.servings}
              </ThemedText>
              <ThemedText style={styles.statLabel} type="secondary">
                პორცია
              </ThemedText>
            </View>
            <View
              style={[styles.statSep, { backgroundColor: theme.borderLight }]}
            />
            <View style={styles.statCol}>
              <ChefHat color={theme.brand} size={18} />
              <ThemedText style={styles.statValue} numberOfLines={1}>
                {difficultyLabel(recipe.difficulty)}
              </ThemedText>
              <ThemedText style={styles.statLabel} type="secondary">
                სირთულე
              </ThemedText>
            </View>
          </BaseCard>
        </View>

        <View style={styles.body}>
          {recipe.description && (
            <ThemedText style={styles.lead} type="secondary">
              {recipe.description}
            </ThemedText>
          )}

          {dietaryTags.length > 0 && (
            <View style={styles.dietaryRow}>
              {dietaryTags.map((t) => (
                <View
                  key={t}
                  style={[
                    styles.dietaryChip,
                    { backgroundColor: theme.brandSoft },
                  ]}
                >
                  <Leaf color={theme.brand} size={11} />
                  <ThemedText style={styles.dietaryText} color={theme.brand}>
                    {t}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          <BaseCard>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View
                  style={[
                    styles.cardIcon,
                    { backgroundColor: theme.brandSoft },
                  ]}
                >
                  <Flame color={theme.brand} size={18} />
                </View>
                <View style={{ gap: 2, flex: 1 }}>
                  <ThemedText style={styles.cardTitle} numberOfLines={1}>
                    კვებითი ღირებულება
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    1 პორციაში
                  </ThemedText>
                </View>
              </View>
              <View
                style={[styles.calBadge, { backgroundColor: theme.brandSoft }]}
              >
                <ThemedText style={styles.calBadgeText} color={theme.brand}>
                  {recipe.kcal} კალ
                </ThemedText>
              </View>
            </View>

            <View style={styles.macroBarStack}>
              {macros.map((m) => (
                <View
                  key={m.label}
                  style={{
                    width: `${m.pct}%`,
                    backgroundColor: m.color,
                  }}
                />
              ))}
            </View>

            <View style={{ gap: Spacing.md }}>
              {macros.map(({ label, g, pct, color, Icon }) => (
                <View key={label} style={styles.macroRow}>
                  <View
                    style={[
                      styles.macroIcon,
                      { backgroundColor: color + "22" },
                    ]}
                  >
                    <Icon color={color} size={14} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.macroLabel}>{label}</ThemedText>
                    <ThemedText style={styles.macroSub} type="secondary">
                      {pct}%
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.macroValue} color={color}>
                    {g}გ
                  </ThemedText>
                </View>
              ))}
            </View>
          </BaseCard>

          {ingredients.length > 0 && (
            <BaseCard>
              <View style={styles.cardHeader}>
                <View style={{ gap: 2 }}>
                  <ThemedText style={styles.cardTitle}>
                    ინგრედიენტები
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    {ingredients.length} კომპონენტი · {checked.size} მონიშნულია
                  </ThemedText>
                </View>
              </View>
              <View style={{ gap: Spacing.sm }}>
                {ingredients.map((ing, i) => {
                  const isChecked = checked.has(i);
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.6}
                      onPress={() => toggleIngredient(i)}
                      style={styles.ingredientRow}
                    >
                      <View
                        style={[
                          styles.checkBox,
                          {
                            backgroundColor: isChecked
                              ? theme.brand
                              : "transparent",
                            borderColor: isChecked ? theme.brand : theme.border,
                          },
                        ]}
                      >
                        {isChecked && (
                          <ThemedText style={styles.checkText} color="#FFFFFF">
                            ✓
                          </ThemedText>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <ThemedText
                          style={[
                            styles.ingredientName,
                            isChecked && {
                              textDecorationLine: "line-through",
                              opacity: 0.5,
                            },
                          ]}
                        >
                          {ing.name}
                        </ThemedText>
                      </View>
                      <ThemedText style={styles.ingredientQty} type="secondary">
                        {ing.qty}
                      </ThemedText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BaseCard>
          )}

          {steps.length > 0 && (
            <BaseCard>
              <View style={styles.cardHeader}>
                <View style={{ gap: 2 }}>
                  <ThemedText style={styles.cardTitle}>მომზადება</ThemedText>
                  <ThemedText type="secondary" style={styles.cardCaption}>
                    {steps.length} ნაბიჯი · {doneSteps.size}/{steps.length}{" "}
                    შესრულებულია
                  </ThemedText>
                </View>
              </View>
              <View style={{ gap: Spacing.md }}>
                {steps.map((step, i) => {
                  const isDone = doneSteps.has(i);
                  return (
                    <TouchableOpacity
                      key={i}
                      activeOpacity={0.7}
                      onPress={() => toggleStep(i)}
                      style={styles.stepRow}
                    >
                      <View
                        style={[
                          styles.stepNum,
                          {
                            backgroundColor: isDone
                              ? theme.brand
                              : theme.brandSoft,
                            borderColor: theme.brand,
                          },
                        ]}
                      >
                        <ThemedText
                          style={styles.stepNumText}
                          color={isDone ? "#FFFFFF" : theme.brand}
                        >
                          {i + 1}
                        </ThemedText>
                      </View>
                      <View style={{ flex: 1, gap: 4 }}>
                        <ThemedText
                          style={[styles.stepText, isDone && { opacity: 0.5 }]}
                        >
                          {step.text}
                        </ThemedText>
                        {step.duration_min !== undefined && (
                          <View style={styles.stepMeta}>
                            <Clock color={theme.textSecondary} size={11} />
                            <ThemedText
                              style={styles.stepMetaText}
                              type="secondary"
                            >
                              ~{step.duration_min} წთ
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </BaseCard>
          )}

          {related.length > 0 && (
            <View style={{ gap: Spacing.md }}>
              <ThemedText style={styles.sectionTitle}>
                მსგავსი რეცეპტი
              </ThemedText>
              <View style={{ gap: Spacing.md }}>
                {related.map((r) => (
                  <TouchableOpacity
                    key={r.id}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/recipes/${r.id}`)}
                  >
                    <BaseCard style={styles.relatedCard}>
                      <Image
                        source={imageSource(r.cover_url)}
                        style={styles.relatedImage}
                        contentFit="cover"
                      />
                      <View style={{ flex: 1, gap: 4 }}>
                        <ThemedText
                          style={styles.relatedTitle}
                          numberOfLines={1}
                        >
                          {r.title}
                        </ThemedText>
                        <View style={styles.relatedMeta}>
                          <Flame color={theme.textSecondary} size={11} />
                          <ThemedText
                            style={styles.relatedMetaText}
                            type="secondary"
                          >
                            {r.kcal} კალ · {r.duration_min} წთ
                          </ThemedText>
                        </View>
                      </View>
                    </BaseCard>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
  },
  notFoundText: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  notFoundLink: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  heroWrap: {
    height: HERO_HEIGHT,
    width: "100%",
    overflow: "hidden",
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 56,
    paddingTop: Spacing.sm,
    justifyContent: "space-between",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topRowRight: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroBottom: {
    gap: Spacing.sm,
  },
  tag: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: Type.xxl,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  ratingCount: {
    fontSize: Type.xs,
    marginLeft: 2,
  },
  statsCard: {
    paddingHorizontal: Spacing.xl,
    marginTop: -28,
  },
  statsCardInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: 0,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statSep: {
    width: StyleSheet.hairlineWidth,
    height: 36,
  },
  statValue: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.lg,
  },
  lead: {
    fontSize: Type.base,
    lineHeight: 22,
  },
  dietaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  dietaryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  dietaryText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  calBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  calBadgeText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  macroBarStack: {
    flexDirection: "row",
    height: 10,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  macroIcon: {
    width: 28,
    height: 28,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  macroLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  macroSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  macroValue: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: 4,
  },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkText: {
    fontSize: 12,
    fontWeight: "800",
  },
  ingredientName: {
    fontSize: Type.base,
    fontWeight: "500",
  },
  ingredientQty: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  stepRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  stepNum: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: {
    fontSize: Type.sm,
    fontWeight: "800",
  },
  stepText: {
    fontSize: Type.base,
    lineHeight: 22,
  },
  stepMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepMetaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  relatedCard: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
  },
  relatedImage: {
    width: 64,
    aspectRatio: 1,
    borderRadius: Radius.md,
  },
  relatedTitle: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  relatedMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  relatedMetaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
});
