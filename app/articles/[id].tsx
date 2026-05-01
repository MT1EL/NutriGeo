import ArticleCover from "@/components/cards/ArticleCover";
import ThemedText from "@/components/ui/ThemedText";
import { ARTICLES, ArticleSection, getArticle } from "@/constants/articles";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Canvas,
  LinearGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { Bookmark, ChevronLeft, Clock, Share2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HERO_HEIGHT = 320;

const renderSection = (section: ArticleSection, idx: number, theme: any) => {
  switch (section.type) {
    case "p":
      return (
        <ThemedText key={idx} style={styles.body}>
          {section.text}
        </ThemedText>
      );
    case "h2":
      return (
        <ThemedText key={idx} style={styles.h2}>
          {section.text}
        </ThemedText>
      );
    case "list":
      return (
        <View key={idx} style={styles.list}>
          {section.items.map((item, i) => (
            <View key={i} style={styles.listRow}>
              <View
                style={[styles.bullet, { backgroundColor: theme.brand }]}
              />
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
            {
              backgroundColor: theme.brandSoft,
              borderLeftColor: theme.brand,
            },
          ]}
        >
          <ThemedText style={styles.quoteText} color={theme.brandDeep}>
            {section.text}
          </ThemedText>
        </View>
      );
  }
};

export default function ArticleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [saved, setSaved] = useState(false);
  const article = getArticle(id);

  if (!article) {
    return (
      <SafeAreaView style={[styles.notFound, { backgroundColor: theme.surface }]}>
        <ThemedText style={styles.notFoundText}>სტატია ვერ მოიძებნა</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText color={theme.brand} style={styles.notFoundLink}>
            უკან დაბრუნება
          </ThemedText>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const related = ARTICLES.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: Spacing.huge }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroWrap}>
          <Image
            source={article.cover}
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
                colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
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
                  onPress={() => setSaved((s) => !s)}
                  style={styles.iconBtn}
                  activeOpacity={0.8}
                  hitSlop={6}
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
                >
                  <Share2 color="#FFFFFF" size={18} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.heroBottom}>
              <View
                style={[
                  styles.categoryPill,
                  { backgroundColor: article.categoryColor + "EE" },
                ]}
              >
                <ThemedText
                  style={styles.categoryPillText}
                  color="#FFFFFF"
                >
                  {article.category}
                </ThemedText>
              </View>
              <ThemedText style={styles.title} color="#FFFFFF">
                {article.title}
              </ThemedText>
              <View style={styles.metaRow}>
                <Clock color="rgba(255,255,255,0.85)" size={12} />
                <ThemedText
                  style={styles.metaText}
                  color="rgba(255,255,255,0.85)"
                >
                  {article.readMin} წთ. წაკითხვა · {article.author}
                </ThemedText>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View style={styles.contentWrap}>
          <View style={{ gap: Spacing.md }}>
            {article.body.map((s, i) => renderSection(s, i, theme))}
          </View>

          <View
            style={[
              styles.divider,
              { backgroundColor: theme.borderLight },
            ]}
          />

          <View style={{ gap: Spacing.md }}>
            <ThemedText style={styles.sectionTitle}>მსგავსი სტატიები</ThemedText>
            <View style={{ gap: Spacing.md }}>
              {related.map((a) => (
                <ArticleCover key={a.id} article={a} variant="row" />
              ))}
            </View>
          </View>
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
