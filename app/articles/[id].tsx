import {
  bookmarkArticle,
  getArticleById,
  getRelatedArticles,
  recordArticleRead,
  unbookmarkArticle,
} from "@/api/articles";
import type { Article, ArticleBlock } from "@/api/types";
import ArticleCover, {
  articleImageSource,
  categoryColor,
} from "@/components/cards/ArticleCover";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Bookmark, ChevronLeft, Clock, Share2 } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HERO_HEIGHT = 320;

type Theme = (typeof Colors)["light"];

function renderBlock(block: ArticleBlock, idx: number, theme: Theme) {
  switch (block.type) {
    case "p":
      return (
        <ThemedText key={idx} style={styles.body}>
          {block.text}
        </ThemedText>
      );
    case "h2":
      return (
        <ThemedText key={idx} style={styles.h2}>
          {block.text}
        </ThemedText>
      );
    case "list":
      return (
        <View key={idx} style={styles.list}>
          {block.items.map((item, i) => (
            <View key={i} style={styles.listRow}>
              <View style={[styles.bullet, { backgroundColor: theme.brand }]} />
              <ThemedText style={styles.listItem}>{item}</ThemedText>
            </View>
          ))}
        </View>
      );
    case "quote":
      return (
        <View
          key={idx}
          style={[
            styles.quote,
            { backgroundColor: theme.brandSoft, borderLeftColor: theme.brand },
          ]}
        >
          <ThemedText style={styles.quoteText} color={theme.brandDeep}>
            {block.text}
          </ThemedText>
        </View>
      );
  }
}

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();
  const articleQuery = useQuery({
    queryKey: ["articles", "detail", id],
    queryFn: () => getArticleById(id!),
    enabled: !!id,
  });
  const relatedQuery = useQuery({
    queryKey: ["articles", "related", id],
    queryFn: () => getRelatedArticles(id!, 3),
    enabled: !!id,
  });

  const article = articleQuery.data?.data;
  const related: Article[] = useMemo(() => {
    const raw = relatedQuery.data?.data;
    return Array.isArray(raw) ? raw : [];
  }, [relatedQuery.data]);

  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const saved = savedOverride !== null ? savedOverride : !!article?.bookmarked;

  const bookmarkMutation = useMutation({
    mutationFn: ({ next }: { next: boolean }) =>
      next ? bookmarkArticle(id!) : unbookmarkArticle(id!),
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
      queryClient.invalidateQueries({ queryKey: ["articles", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["articles", "bookmarked"] });
    },
  });

  const readMutation = useMutation({
    mutationFn: (pct: number) => recordArticleRead(id!, pct),
  });

  const reportedPctRef = useRef(0);
  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!id) return;
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const total = contentSize.height - layoutMeasurement.height;
    if (total <= 0) return;
    const pct = Math.min(
      100,
      Math.max(0, Math.round(((contentOffset.y || 0) / total) * 100)),
    );
    if (pct >= reportedPctRef.current + 25) {
      reportedPctRef.current = pct;
      readMutation.mutate(pct);
    }
  };

  useEffect(() => {
    reportedPctRef.current = article?.read_pct ?? 0;
  }, [id, article?.read_pct]);

  const handleShare = async () => {
    if (!article) return;
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.excerpt ?? ""}`.trim(),
      });
    } catch {
      // user cancelled or share failed silently
    }
  };

  if (articleQuery.isLoading) {
    return (
      <SafeAreaView
        style={[styles.notFound, { backgroundColor: theme.surface }]}
      >
        <ActivityIndicator color={theme.brand} />
      </SafeAreaView>
    );
  }

  if (!article) {
    return (
      <SafeAreaView
        style={[styles.notFound, { backgroundColor: theme.surface }]}
      >
        <ThemedText style={styles.notFoundText}>სტატია ვერ მოიძებნა</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText color={theme.brand} style={styles.notFoundLink}>
            უკან დაბრუნება
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const blocks = article.body_blocks ?? [];
  const color = categoryColor(article);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.huge }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={250}
      >
        <View style={styles.heroWrap}>
          <Image
            source={articleImageSource(article.cover_url)}
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
                  "rgba(0,0,0,0.7)",
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
                  onPress={() => bookmarkMutation.mutate({ next: !saved })}
                  style={styles.iconBtn}
                  activeOpacity={0.8}
                  hitSlop={6}
                  disabled={bookmarkMutation.isPending}
                >
                  <Bookmark
                    color="#FFFFFF"
                    size={18}
                    fill={saved ? "#FFFFFF" : "transparent"}
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
              {article.category_label ? (
                <View
                  style={[
                    styles.categoryPill,
                    { backgroundColor: color + "EE" },
                  ]}
                >
                  <ThemedText style={styles.categoryPillText} color="#FFFFFF">
                    {article.category_label}
                  </ThemedText>
                </View>
              ) : null}
              <ThemedText style={styles.title} color="#FFFFFF">
                {article.title}
              </ThemedText>
              <View style={styles.metaRow}>
                <Clock color="rgba(255,255,255,0.85)" size={12} />
                <ThemedText
                  style={styles.metaText}
                  color="rgba(255,255,255,0.85)"
                >
                  {article.read_min ?? 0} წთ. წაკითხვა · {article.author.name}
                </ThemedText>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentWrap}>
          <View style={{ gap: Spacing.md }}>
            {article.excerpt && (
              <ThemedText style={styles.lead} type="secondary">
                {article.excerpt}
              </ThemedText>
            )}
            {blocks.map((b, i) => renderBlock(b, i, theme))}
            {blocks.length === 0 && !article.excerpt && (
              <ThemedText style={styles.body} type="secondary">
                სტატიის ტექსტი ჯერ არ არის ხელმისაწვდომი.
              </ThemedText>
            )}
          </View>

          {related.length > 0 && (
            <>
              <View
                style={[styles.divider, { backgroundColor: theme.borderLight }]}
              />
              <View style={{ gap: Spacing.md }}>
                <ThemedText style={styles.sectionTitle}>
                  მსგავსი სტატიები
                </ThemedText>
                <View style={{ gap: Spacing.md }}>
                  {related.map((a) => (
                    <ArticleCover key={a.id} article={a} variant="row" />
                  ))}
                </View>
              </View>
            </>
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
    paddingBottom: Spacing.xl,
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
  categoryPill: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: Type.xxxl,
    fontWeight: "700",
    lineHeight: 38,
    letterSpacing: 0.2,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
  },
  metaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  contentWrap: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  lead: {
    fontSize: Type.lg,
    lineHeight: 26,
    fontWeight: "600",
  },
  body: {
    fontSize: Type.base,
    lineHeight: 24,
  },
  h2: {
    fontSize: Type.xl,
    fontWeight: "700",
    marginTop: Spacing.sm,
  },
  list: {
    gap: Spacing.sm,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 9,
  },
  listItem: {
    flex: 1,
    fontSize: Type.base,
    lineHeight: 22,
  },
  quote: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.lg,
    borderLeftWidth: 3,
  },
  quoteText: {
    fontSize: Type.base,
    fontWeight: "600",
    lineHeight: 22,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
