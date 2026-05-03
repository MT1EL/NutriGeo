import { getBookmarkedArticles, unbookmarkArticle } from "@/api/articles";
import type { ApiResponse, Article } from "@/api/types";
import ArticleCover from "@/components/cards/ArticleCover";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { ArticleListSkeleton } from "@/components/ui/Skeletons";
import SwipeHint from "@/components/ui/SwipeHint";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bookmark, BookmarkX } from "lucide-react-native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function LibraryArticlesScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["bookmarks", "articles"],
    queryFn: getBookmarkedArticles,
  });

  const swipeRefs = useRef(new Map<string, Swipeable>());

  const unbookmarkMutation = useMutation({
    mutationFn: (id: string) => unbookmarkArticle(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["bookmarks", "articles"] });
      const previous = queryClient.getQueryData<ApiResponse<Article[]>>([
        "bookmarks",
        "articles",
      ]);
      queryClient.setQueryData<ApiResponse<Article[]>>(
        ["bookmarks", "articles"],
        (old) => {
          const prev = old && Array.isArray(old.data) ? old.data : [];
          return { data: prev.filter((a) => a.id !== id) };
        },
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks", "articles"] });
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["bookmarks", "articles"], ctx.previous);
      }
      const message = err instanceof Error ? err.message : t("common.errorGeneric");
      toast.error(message, t("common.error"));
    },
  });

  const closeOtherRows = (keepId: string) => {
    swipeRefs.current.forEach((ref, id) => {
      if (id !== keepId) ref?.close();
    });
  };

  const renderRightActions = (article: Article) => (
    <View style={styles.actionsRow}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => unbookmarkMutation.mutate(article.id)}
        style={[styles.actionBtn, { backgroundColor: theme.error + "1A" }]}
      >
        <BookmarkX color={theme.error} size={16} />
      </TouchableOpacity>
    </View>
  );

  const articles = data?.data ?? [];

  return (
    <SubScreenLayout
      title={t("library.articlesTitle")}
      subtitle={t("library.articlesCount", { count: articles.length })}
    >
      {isLoading ? (
        <ArticleListSkeleton count={4} />
      ) : articles.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}>
            <Bookmark color={theme.brand} size={28} />
          </View>
          <ThemedText style={styles.emptyTitle}>{t("library.empty")}</ThemedText>
          <ThemedText type="secondary" style={styles.emptyText}>
            {t("library.articlesEmptyHint")}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          <SwipeHint text={t("common.swipeLeftToDelete")} />
          {articles.map((a) => (
            <Swipeable
              key={a.id}
              ref={(ref) => {
                if (ref) swipeRefs.current.set(a.id, ref);
                else swipeRefs.current.delete(a.id);
              }}
              renderRightActions={() => renderRightActions(a)}
              onSwipeableWillOpen={() => closeOtherRows(a.id)}
              overshootRight={false}
              friction={2}
            >
              <ArticleCover article={a} variant="row" />
            </Swipeable>
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
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    justifyContent: "center",
    alignItems: "center",
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
