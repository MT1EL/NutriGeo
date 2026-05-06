import { HttpError } from "@/api/client";
import { getShoppingList } from "@/api/mealPlan";
import type { ShoppingCategory, ShoppingItem } from "@/api/mealPlan";
import BaseCard from "@/components/cards/BaseCard";
import {
  PaywallBlur,
  PaywallBlurOverlay,
} from "@/components/premium/PaywallBlur";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { usePremium } from "@/hooks/use-premium";
import { useQuery } from "@tanstack/react-query";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { Check, ChevronLeft, Copy, Share2 } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingListScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { isPremium } = usePremium();
  const toast = useToast();

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const listQuery = useQuery({
    queryKey: ["meal-plan", "shopping-list"],
    queryFn: () => getShoppingList(),
    enabled: isPremium,
    staleTime: 30 * 60_000,
    retry: (count, err) => !(err instanceof HttpError && err.status === 404),
  });

  const data = listQuery.data?.data;
  const categories: ShoppingCategory[] = data?.categories ?? [];
  const totalItems = data?.total_items ?? 0;
  const noPlan =
    listQuery.error instanceof HttpError && listQuery.error.status === 404;

  const toggle = (item: ShoppingItem) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const buildShareText = () => {
    const lines: string[] = [];
    const weekLabel = data?.week_of ?? formatWeekLabel(new Date());
    lines.push(t("mealPlan.shopping.shareHeader", { week: weekLabel }));
    lines.push("");
    for (const cat of categories) {
      lines.push(`— ${cat.label} —`);
      for (const item of cat.items) {
        lines.push(`• ${item.name} (${item.qty})`);
      }
      lines.push("");
    }
    return lines.join("\n").trim();
  };

  const onShare = async () => {
    try {
      await Share.share({ message: buildShareText() });
    } catch {
      toast.error(t("mealPlan.shopping.shareFailed"), t("common.error"));
    }
  };

  const onCopy = async () => {
    try {
      await Clipboard.setStringAsync(buildShareText());
      toast.success(t("mealPlan.shopping.copied"));
    } catch {
      toast.error(t("mealPlan.shopping.shareFailed"), t("common.error"));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: theme.background }}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: theme.background,
              borderBottomColor: theme.borderLight,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.iconBtn, { backgroundColor: theme.borderLight }]}
            hitSlop={6}
            activeOpacity={0.6}
          >
            <ChevronLeft color={theme.text} size={20} />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {t("mealPlan.shopping.title")}
            </ThemedText>
            <ThemedText style={styles.subtitle} type="secondary">
              {t("mealPlan.shopping.checkedOf", {
                checked: checked.size,
                total: totalItems,
              })}
            </ThemedText>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity
              onPress={onCopy}
              hitSlop={8}
              activeOpacity={0.6}
              style={[styles.iconBtn, { backgroundColor: theme.borderLight }]}
              disabled={!isPremium}
            >
              <Copy color={theme.text} size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onShare}
              hitSlop={8}
              activeOpacity={0.6}
              style={[styles.iconBtn, { backgroundColor: theme.brand }]}
              disabled={!isPremium}
            >
              <Share2 color="#FFFFFF" size={16} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        scrollEnabled={isPremium}
      >
        <PaywallBlur intensity={isPremium ? 0 : 30}>
          <View style={{ gap: Spacing.lg }}>
            {noPlan ? (
              <BaseCard>
                <ThemedText
                  type="secondary"
                  style={{ textAlign: "center" }}
                >
                  {t("mealPlan.shopping.noPlan")}
                </ThemedText>
              </BaseCard>
            ) : listQuery.isLoading ? (
              <BaseCard>
                <ActivityIndicator color={theme.brand} />
              </BaseCard>
            ) : categories.length === 0 ? (
              <BaseCard>
                <ThemedText
                  type="secondary"
                  style={{ textAlign: "center" }}
                >
                  {t("mealPlan.shopping.empty")}
                </ThemedText>
              </BaseCard>
            ) : (
              categories.map((cat) => (
                <CategoryBlock
                  key={cat.slug}
                  category={cat}
                  checked={checked}
                  onToggle={toggle}
                  theme={theme}
                />
              ))
            )}
          </View>
        </PaywallBlur>
      </ScrollView>

      <PaywallBlurOverlay
        visible={!isPremium}
        featureName={t("mealPlan.featureName")}
      />
    </View>
  );
}

function CategoryBlock({
  category,
  checked,
  onToggle,
  theme,
}: {
  category: ShoppingCategory;
  checked: Set<string>;
  onToggle: (item: ShoppingItem) => void;
  theme: typeof Colors.light;
}) {
  return (
    <View>
      <ThemedText style={styles.categoryLabel} type="secondary">
        {category.label}
      </ThemedText>
      <BaseCard style={styles.listCard}>
        {category.items.map((item, i) => {
          const isChecked = checked.has(item.id);
          return (
            <Pressable
              key={item.id}
              onPress={() => onToggle(item)}
              style={({ pressed }) => [
                styles.row,
                i < category.items.length - 1 && {
                  borderBottomColor: theme.borderLight,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
                pressed && { opacity: 0.7 },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  isChecked
                    ? { backgroundColor: theme.brand, borderColor: theme.brand }
                    : { borderColor: theme.border },
                ]}
              >
                {isChecked && <Check color="#FFFFFF" size={14} />}
              </View>
              <ThemedText
                style={[
                  styles.itemName,
                  isChecked && {
                    textDecorationLine: "line-through",
                    color: theme.textSecondary,
                  },
                ]}
              >
                {item.name}
              </ThemedText>
              <ThemedText type="secondary" style={styles.itemQty}>
                {item.qty}
              </ThemedText>
            </Pressable>
          );
        })}
      </BaseCard>
    </View>
  );
}

function formatWeekLabel(d: Date): string {
  const monday = new Date(d);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  const sunday = new Date(monday);
  sunday.setDate(sunday.getDate() + 6);
  const fmt = (x: Date) =>
    `${x.getMonth() + 1}/${x.getDate()}`;
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: Spacing.md,
  },
  iconBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  body: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  categoryLabel: {
    fontSize: Type.xs,
    fontWeight: "800",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  listCard: {
    padding: 0,
    gap: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: Radius.sm,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: {
    flex: 1,
    fontSize: Type.sm,
    fontWeight: "600",
  },
  itemQty: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
});
