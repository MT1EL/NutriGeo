import ArticleCover from "@/components/cards/ArticleCover";
import BaseCard from "@/components/cards/BaseCard";
import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { ARTICLES } from "@/constants/articles";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ChevronLeft, Clock } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticlesIndex() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [activeCat, setActiveCat] = useState<string>("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    ARTICLES.forEach((a) => set.add(a.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    if (activeCat === "all") return ARTICLES;
    return ARTICLES.filter((a) => a.category === activeCat);
  }, [activeCat]);

  const [hero, ...rest] = filtered;

  return (
    <ScrollView
      style={{ backgroundColor: theme.surface }}
      contentContainerStyle={{ paddingBottom: Spacing.huge }}
      showsVerticalScrollIndicator={false}
    >
      <GradientView
        colors={[theme.brandDeep, theme.brand]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        borderRadius={Radius.xl}
        style={styles.headerContainer}
      >
        <SafeAreaView edges={["top"]} style={styles.headerSafe}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={8}
              style={styles.iconBtn}
              activeOpacity={0.8}
            >
              <ChevronLeft color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle} color="#FFFFFF">
              სტატიები
            </ThemedText>
            <View style={styles.iconBtn} />
          </View>
          <ThemedText
            style={styles.headerSubtitle}
            color="rgba(255,255,255,0.85)"
          >
            ნუტრიციის გზამკვლევი ყოველდღიური არჩევანისთვის
          </ThemedText>
        </SafeAreaView>
      </GradientView>

      <View style={styles.body}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
          style={{ marginHorizontal: -Spacing.xl, paddingHorizontal: Spacing.xl }}
        >
          {categories.map((c) => {
            const isActive = c === activeCat;
            const label = c === "all" ? "ყველა" : c;
            return (
              <TouchableOpacity
                key={c}
                onPress={() => setActiveCat(c)}
                activeOpacity={0.85}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive ? theme.brand : theme.card,
                    borderColor: isActive ? theme.brand : theme.border,
                  },
                ]}
              >
                <ThemedText
                  style={styles.chipLabel}
                  color={isActive ? "#FFFFFF" : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {hero && (
          <View style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.sectionTitle}>რჩეული</ThemedText>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push(`/articles/${hero.id}`)}
            >
              <BaseCard style={styles.heroCard}>
                <View style={styles.heroCoverWrap}>
                  <Image
                    source={hero.cover}
                    style={styles.heroCover}
                    contentFit="cover"
                  />
                  <View
                    style={[
                      styles.heroBadge,
                      { backgroundColor: hero.categoryColor + "EE" },
                    ]}
                  >
                    <ThemedText style={styles.heroBadgeText} color="#FFFFFF">
                      {hero.category}
                    </ThemedText>
                  </View>
                </View>
                <View style={{ gap: Spacing.sm }}>
                  <ThemedText style={styles.heroTitle}>{hero.title}</ThemedText>
                  <ThemedText
                    type="secondary"
                    style={styles.heroExcerpt}
                    numberOfLines={3}
                  >
                    {hero.excerpt}
                  </ThemedText>
                  <View style={styles.metaRow}>
                    <Clock color={theme.textSecondary} size={12} />
                    <ThemedText
                      style={styles.metaText}
                      type="secondary"
                    >
                      {hero.readMin} წთ. წაკითხვა · {hero.author}
                    </ThemedText>
                  </View>
                </View>
              </BaseCard>
            </TouchableOpacity>
          </View>
        )}

        {rest.length > 0 && (
          <View style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.sectionTitle}>ყველა სტატია</ThemedText>
            <View style={{ gap: Spacing.md }}>
              {rest.map((a) => (
                <ArticleCover key={a.id} article={a} variant="row" />
              ))}
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: Spacing.xxxl,
  },
  headerSafe: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  headerTitle: {
    fontSize: Type.xl,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: Type.sm,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.lg,
    marginTop: -Spacing.lg,
  },
  chipsRow: {
    gap: Spacing.sm,
    paddingRight: Spacing.xl,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  heroCard: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  heroCoverWrap: {
    position: "relative",
  },
  heroCover: {
    width: "100%",
    aspectRatio: 1.7,
    borderRadius: Radius.md,
  },
  heroBadge: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.pill,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: Type.xxl,
    fontWeight: "700",
  },
  heroExcerpt: {
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
