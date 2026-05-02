import type { Article } from "@/api/types";
import ArticleCover from "@/components/cards/ArticleCover";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function HomeArticles({ articles }: { articles: Article[] }) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (!articles.length) return null;

  return (
    <View style={{ gap: Spacing.md }}>
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>სტატიები</ThemedText>
        <TouchableOpacity
          onPress={() => router.push("/articles")}
          hitSlop={8}
          activeOpacity={0.6}
        >
          <ThemedText style={styles.sectionLink} color={theme.brand}>
            ყველა
          </ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: Spacing.md, paddingRight: Spacing.xl }}
        style={{ marginLeft: -Spacing.xl, paddingLeft: Spacing.xl }}
      >
        {articles.map((a) => (
          <ArticleCover key={a.id} article={a} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  sectionLink: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
