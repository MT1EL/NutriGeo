import RecipeHero from "@/components/recipe/RecipeHero";
import RecipeIngredients from "@/components/recipe/RecipeIngredients";
import RecipeNutrition from "@/components/recipe/RecipeNutrition";
import RecipeRelated from "@/components/recipe/RecipeRelated";
import RecipeStatsBar from "@/components/recipe/RecipeStatsBar";
import RecipeSteps from "@/components/recipe/RecipeSteps";
import { RecipeDetailSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useRecipeDetail } from "@/hooks/use-recipe-detail";
import { router, useLocalSearchParams } from "expo-router";
import { Leaf } from "lucide-react-native";
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RecipeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { recipe, related, saved, isLoading, toggleSaved, isToggling } =
    useRecipeDetail(id);

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <RecipeDetailSkeleton />
      </View>
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

  const dietaryTags = recipe.dietary_tags ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        <RecipeHero
          recipe={recipe}
          saved={saved}
          isToggling={isToggling}
          onToggleSaved={toggleSaved}
          onShare={handleShare}
        />

        <RecipeStatsBar recipe={recipe} />

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

          <RecipeNutrition recipe={recipe} />
          <RecipeIngredients ingredients={recipe.ingredients ?? []} />
          <RecipeSteps steps={recipe.steps ?? []} />
          <RecipeRelated related={related} />
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
});
