import type { Article } from "@/api/types";
import ArticleCover from "@/components/cards/ArticleCover";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  related: Article[];
};

export default function ArticleRelated({ related }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (related.length === 0) return null;

  return (
    <>
      <View style={[styles.divider, { backgroundColor: theme.borderLight }]} />
      <View style={{ gap: Spacing.md }}>
        <ThemedText style={styles.sectionTitle}>{t("articles.related")}</ThemedText>
        <View style={{ gap: Spacing.md }}>
          {related.map((a) => (
            <ArticleCover key={a.id} article={a} variant="row" />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
