import type { Article } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Clock } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const CATEGORY_PALETTE = [
  "#5B6CE0",
  "#7C5CFF",
  "#F5A623",
  "#3FA9F5",
  "#FF6B9D",
  "#34A867",
  "#FF7A45",
  "#E85A8C",
];

function hashedColor(key: string | undefined) {
  if (!key) return CATEGORY_PALETTE[0];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return CATEGORY_PALETTE[Math.abs(hash) % CATEGORY_PALETTE.length];
}

export function categoryColor(
  article: Pick<Article, "category_color" | "category_slug">,
) {
  return article.category_color || hashedColor(article.category_slug);
}

export function articleImageSource(url: string | undefined) {
  return url ? { uri: url } : require("@/assets/images/article_cover.png");
}

type Props = {
  article: Article;
  variant?: "card" | "row";
};

const ArticleCover = ({ article, variant = "card" }: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const navigate = () => router.push(`/articles/${article.id}`);
  const cover = articleImageSource(article.cover_url);
  const color = categoryColor(article);
  const category = article.category_label ?? "";
  const readMin = article.read_min ?? 0;

  if (variant === "row") {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={navigate}>
        <BaseCard style={styles.rowCard}>
          <Image source={cover} style={styles.rowImage} contentFit="cover" />
          <View style={styles.rowContent}>
            {category ? (
              <View
                style={[styles.rowBadge, { backgroundColor: color + "22" }]}
              >
                <ThemedText style={styles.rowBadgeText} color={color}>
                  {category}
                </ThemedText>
              </View>
            ) : null}
            <ThemedText style={styles.rowTitle} numberOfLines={2}>
              {article.title}
            </ThemedText>
            <View style={styles.rowMeta}>
              <Clock color={theme.textSecondary} size={11} />
              <ThemedText style={styles.rowMetaText} type="secondary">
                {t("articles.minutes", { count: readMin })}
              </ThemedText>
            </View>
          </View>
        </BaseCard>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={navigate}>
      <View style={styles.container} onLayout={onLayout}>
        <Image
          source={cover}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {size.w > 0 && size.h > 0 && (
          <View
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
            collapsable={false}
          >
            <Canvas style={StyleSheet.absoluteFill}>
              <Rect x={0} y={0} width={size.w} height={size.h}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, size.h)}
                  colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.75)"]}
                />
              </Rect>
            </Canvas>
          </View>
        )}
        {category ? (
          <View style={[styles.tag, { backgroundColor: color + "EE" }]}>
            <ThemedText style={styles.tagText} color="#FFFFFF">
              {category}
            </ThemedText>
          </View>
        ) : null}
        <View style={styles.titleWrap}>
          <ThemedText style={styles.title} numberOfLines={2} color="#FFFFFF">
            {article.title}
          </ThemedText>
          <View style={styles.meta}>
            <Clock color="rgba(255,255,255,0.85)" size={11} />
            <ThemedText style={styles.metaText} color="rgba(255,255,255,0.85)">
              {t("articles.minutes", { count: readMin })}
            </ThemedText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ArticleCover;
const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 150,
    borderRadius: Radius.lg,
    overflow: "hidden",
    justifyContent: "flex-end",
    padding: Spacing.md,
  },
  tag: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
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
  titleWrap: {
    gap: 4,
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
    lineHeight: 20,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  rowCard: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
  },
  rowImage: {
    width: 88,
    aspectRatio: 1,
    borderRadius: Radius.md,
  },
  rowContent: {
    flex: 1,
    gap: Spacing.xs + 2,
  },
  rowBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  rowBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  rowTitle: {
    fontSize: Type.base,
    fontWeight: "700",
    lineHeight: 20,
  },
  rowMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowMetaText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
});
