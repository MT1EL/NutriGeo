import ArticleCover from "@/components/cards/ArticleCover";
import ArticleCategoryChips from "@/components/articles/ArticleCategoryChips";
import ArticlesIndexHeader from "@/components/articles/ArticlesIndexHeader";
import FeaturedArticleCard from "@/components/articles/FeaturedArticleCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useArticlesList } from "@/hooks/use-articles-list";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";

export default function ArticlesIndex() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { activeCat, setActiveCat, articles, categories, hero, rest, isLoading } =
    useArticlesList();

  return (
    <ScrollView
      style={{ backgroundColor: theme.surface }}
      contentContainerStyle={{ paddingBottom: Spacing.huge }}
      showsVerticalScrollIndicator={false}
    >
      <ArticlesIndexHeader />

      <View style={styles.body}>
        <ArticleCategoryChips
          categories={categories}
          active={activeCat}
          onChange={setActiveCat}
        />

        {isLoading && articles.length === 0 ? (
          <View style={styles.loaderRow}>
            <ActivityIndicator color={theme.brand} />
          </View>
        ) : null}

        {hero && <FeaturedArticleCard article={hero} />}

        {rest.length > 0 && (
          <View style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.sectionTitle}>ყველა სტატია</ThemedText>
            <View style={{ gap: Spacing.md }}>
              {rest.map((a) => (
                <ArticleCover key={a.id} article={a} variant="row" />
              ))}
            </View>
          </View>
        )}

        {!isLoading && articles.length === 0 && !hero && (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyTitle}>
              სტატია ვერ მოიძებნა
            </ThemedText>
            <ThemedText type="secondary" style={styles.emptyText}>
              სცადე სხვა კატეგორია
            </ThemedText>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  loaderRow: {
    paddingVertical: Spacing.huge,
    alignItems: "center",
  },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: Type.sm,
  },
});
