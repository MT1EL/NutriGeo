import BaseCard from "@/components/cards/BaseCard";
import Skeleton from "@/components/ui/Skeleton";
import { Radius, Spacing } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export const RecipeCardSkeleton = () => (
  <BaseCard style={styles.recipeCard}>
    <Skeleton height={150} radius={Radius.md} />
    <View style={styles.recipeContent}>
      <View style={styles.recipeTitleRow}>
        <Skeleton width={"55%"} height={18} />
        <Skeleton width={64} height={20} radius={Radius.pill} />
      </View>
      <Skeleton width={"90%"} height={12} />
      <Skeleton width={"75%"} height={12} />
      <View style={styles.recipeStats}>
        <Skeleton width={50} height={12} />
        <Skeleton width={60} height={12} />
        <Skeleton width={70} height={12} />
      </View>
    </View>
  </BaseCard>
);

export const FoodCardSkeleton = () => (
  <BaseCard style={styles.foodCard}>
    <Skeleton width={56} height={56} radius={Radius.md} />
    <View style={styles.foodContent}>
      <View style={styles.foodTitleRow}>
        <Skeleton width={"55%"} height={14} />
        <Skeleton width={56} height={16} radius={Radius.pill} />
      </View>
      <Skeleton width={"40%"} height={10} />
      <View style={styles.foodMacros}>
        <Skeleton width={48} height={10} />
        <Skeleton width={48} height={10} />
        <Skeleton width={48} height={10} />
      </View>
    </View>
    <Skeleton width={36} height={36} radius={Radius.pill} />
  </BaseCard>
);

export const ArticleRowSkeleton = () => (
  <BaseCard style={styles.articleRowCard}>
    <Skeleton width={88} height={88} radius={Radius.md} />
    <View style={styles.articleRowContent}>
      <Skeleton width={70} height={14} radius={Radius.pill} />
      <Skeleton width={"95%"} height={14} />
      <Skeleton width={"70%"} height={14} />
      <Skeleton width={50} height={11} />
    </View>
  </BaseCard>
);

export const FeaturedArticleSkeleton = () => (
  <View style={styles.featuredArticle}>
    <Skeleton height={200} radius={Radius.lg} />
  </View>
);

type SectionListProps = { count?: number };

export const RecipeListSkeleton = ({ count = 3 }: SectionListProps) => (
  <View style={styles.list}>
    {Array.from({ length: count }).map((_, i) => (
      <RecipeCardSkeleton key={i} />
    ))}
  </View>
);

export const FoodListSkeleton = ({ count = 4 }: SectionListProps) => (
  <View style={styles.foodList}>
    {Array.from({ length: count }).map((_, i) => (
      <FoodCardSkeleton key={i} />
    ))}
  </View>
);

export const ArticleListSkeleton = ({ count = 3 }: SectionListProps) => (
  <View style={styles.foodList}>
    {Array.from({ length: count }).map((_, i) => (
      <ArticleRowSkeleton key={i} />
    ))}
  </View>
);

export const RecipeDetailSkeleton = () => (
  <View style={styles.detail}>
    <Skeleton height={280} radius={0} />
    <View style={styles.detailBody}>
      <Skeleton width={"75%"} height={26} />
      <Skeleton width={"95%"} height={14} />
      <Skeleton width={"60%"} height={14} />
      <View style={styles.detailRow}>
        <Skeleton width={70} height={20} radius={Radius.pill} />
        <Skeleton width={70} height={20} radius={Radius.pill} />
        <Skeleton width={70} height={20} radius={Radius.pill} />
      </View>
      <BaseCard style={styles.detailCard}>
        <Skeleton width={120} height={16} />
        <Skeleton width={"100%"} height={12} />
        <Skeleton width={"90%"} height={12} />
        <Skeleton width={"80%"} height={12} />
      </BaseCard>
      <BaseCard style={styles.detailCard}>
        <Skeleton width={140} height={16} />
        <Skeleton width={"100%"} height={12} />
        <Skeleton width={"95%"} height={12} />
        <Skeleton width={"85%"} height={12} />
        <Skeleton width={"70%"} height={12} />
      </BaseCard>
    </View>
  </View>
);

export const ArticleDetailSkeleton = () => (
  <View style={styles.detail}>
    <Skeleton height={260} radius={0} />
    <View style={styles.detailBody}>
      <Skeleton width={80} height={18} radius={Radius.pill} />
      <Skeleton width={"90%"} height={26} />
      <Skeleton width={"70%"} height={26} />
      <View style={styles.detailRow}>
        <Skeleton width={100} height={12} />
        <Skeleton width={80} height={12} />
      </View>
      <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
        <Skeleton width={"100%"} height={12} />
        <Skeleton width={"95%"} height={12} />
        <Skeleton width={"100%"} height={12} />
        <Skeleton width={"85%"} height={12} />
      </View>
      <View style={{ gap: Spacing.sm, marginTop: Spacing.md }}>
        <Skeleton width={"100%"} height={12} />
        <Skeleton width={"90%"} height={12} />
        <Skeleton width={"95%"} height={12} />
      </View>
    </View>
  </View>
);

export const PersonalFormSkeleton = () => (
  <View style={styles.form}>
    <View style={styles.formRow}>
      <Skeleton height={48} radius={Radius.pill} style={{ flex: 1 }} />
      <Skeleton height={48} radius={Radius.pill} style={{ flex: 1 }} />
    </View>
    <View style={styles.formGroup}>
      <Skeleton width={140} height={11} />
      <Skeleton height={56} radius={Radius.lg} />
      <Skeleton height={56} radius={Radius.lg} />
      <View style={styles.formRow}>
        <Skeleton height={56} radius={Radius.lg} style={{ flex: 1 }} />
        <Skeleton height={56} radius={Radius.lg} style={{ flex: 1 }} />
      </View>
    </View>
    <View style={styles.formGroup}>
      <Skeleton width={100} height={11} />
      <Skeleton height={56} radius={Radius.lg} />
    </View>
    <Skeleton height={48} radius={Radius.pill} />
  </View>
);

export const HomeSkeleton = () => (
  <View style={styles.home}>
    <Skeleton height={220} radius={0} />
    <View style={styles.homeBody}>
      <BaseCard style={styles.detailCard}>
        <Skeleton width={"40%"} height={16} />
        <Skeleton height={120} radius={Radius.md} />
        <View style={styles.detailRow}>
          <Skeleton width={"30%"} height={12} />
          <Skeleton width={"30%"} height={12} />
          <Skeleton width={"30%"} height={12} />
        </View>
      </BaseCard>
      <BaseCard style={styles.detailCard}>
        <Skeleton width={"50%"} height={16} />
        <Skeleton height={56} radius={Radius.md} />
        <Skeleton height={56} radius={Radius.md} />
        <Skeleton height={56} radius={Radius.md} />
      </BaseCard>
    </View>
  </View>
);

export const StatisticsSkeleton = () => (
  <View style={styles.stats}>
    <View style={styles.statsRow}>
      <Skeleton height={88} radius={Radius.lg} style={{ flex: 1 }} />
      <Skeleton height={88} radius={Radius.lg} style={{ flex: 1 }} />
    </View>
    <BaseCard style={styles.detailCard}>
      <Skeleton width={"50%"} height={16} />
      <Skeleton height={140} radius={Radius.md} />
    </BaseCard>
    <BaseCard style={styles.detailCard}>
      <Skeleton width={"40%"} height={16} />
      <Skeleton height={140} radius={Radius.md} />
    </BaseCard>
    <BaseCard style={styles.detailCard}>
      <Skeleton width={"60%"} height={16} />
      <Skeleton height={120} radius={Radius.md} />
    </BaseCard>
  </View>
);

const styles = StyleSheet.create({
  recipeCard: {
    gap: Spacing.md,
    padding: Spacing.md,
  },
  recipeContent: {
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  recipeTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  recipeStats: {
    flexDirection: "row",
    gap: Spacing.lg,
    marginTop: Spacing.xs,
  },
  foodCard: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
  },
  foodContent: {
    flex: 1,
    gap: Spacing.xs + 2,
  },
  foodTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: Spacing.sm,
  },
  foodMacros: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  articleRowCard: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
  },
  articleRowContent: {
    flex: 1,
    gap: Spacing.xs + 2,
  },
  featuredArticle: {
    width: "100%",
  },
  list: {
    gap: Spacing.md,
  },
  foodList: {
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  detail: {
    gap: 0,
  },
  detailBody: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  detailCard: {
    gap: Spacing.md,
  },
  form: {
    gap: Spacing.lg,
  },
  formGroup: {
    gap: Spacing.md,
  },
  formRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  home: {
    gap: 0,
  },
  homeBody: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xxl,
    marginTop: -Spacing.lg,
  },
  stats: {
    gap: Spacing.lg,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});
