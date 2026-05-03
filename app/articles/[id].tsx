import ArticleBlocks from "@/components/article/ArticleBlocks";
import ArticleHero from "@/components/article/ArticleHero";
import ArticleRelated from "@/components/article/ArticleRelated";
import { ArticleDetailSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useArticleDetail } from "@/hooks/use-article-detail";
import { router, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticleDetail() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const {
    article,
    related,
    isLoading,
    saved,
    isToggling,
    toggleBookmark,
    handleScroll,
  } = useArticleDetail(id);

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.excerpt ?? ""}`.trim(),
      });
    } catch {
      // user cancelled
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.surface }}>
        <ArticleDetailSkeleton />
      </View>
    );
  }

  if (!article) {
    return (
      <SafeAreaView
        style={[styles.notFound, { backgroundColor: theme.surface }]}
      >
        <ThemedText style={styles.notFoundText}>{t("articles.notFoundDetail")}</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText color={theme.brand} style={styles.notFoundLink}>
            {t("recipes.backLink")}
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.huge }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={250}
      >
        <ArticleHero
          article={article}
          saved={saved}
          isToggling={isToggling}
          onToggleSaved={toggleBookmark}
          onShare={handleShare}
        />

        <View style={styles.contentWrap}>
          <ArticleBlocks
            blocks={article.body_blocks ?? []}
            excerpt={article.excerpt}
          />
          <ArticleRelated related={related} />
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
  contentWrap: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
});
