import { deleteCustomFood, getMyFoods } from "@/api/foods";
import type { Food } from "@/api/types";
import FoodCard from "@/components/cards/FoodCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import CustomFoodSheet from "@/components/sheets/CustomFoodSheet";
import Button from "@/components/ui/Button";
import ScreenError from "@/components/ui/ScreenError";
import { FoodListSkeleton } from "@/components/ui/Skeletons";
import SwipeHint from "@/components/ui/SwipeHint";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { caloriesForFood, macroForFood, servingLabel } from "@/utils/foodMath";
import { foodImageSource } from "@/utils/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChefHat, Pencil, Trash2 } from "lucide-react-native";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

export default function LibraryMyFoodsScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["foods", "mine"],
    queryFn: getMyFoods,
  });

  const [editingFood, setEditingFood] = useState<Food | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  // Track all open swipe rows so we can close the others when one opens.
  const swipeRefs = useRef(new Map<string, Swipeable>());

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCustomFood(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods", "all"] });
      queryClient.invalidateQueries({ queryKey: ["foods", "recent"] });
      queryClient.invalidateQueries({ queryKey: ["foods", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["foods", "search"] });
      queryClient.invalidateQueries({ queryKey: ["foods", "favorites"] });
      toast.success(t("food.deleted"));
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : t("food.deleteFailed");
      toast.error(message, t("common.error"));
    },
  });

  const closeRow = (id: string) => {
    swipeRefs.current.get(id)?.close();
  };

  const closeOtherRows = (keepId: string) => {
    swipeRefs.current.forEach((ref, id) => {
      if (id !== keepId) ref?.close();
    });
  };

  const handleEdit = (food: Food) => {
    closeRow(food.id);
    setEditingFood(food);
  };

  const handleDelete = (food: Food) => {
    Alert.alert(
      t("food.deleteConfirm"),
      t("food.deleteIrreversible", { name: food.name }),
      [
      { text: t("common.cancel"), style: "cancel", onPress: () => closeRow(food.id) },
      {
        text: t("common.delete"),
        style: "destructive",
        onPress: () => {
          closeRow(food.id);
          deleteMutation.mutate(food.id);
        },
      },
    ],
    );
  };

  const renderRightActions = (food: Food) => (
    <View style={styles.actionsRow}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleEdit(food)}
        style={[styles.actionBtn, { backgroundColor: theme.brandSoft }]}
      >
        <Pencil color={theme.brand} size={16} />
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleDelete(food)}
        style={[styles.actionBtn, { backgroundColor: theme.error + "1A" }]}
      >
        <Trash2 color={theme.error} size={16} />
      </TouchableOpacity>
    </View>
  );

  const foods = data?.data ?? [];

  return (
    <SubScreenLayout
      title={t("library.myFoodsTitle")}
      subtitle={t("library.foodsCount", { count: foods.length })}
    >
      {isLoading ? (
        <FoodListSkeleton count={3} />
      ) : isError && foods.length === 0 ? (
        <ScreenError onRetry={() => void refetch()} style={styles.errorWrap} />
      ) : foods.length === 0 ? (
        <View style={styles.empty}>
          <View
            style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}
          >
            <ChefHat color={theme.brand} size={28} />
          </View>
          <ThemedText style={styles.emptyTitle}>{t("library.empty")}</ThemedText>
          <ThemedText type="secondary" style={styles.emptyText}>
            {t("library.myFoodsEmptyHint")}
          </ThemedText>
          <View style={styles.emptyAction}>
            <Button onPress={() => setCreateOpen(true)} variant="secondary">
              {t("library.createNew")}
            </Button>
          </View>
        </View>
      ) : (
        <View style={styles.list}>
          <SwipeHint />
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
              />
            </Swipeable>
          ))}
          <View style={styles.createWrap}>
            <Button onPress={() => setCreateOpen(true)} variant="secondary">
              {t("library.createNew")}
            </Button>
          </View>
        </View>
      )}

      <CustomFoodSheet
        visible={createOpen || !!editingFood}
        editingFood={editingFood}
        onClose={() => {
          setCreateOpen(false);
          setEditingFood(null);
        }}
      />
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
  },
  createWrap: {
    marginTop: Spacing.sm,
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
  emptyAction: {
    marginTop: Spacing.lg,
    width: "100%",
    paddingHorizontal: Spacing.xl,
  },
  errorWrap: {
    paddingVertical: Spacing.huge,
  },
});
