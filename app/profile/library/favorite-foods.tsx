import { getFavoriteFoods, unfavoriteFood } from "@/api/foods";
import type { ApiResponse, Food } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import FoodDetailSheet from "@/components/sheets/FoodDetailSheet";
import { FoodListSkeleton } from "@/components/ui/Skeletons";
import SwipeHint from "@/components/ui/SwipeHint";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { todayISO } from "@/utils/date";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, HeartOff } from "lucide-react-native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function LibraryFavoriteFoodsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["foods", "favorites"],
    queryFn: getFavoriteFoods,
  });

  const [sheetFood, setSheetFood] = useState<Food | null>(null);
  const swipeRefs = useRef(new Map<string, Swipeable>());

  const unfavoriteMutation = useMutation({
    mutationFn: (id: string) => unfavoriteFood(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["foods", "favorites"] });
      const previous = queryClient.getQueryData<ApiResponse<Food[]>>([
        "foods",
        "favorites",
      ]);
      queryClient.setQueryData<ApiResponse<Food[]>>(
        ["foods", "favorites"],
        (old) => {
          const prev = old && Array.isArray(old.data) ? old.data : [];
          return { data: prev.filter((f) => f.id !== id) };
        },
      );
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods", "favorites"] });
    },
    onError: (err, _id, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(["foods", "favorites"], ctx.previous);
      }
      const message = err instanceof Error ? err.message : t("common.errorGeneric");
      toast.error(message, t("common.error"));
    },
  });

  const closeOtherRows = (keepId: string) => {
    swipeRefs.current.forEach((ref, id) => {
      if (id !== keepId) ref?.close();
    });
  };

  const renderRightActions = (food: Food) => (
    <View style={styles.actionsRow}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => unfavoriteMutation.mutate(food.id)}
        style={[styles.actionBtn, { backgroundColor: theme.error + "1A" }]}
      >
        <HeartOff color={theme.error} size={16} />
      </TouchableOpacity>
    </View>
  );

  const foods = data?.data ?? [];

  return (
    <SubScreenLayout
      title={t("library.favoriteFoodsTitle")}
      subtitle={t("library.foodsCount", { count: foods.length })}
    >
      {isLoading ? (
        <FoodListSkeleton count={4} />
      ) : foods.length === 0 ? (
        <View style={styles.empty}>
          <View style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}>
            <Heart color={theme.brand} size={28} />
          </View>
          <ThemedText style={styles.emptyTitle}>{t("library.empty")}</ThemedText>
          <ThemedText type="secondary" style={styles.emptyText}>
            {t("library.favoriteFoodsEmptyHint")}
          </ThemedText>
        </View>
      ) : (
        <View style={styles.list}>
          <SwipeHint text={t("common.swipeLeftToDelete")} />
          {foods.map((food) => (
            <Swipeable
              key={food.id}
              ref={(ref) => {
                if (ref) swipeRefs.current.set(food.id, ref);
                else swipeRefs.current.delete(food.id);
              }}
              renderRightActions={() => renderRightActions(food)}
              onSwipeableWillOpen={() => closeOtherRows(food.id)}
              overshootRight={false}
              friction={2}
            >
              <FoodCard
                title={food.name}
                calories={caloriesForFood(food)}
                serving={servingLabel(food, t("food.perGramShort"))}
                proteinG={macroForFood(food.protein_g_per_100g, food)}
                carbsG={macroForFood(food.carbs_g_per_100g, food)}
                fatG={macroForFood(food.fat_g_per_100g, food)}
                image={foodImageSource(food.image_url)}
                action="none"
                onPress={() => setSheetFood(food)}
              />
            </Swipeable>
          ))}
        </View>
      )}

      <FoodDetailSheet
        visible={!!sheetFood}
        onClose={() => setSheetFood(null)}
        food={sheetFood}
        defaultMealKey="breakfast"
        todayKey={todayISO()}
        source="favorites"
      />
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    paddingLeft: Spacing.sm,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    alignItems: "center",
    paddingVertical: Spacing.huge,
    gap: Spacing.sm,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  emptyText: {
    fontSize: Type.sm,
    textAlign: "center",
    paddingHorizontal: Spacing.xl,
  },
});
