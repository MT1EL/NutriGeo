import type { Article } from "@/api/types";
import {
  articleImageSource,
  categoryColor,
} from "@/components/cards/ArticleCover";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Clock } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  article: Article;
};

export default function FeaturedArticleCard({ article }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.sectionTitle}>რჩეული</ThemedText>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => router.push(`/articles/${article.id}`)}
      >
        <BaseCard style={styles.card}>
          <View style={styles.coverWrap}>
            <Image
              source={articleImageSource(article.cover_url)}
              style={styles.cover}
              contentFit="cover"
            />
            {article.category_label && (
              <View
                style={[
                  styles.badge,
                  { backgroundColor: categoryColor(article) + "EE" },
                ]}
              >
                <ThemedText style={styles.badgeText} color="#FFFFFF">
                  {article.category_label}
                </ThemedText>
              </View>
            )}
          </View>
          <View style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.title}>{article.title}</ThemedText>
            {article.excerpt && (
              <ThemedText
                type="secondary"
                style={styles.excerpt}
                numberOfLines={3}
              >
                {article.excerpt}
              </ThemedText>
            )}
            <View style={styles.metaRow}>
              <Clock color={theme.textSecondary} size={12} />
              <ThemedText style={styles.metaText} type="secondary">
                {article.read_min ?? 0} წთ. წაკითხვა
              </ThemedText>
            </View>
          </View>
        </BaseCard>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  card: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  coverWrap: {
    position: "relative",
  },
  cover: {
    width: "100%",
    aspectRatio: 1.7,
    borderRadius: Radius.md,
  },
  badge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  title: {
    fontSize: Type.xxl,
    fontWeight: "700",
  },
  excerpt: {
    fontSize: Type.sm,
    lineHeight: 20,
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
