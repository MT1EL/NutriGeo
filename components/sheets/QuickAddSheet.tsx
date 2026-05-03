import { createFoodLog } from "@/api/foodLog";
import type { MealKey as ApiMealKey } from "@/api/types";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { loggedAtForDate } from "@/utils/date";
import { invalidateFoodLogQueries } from "@/utils/queryInvalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Beef,
  Droplet,
  Flame,
  Utensils,
  Wheat,
  X,
  Zap,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  defaultMealKey: ApiMealKey;
  todayKey: string;
};

const ALL_API_MEAL_KEYS: ApiMealKey[] = [
  "breakfast",
  "lunch",
  "snack",
  "dinner",
];

function toNum(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

export default function QuickAddSheet({
  visible,
  onClose,
  defaultMealKey,
  todayKey,
}: Props) {
  const { t } = useTranslation();
  const apiMealLabel = (k: ApiMealKey): string => t(`meal.${k}`);
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  const [mealKey, setMealKey] = useState<ApiMealKey>(defaultMealKey);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    setName("");
    setKcal("");
    setProtein("");
    setCarbs("");
    setFat("");
    setFiber("");
    setMealKey(defaultMealKey);
    setErrors({});
  }, [visible, defaultMealKey]);

  const mutation = useMutation({
    mutationFn: () => {
      const fiberNum = fiber ? toNum(fiber) : null;
      return createFoodLog({
        meal_key: mealKey,
        logged_at: loggedAtForDate(todayKey),
        quick_add: {
          name: name.trim() || undefined,
          kcal: toNum(kcal)!,
          protein_g: toNum(protein)!,
          carbs_g: toNum(carbs)!,
          fat_g: toNum(fat)!,
          ...(fiberNum != null ? { fiber_g: fiberNum } : {}),
        },
      });
    },
    onSuccess: () => {
      invalidateFoodLogQueries(queryClient, todayKey);
      toast.success(t("quickAdd.success"));
      onClose();
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : t("quickAdd.failed");
      toast.error(message, t("common.error"));
    },
  });

  const handleSave = () => {
    const next: Record<string, string> = {};
    if (toNum(kcal) == null) next.kcal = t("wizard.suggestion.enterKcalGoal");
    if (toNum(protein) == null) next.protein = t("wizard.suggestion.enterProtein");
    if (toNum(carbs) == null) next.carbs = t("wizard.suggestion.enterCarbs");
    if (toNum(fat) == null) next.fat = t("wizard.suggestion.enterFat");
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    mutation.mutate();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[styles.sheetWrap, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={["bottom"]} style={styles.sheetContent}>
              <View style={styles.handleRow}>
                <View
                  style={[styles.handle, { backgroundColor: theme.border }]}
                />
              </View>

              <View style={styles.headerRow}>
                <View
                  style={[
                    styles.headerIcon,
                    { backgroundColor: theme.brandSoft },
                  ]}
                >
                  <Zap color={theme.brand} size={18} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText style={styles.title}>{t("quickAdd.title")}</ThemedText>
                  <ThemedText type="secondary" style={styles.subtitle}>
                    {t("quickAdd.subtitle")}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.borderLight },
                  ]}
                  hitSlop={6}
                  activeOpacity={0.7}
                >
                  <X color={theme.text} size={18} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.form}
              >
                <Input
                  Icon={Utensils}
                  label={t("quickAdd.nameOptional")}
                  placeholder={t("quickAdd.namePlaceholder")}
                  value={name}
                  onChangeText={setName}
                />
                <Input
                  Icon={Flame}
                  label={t("food.kcalLabel")}
                  placeholder="0"
                  value={kcal}
                  onChangeText={(t) => {
                    setKcal(t);
                    if (errors.kcal) setErrors({ ...errors, kcal: "" });
                  }}
                  keyboardType="decimal-pad"
                  errorText={errors.kcal || undefined}
                />
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Beef}
                      label={t("food.proteinG")}
                      placeholder="0"
                      value={protein}
                      onChangeText={(t) => {
                        setProtein(t);
                        if (errors.protein)
                          setErrors({ ...errors, protein: "" });
                      }}
                      keyboardType="decimal-pad"
                      errorText={errors.protein || undefined}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Wheat}
                      label={t("food.carbsG")}
                      placeholder="0"
                      value={carbs}
                      onChangeText={(t) => {
                        setCarbs(t);
                        if (errors.carbs) setErrors({ ...errors, carbs: "" });
                      }}
                      keyboardType="decimal-pad"
                      errorText={errors.carbs || undefined}
                    />
                  </View>
                </View>
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Droplet}
                      label={t("food.fatG")}
                      placeholder="0"
                      value={fat}
                      onChangeText={(t) => {
                        setFat(t);
                        if (errors.fat) setErrors({ ...errors, fat: "" });
                      }}
                      keyboardType="decimal-pad"
                      errorText={errors.fat || undefined}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Wheat}
                      label={t("food.fiberG")}
                      placeholder="0"
                      value={fiber}
                      onChangeText={setFiber}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <ThemedText style={styles.groupLabel} type="secondary">
                  {t("quickAdd.inMeal")}
                </ThemedText>
                <View style={styles.mealRow}>
                  {ALL_API_MEAL_KEYS.map((m) => {
                    const active = m === mealKey;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setMealKey(m)}
                        activeOpacity={0.85}
                        style={[
                          styles.mealChip,
                          {
                            backgroundColor: active ? theme.brand : theme.card,
                            borderColor: active ? theme.brand : theme.border,
                          },
                        ]}
                      >
                        <ThemedText
                          style={styles.mealChipText}
                          color={active ? "#FFFFFF" : theme.text}
                        >
                          {apiMealLabel(m)}
                        </ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.85}
                disabled={mutation.isPending}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: theme.brand,
                    opacity: mutation.isPending ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={styles.primaryBtnText}
                  color={theme.textOnBrand}
                >
                  {mutation.isPending ? t("common.saving") : t("quickAdd.submit")}
                </ThemedText>
              </TouchableOpacity>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheetWrap: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    height: "92%",
  },
  sheetContent: {
    gap: Spacing.lg,
    flex: 1,
  },
  scroll: { flex: 1 },
  handleRow: {
    alignItems: "center",
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: 0,
    paddingBottom: Spacing.md,
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  groupLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    opacity: 0.7,
  },
  mealRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  mealChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  mealChipText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  primaryBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: Type.lg,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
