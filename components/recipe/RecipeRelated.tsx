import type { Recipe } from "@/api/types";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { recipeImageSource } from "@/utils/image";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Flame } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  related: Recipe[];
};

export default function RecipeRelated({ related }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (related.length === 0) return null;

  return (
    <View style={{ gap: Spacing.md }}>
      <ThemedText style={styles.sectionTitle}>{t("recipes.relatedSingle")}</ThemedText>
      <View style={{ gap: Spacing.md }}>
        {related.map((r) => (
          <TouchableOpacity
            key={r.id}
            activeOpacity={0.85}
            onPress={() => router.push(`/recipes/${r.id}`)}
          >
            <BaseCard style={styles.card}>
              <Image
                source={recipeImageSource(r.cover_url)}
                style={styles.image}
                contentFit="cover"
              />
              <View style={{ flex: 1, gap: 4 }}>
                <ThemedText style={styles.title} numberOfLines={1}>
                  {r.title}
                </ThemedText>
                <View style={styles.meta}>
                  <Flame color={theme.textSecondary} size={11} />
                  <ThemedText style={styles.metaText} type="secondary">
                    {r.kcal} {t("macros.kcalShort")} · {r.duration_min} {t("recipes.minShort")}
                  </ThemedText>
                </View>
              </View>
            </BaseCard>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  card: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
  },
  image: {
    width: 64,
    aspectRatio: 1,
    borderRadius: Radius.md,
  },
  title: {
    fontSize: Type.base,
    fontWeight: "700",
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
});
