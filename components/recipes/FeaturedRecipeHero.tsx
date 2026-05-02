import type { Recipe } from "@/api/types";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { foodImageSource } from "@/utils/image";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Clock, Flame, Star, Users } from "lucide-react-native";
import { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  recipe: Recipe;
};

export default function FeaturedRecipeHero({ recipe }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  const tagLabel = recipe.dietary_tags?.[0];

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => router.push(`/recipes/${recipe.id}`)}
    >
      <View style={styles.hero} onLayout={onLayout}>
        <Image
          source={foodImageSource(recipe.cover_url)}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {size.w > 0 && size.h > 0 && (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <Canvas style={StyleSheet.absoluteFill}>
              <Rect x={0} y={0} width={size.w} height={size.h}>
                <LinearGradient
                  start={vec(0, 0)}
                  end={vec(0, size.h)}
                  colors={[
                    "rgba(0,0,0,0.45)",
                    "rgba(0,0,0,0)",
                    "rgba(0,0,0,0.85)",
                  ]}
                />
              </Rect>
            </Canvas>
          </View>
        )}

        <View style={styles.topRow}>
          <View style={[styles.featured, { backgroundColor: theme.brand }]}>
            <Star color="#FFFFFF" size={11} fill="#FFFFFF" />
            <ThemedText style={styles.featuredText} color="#FFFFFF">
              კვირის რჩეული
            </ThemedText>
          </View>
          {tagLabel && (
            <View
              style={[styles.tag, { backgroundColor: theme.brand + "EE" }]}
            >
              <ThemedText style={styles.tagText} color="#FFFFFF">
                {tagLabel}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={styles.bottom}>
          <ThemedText style={styles.title} color="#FFFFFF" numberOfLines={2}>
            {recipe.title}
          </ThemedText>
          {recipe.description && (
            <ThemedText
              style={styles.desc}
              color="rgba(255,255,255,0.85)"
              numberOfLines={2}
            >
              {recipe.description}
            </ThemedText>
          )}
          <View style={styles.metaRow}>
            <View style={styles.meta}>
              <Flame color="#FFFFFF" size={12} />
              <ThemedText style={styles.metaText} color="#FFFFFF">
                {recipe.kcal} კალ
              </ThemedText>
            </View>
            <View style={styles.meta}>
              <Clock color="#FFFFFF" size={12} />
              <ThemedText style={styles.metaText} color="#FFFFFF">
                {recipe.duration_min} წთ
              </ThemedText>
            </View>
            <View style={styles.meta}>
              <Users color="#FFFFFF" size={12} />
              <ThemedText style={styles.metaText} color="#FFFFFF">
                {recipe.servings} პორცია
              </ThemedText>
            </View>
            {recipe.rating.rating_count > 0 && (
              <View style={styles.meta}>
                <Star color="#FFB020" size={12} fill="#FFB020" />
                <ThemedText style={styles.metaText} color="#FFFFFF">
                  {recipe.rating.avg_rating.toFixed(1)}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  hero: {
    width: "100%",
    height: 240,
    borderRadius: Radius.xl,
    overflow: "hidden",
    justifyContent: "space-between",
    padding: Spacing.lg,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featured: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  featuredText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  bottom: {
    gap: 6,
  },
  title: {
    fontSize: Type.xxl,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  desc: {
    fontSize: Type.sm,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
});
