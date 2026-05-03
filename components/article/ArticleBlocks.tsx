import type { ArticleBlock } from "@/api/types";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  blocks: ArticleBlock[];
  excerpt?: string;
};

export default function ArticleBlocks({ blocks, excerpt }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (blocks.length === 0 && !excerpt) {
    return (
      <ThemedText style={styles.body} type="secondary">
        {t("articles.noBody")}
      </ThemedText>
    );
  }

  return (
    <View style={{ gap: Spacing.md }}>
      {excerpt && (
        <ThemedText style={styles.lead} type="secondary">
          {excerpt}
        </ThemedText>
      )}
      {blocks.map((block, idx) => {
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
                {/* Use theme.text not brandDeep — brandDeep is dark blue and
                    becomes unreadable on dark mode's brandSoft. */}
                <ThemedText style={styles.quoteText} color={theme.text}>
                  {block.text}
                </ThemedText>
              </View>
            );
        }
      })}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
