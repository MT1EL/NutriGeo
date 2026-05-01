import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Article } from "@/constants/articles";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Canvas,
  LinearGradient,
  Rect,
  vec,
} from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Clock } from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  article: Article;
  variant?: "card" | "row";
};

const ArticleCover = ({ article, variant = "card" }: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const navigate = () => router.push(`/articles/${article.id}`);

  if (variant === "row") {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={navigate}>
        <BaseCard style={styles.rowCard}>
          <Image
            source={article.cover}
            style={styles.rowImage}
            contentFit="cover"
          />
          <View style={styles.rowContent}>
            <View
              style={[
                styles.rowBadge,
                { backgroundColor: article.categoryColor + "22" },
              ]}
            >
              <ThemedText
                style={styles.rowBadgeText}
                color={article.categoryColor}
              >
                {article.category}
              </ThemedText>
            </View>
            <ThemedText style={styles.rowTitle} numberOfLines={2}>
              {article.title}
            </ThemedText>
            <View style={styles.rowMeta}>
              <Clock color={theme.textSecondary} size={11} />
              <ThemedText style={styles.rowMetaText} type="secondary">
                {article.readMin} წთ.
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
          source={article.cover}
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
        <View
          style={[
            styles.tag,
            { backgroundColor: article.categoryColor + "EE" },
          ]}
        >
          <ThemedText style={styles.tagText} color="#FFFFFF">
            {article.category}
          </ThemedText>
        </View>
        <View style={styles.titleWrap}>
          <ThemedText style={styles.title} numberOfLines={2} color="#FFFFFF">
            {article.title}
          </ThemedText>
          <View style={styles.meta}>
            <Clock color="rgba(255,255,255,0.85)" size={11} />
            <ThemedText
              style={styles.metaText}
              color="rgba(255,255,255,0.85)"
            >
              {article.readMin} წთ.
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
