import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ChartNoAxesColumnIncreasingIcon,
  Clock,
  Heart,
  LucideIcon,
  Users,
} from "lucide-react-native";
import { useState } from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

type Tag = {
  label: string;
  color: string;
  Icon?: LucideIcon;
};

type Props = {
  id?: string;
  title?: string;
  description?: string;
  calories?: number;
  durationMin?: number;
  servings?: number;
  difficulty?: string;
  image?: ImageSourcePropType;
  tag?: Tag;
  hero?: boolean;
  initiallySaved?: boolean;
};

const RecipeCard = ({
  id,
  title = "ჩიზქეიქი",
  description = "იტალიური დესერტი მდიდრული გემოვნებით",
  calories = 321,
  durationMin = 45,
  servings = 1,
  difficulty = "საშუალო",
  image,
  tag,
  hero = false,
  initiallySaved = false,
}: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [saved, setSaved] = useState(initiallySaved);

  const stats = [
    { Icon: Clock, label: `${durationMin} წთ.` },
    { Icon: Users, label: `${servings} პორცია` },
    { Icon: ChartNoAxesColumnIncreasingIcon, label: difficulty },
  ];

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => id && router.push(`/recipes/${id}`)}
    >
      <BaseCard style={styles.card}>
        <View style={styles.coverWrap}>
          <Image
            source={image ?? require("@/assets/images/cheesecake.png")}
            style={[styles.cover, hero && styles.coverHero]}
            contentFit="cover"
          />
          {tag && (
            <View style={[styles.tag, { backgroundColor: tag.color + "EE" }]}>
              {tag.Icon && <tag.Icon color="#FFFFFF" size={11} />}
              <ThemedText style={styles.tagText} color="#FFFFFF">
                {tag.label}
              </ThemedText>
            </View>
          )}
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.7}
            onPress={() => setSaved((s) => !s)}
            hitSlop={6}
          >
            <Heart
              color={saved ? "#FF4D6D" : "#FFFFFF"}
              size={18}
              fill={saved ? "#FF4D6D" : "transparent"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
              <ThemedText
                style={[styles.title, hero && styles.titleHero]}
                numberOfLines={1}
              >
                {title}
              </ThemedText>
              <View
                style={[styles.calBadge, { backgroundColor: theme.brandSoft }]}
              >
                <ThemedText style={styles.calBadgeText} color={theme.brand}>
                  {calories} კალ
                </ThemedText>
              </View>
            </View>
            <ThemedText
              type="secondary"
              style={styles.smallDescription}
              numberOfLines={2}
            >
              {description}
            </ThemedText>
          </View>

          <View style={styles.statsRow}>
            {stats.map(({ Icon, label }) => (
              <View key={label} style={styles.stat}>
                <Icon size={14} color={theme.textSecondary} />
                <ThemedText type="secondary" style={styles.statLabel}>
                  {label}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </BaseCard>
    </TouchableOpacity>
  );
};

export default RecipeCard;
const styles = StyleSheet.create({
  card: {
    gap: Spacing.md,
    padding: Spacing.md,
  },
  coverWrap: {
    position: "relative",
  },
  cover: {
    width: "100%",
    aspectRatio: 2.4,
    borderRadius: Radius.md,
  },
  coverHero: {
    aspectRatio: 1.7,
  },
  tag: {
    position: "absolute",
    top: Spacing.sm,
    left: Spacing.sm,
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
  saveBtn: {
    position: "absolute",
    top: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  headerContainer: {
    gap: Spacing.xs + 2,
  },
  titleRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
    flex: 1,
  },
  titleHero: {
    fontSize: Type.xxl,
  },
  calBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.pill,
  },
  calBadgeText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  smallDescription: {
    fontSize: Type.sm,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.lg,
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    gap: Spacing.xs + 2,
    alignItems: "center",
  },
  statLabel: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
});
