import { getSavedRecipes } from "@/api/recipes";
import RecipeCard from "@/components/cards/RecipeCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { RecipeListSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { foodImageSource } from "@/utils/image";
import { difficultyLabel } from "@/utils/recipe";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";

export default function LibraryRecipesScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const { data, isLoading } = useQuery({
    queryKey: ["recipes", "saved"],
    queryFn: getSavedRecipes,
  });

  const recipes = data?.data ?? [];

  return (
    <SubScreenLayout
      title="შენახული რეცეპტები"
      subtitle={`${recipes.length} რეცეპტი`}
    >
      {isLoading ? (
        <RecipeListSkeleton count={3} />
      ) : recipes.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}>
            <Heart color={theme.brand} size={28} />
          </View>
          <ThemedText style={styles.emptyTitle}>ცარიელია</ThemedText>
          <ThemedText type="secondary" style={styles.emptyText}>
            რეცეპტების სიაში დააჭირე გულის ნიშანს — აქ შენახული რეცეპტები
            გამოჩნდება
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              id={r.id}
              title={r.title}
              description={r.description ?? ""}
              calories={r.kcal}
              durationMin={r.duration_min}
              servings={r.servings}
              difficulty={difficultyLabel(r.difficulty)}
              image={foodImageSource(r.cover_url)}
              tag={
                r.dietary_tags?.[0]
                  ? { label: r.dietary_tags[0], color: theme.brand }
                  : undefined
              }
              initiallySaved={r.saved ?? true}
            />
          ))}
        </View>
      )}
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
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
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
});
