import type { Article } from "@/api/types";
import {
  articleImageSource,
  categoryColor,
} from "@/components/cards/ArticleCover";
import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Bookmark, ChevronLeft, Clock, Share2 } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ARTICLE_HERO_HEIGHT = 320;

type Props = {
  article: Article;
  saved: boolean;
  isToggling: boolean;
  onToggleSaved: () => void;
  onShare: () => void;
};

export default function ArticleHero({
  article,
  saved,
  isToggling,
  onToggleSaved,
  onShare,
}: Props) {
  const color = categoryColor(article);

  return (
    <View style={styles.heroWrap}>
      <Image
        source={articleImageSource(article.cover_url)}
        style={styles.hero}
        contentFit="cover"
      />
      <Canvas
        style={[StyleSheet.absoluteFill, { height: ARTICLE_HERO_HEIGHT }]}
        pointerEvents="none"
      >
        <Rect x={0} y={0} width={500} height={ARTICLE_HERO_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, ARTICLE_HERO_HEIGHT)}
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
              onPress={onToggleSaved}
              style={styles.iconBtn}
              activeOpacity={0.8}
              hitSlop={6}
              disabled={isToggling}
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
              onPress={onShare}
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
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    height: ARTICLE_HERO_HEIGHT,
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
});
