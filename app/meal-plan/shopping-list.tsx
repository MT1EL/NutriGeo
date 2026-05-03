import BaseCard from "@/components/cards/BaseCard";
import {
  PaywallBlur,
  PaywallBlurOverlay,
} from "@/components/premium/PaywallBlur";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { usePremium } from "@/hooks/use-premium";
import {
  STATIC_SHOPPING_LIST,
  type ShoppingCategory,
  type ShoppingItem,
} from "@/utils/mealPlanData";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { Check, ChevronLeft, Copy, Share2 } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Build a flat key for the checked-set so we don't need a nested
// data structure for local checkbox state.
const itemKey = (cat: string, item: ShoppingItem) => `${cat}::${item.name}`;

export default function ShoppingListScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { isPremium } = usePremium();
  const toast = useToast();

  const [checked, setChecked] = useState<Set<string>>(new Set());

  const totalItems = useMemo(
    () =>
      STATIC_SHOPPING_LIST.reduce((sum, cat) => sum + cat.items.length, 0),
    [],
  );

  const toggle = (cat: string, item: ShoppingItem) => {
    setChecked((prev) => {
      const next = new Set(prev);
      const k = itemKey(cat, item);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  };

  const buildShareText = () => {
    const lines: string[] = [];
    const weekLabel = formatWeekLabel(new Date());
    lines.push(t("mealPlan.shopping.shareHeader", { week: weekLabel }));
    lines.push("");
    for (const cat of STATIC_SHOPPING_LIST) {
      lines.push(`— ${t(`mealPlan.shopping.${cat.labelKey}`)} —`);
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
            {STATIC_SHOPPING_LIST.map((cat) => (
              <CategoryBlock
                key={cat.labelKey}
                category={cat}
                checked={checked}
                onToggle={toggle}
                theme={theme}
              />
            ))}
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
  onToggle: (cat: string, item: ShoppingItem) => void;
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  return (
    <View>
      <ThemedText style={styles.categoryLabel} type="secondary">
        {t(`mealPlan.shopping.${category.labelKey}`)}
      </ThemedText>
      <BaseCard style={styles.listCard}>
        {category.items.map((item, i) => {
          const k = itemKey(category.labelKey, item);
          const isChecked = checked.has(k);
          return (
            <Pressable
              key={item.name}
              onPress={() => onToggle(category.labelKey, item)}
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
