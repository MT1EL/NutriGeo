import ArticleCategoryChips from "@/components/articles/ArticleCategoryChips";
import ArticlesIndexHeader from "@/components/articles/ArticlesIndexHeader";
import FeaturedArticleCard from "@/components/articles/FeaturedArticleCard";
import ArticleCover from "@/components/cards/ArticleCover";
import ScreenError from "@/components/ui/ScreenError";
import {
  ArticleListSkeleton,
  FeaturedArticleSkeleton,
} from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useArticlesList } from "@/hooks/use-articles-list";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

export default function ArticlesIndex() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const {
    activeCat,
    setActiveCat,
    articles,
    categories,
    hero,
    rest,
    isLoading,
    isError,
    refetch,
  } = useArticlesList();

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
          <>
            <FeaturedArticleSkeleton />
            <View style={{ gap: Spacing.sm }}>
              <ThemedText style={styles.sectionTitle}>
                {t("articles.all")}
              </ThemedText>
              <ArticleListSkeleton count={3} />
            </View>
          </>
        ) : null}

        {hero && <FeaturedArticleCard article={hero} />}

        {rest.length > 0 && (
          <View style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.sectionTitle}>
              {t("articles.all")}
            </ThemedText>
            <View style={{ gap: Spacing.md }}>
              {rest.map((a) => (
                <ArticleCover key={a.id} article={a} variant="row" />
              ))}
            </View>
          </View>
        )}

        {!isLoading && isError && articles.length === 0 && (
          <ScreenError onRetry={refetch} style={styles.errorWrap} />
        )}

        {!isLoading && !isError && articles.length === 0 && !hero && (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyTitle}>
              {t("articles.notFound")}
            </ThemedText>
            <ThemedText type="secondary" style={styles.emptyText}>
              {t("articles.tryDifferentCategory")}
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
    paddingTop: 20,
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  errorWrap: {
    paddingVertical: Spacing.huge,
  },
  emptyTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: Type.sm,
  },
});
