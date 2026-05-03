import type { Recipe } from "@/api/types";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { recipeImageSource } from "@/utils/image";
import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronLeft, Heart, Share2, Star } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const RECIPE_HERO_HEIGHT = 360;

type Props = {
  recipe: Recipe;
  saved: boolean;
  isToggling: boolean;
  onToggleSaved: () => void;
  onShare: () => void;
};

export default function RecipeHero({
  recipe,
  saved,
  isToggling,
  onToggleSaved,
  onShare,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const dietaryTags = recipe.dietary_tags ?? [];

  return (
    <View style={styles.heroWrap}>
      <Image
        source={recipeImageSource(recipe.cover_url)}
        style={styles.hero}
        contentFit="cover"
      />
      <Canvas
        style={[StyleSheet.absoluteFill, { height: RECIPE_HERO_HEIGHT }]}
        pointerEvents="none"
      >
        <Rect x={0} y={0} width={width} height={RECIPE_HERO_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(0, RECIPE_HERO_HEIGHT)}
            colors={["rgba(0,0,0,0.55)", "rgba(0,0,0,0)", "rgba(0,0,0,0.85)"]}
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
              <Heart
                color={saved ? "#FF4D6D" : "#FFFFFF"}
                size={18}
                fill={saved ? "#FF4D6D" : "transparent"}
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
          {dietaryTags[0] && (
            <View style={[styles.tag, { backgroundColor: theme.brand + "EE" }]}>
              <ThemedText style={styles.tagText} color="#FFFFFF">
                {dietaryTags[0]}
              </ThemedText>
            </View>
          )}
          <ThemedText style={styles.title} color="#FFFFFF" numberOfLines={2}>
            {recipe.title}
          </ThemedText>
          {recipe.rating.rating_count > 0 && (
            <View style={styles.ratingRow}>
              <Star color="#FFB020" size={13} fill="#FFB020" />
              <ThemedText
                style={styles.ratingText}
                color="rgba(255,255,255,0.95)"
              >
                {recipe.rating.avg_rating.toFixed(1)}
              </ThemedText>
              <ThemedText
                style={styles.ratingCount}
                color="rgba(255,255,255,0.7)"
              >
                ({recipe.rating.rating_count} შეფასება)
              </ThemedText>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  heroWrap: {
    height: RECIPE_HERO_HEIGHT,
    width: "100%",
    overflow: "hidden",
  },
  hero: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingBottom: 56,
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
  tag: {
    alignSelf: "flex-start",
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
  title: {
    fontSize: Type.xxl,
    fontWeight: "800",
    lineHeight: 30,
    letterSpacing: 0.2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  ratingCount: {
    fontSize: Type.xs,
    marginLeft: 2,
  },
});
