import ChipInput from "@/components/ui/inputs/ChipInput";
import { ChipRow } from "@/components/ui/preferences/Chip";
import Section from "@/components/ui/preferences/Section";
import Stepper from "@/components/ui/preferences/Stepper";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import {
  ALL_MEALS,
  CUISINE_OPTIONS,
  DEFAULT_MEAL_PLAN_PREFERENCES,
  NOTES_MAX_LENGTH,
  PREP_TIME_OPTIONS,
  type MealPlanPreferences,
} from "@/utils/mealPlanData";
import {
  CalendarRange,
  CheckCircle2,
  ChefHat,
  Clock,
  MessageSquareText,
  Package,
  Settings2,
  Sparkles,
  Users,
  X,
  XCircle,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SERVINGS_MIN = 1;
const SERVINGS_MAX = 6;
const MAX_CUISINES = 4;
const MAX_LIST_ITEMS = 30;
const MAX_MUST_INCLUDE = 10;

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (prefs: MealPlanPreferences) => void;
  initialValue?: MealPlanPreferences;
  remaining?: number;
  submitting?: boolean;
};

type ListField = "must_include" | "pantry_ingredients" | "avoid_ingredients";

const LIST_CAPS: Record<ListField, number> = {
  must_include: MAX_MUST_INCLUDE,
  pantry_ingredients: MAX_LIST_ITEMS,
  avoid_ingredients: MAX_LIST_ITEMS,
};

export default function MealPlanPreferencesSheet({
  visible,
  onClose,
  onSubmit,
  initialValue,
  remaining,
  submitting,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { user } = useAuth();
  const goalKcal = user?.goals?.daily_calorie_target ?? null;

  const [prefs, setPrefs] = useState<MealPlanPreferences>(
    initialValue ?? DEFAULT_MEAL_PLAN_PREFERENCES,
  );
  const [kcalDraft, setKcalDraft] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    const seed = initialValue ?? DEFAULT_MEAL_PLAN_PREFERENCES;
    setPrefs(seed);
    setKcalDraft(seed.kcal_override != null ? String(seed.kcal_override) : "");
    setErrors({});
  }, [visible, initialValue]);

  const update = <K extends keyof MealPlanPreferences>(
    key: K,
    value: MealPlanPreferences[K],
  ) => setPrefs((p) => ({ ...p, [key]: value }));

  const toggleInArray = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const toggleMeal = (key: (typeof ALL_MEALS)[number]) => {
    update("meals_to_include", toggleInArray(prefs.meals_to_include, key));
    if (errors.meals) setErrors((e) => ({ ...e, meals: "" }));
  };

  const toggleCuisine = (slug: string) => {
    if (
      !prefs.cuisines.includes(slug) &&
      prefs.cuisines.length >= MAX_CUISINES
    ) {
      return;
    }
    update("cuisines", toggleInArray(prefs.cuisines, slug));
  };

  const addToList = (field: ListField, raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setPrefs((p) => {
      const list = p[field];
      if (
        list.length >= LIST_CAPS[field] ||
        list.some((x) => x.toLowerCase() === trimmed.toLowerCase())
      ) {
        return p;
      }
      return { ...p, [field]: [...list, trimmed] };
    });
  };

  const removeFromList = (field: ListField, name: string) =>
    setPrefs((p) => ({ ...p, [field]: p[field].filter((x) => x !== name) }));

  const submit = () => {
    const next: Record<string, string> = {};
    if (prefs.meals_to_include.length === 0) {
      next.meals = t("mealPlan.preferences.errorMealsRequired");
    }
    let kcalOverride: number | null = null;
    const trimmed = kcalDraft.trim();
    if (trimmed) {
      const parsed = parseInt(trimmed.replace(/[^\d]/g, ""), 10);
      if (!Number.isFinite(parsed) || parsed < 800 || parsed > 5000) {
        next.kcal = t("mealPlan.preferences.errorKcalRange");
      } else {
        kcalOverride = parsed;
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    onSubmit({ ...prefs, kcal_override: kcalOverride });
  };

  const remainingLabel = useMemo(
    () =>
      remaining == null
        ? null
        : t("mealPlan.preferences.remaining", { count: remaining }),
    [remaining, t],
  );

  const prepOptions = useMemo(
    () =>
      PREP_TIME_OPTIONS.map((opt) => ({
        value: opt,
        label:
          opt == null
            ? t("mealPlan.preferences.prepNone")
            : t("mealPlan.preferences.prepMinutes", { minutes: opt }),
      })),
    [t],
  );

  const mealOptions = useMemo(
    () => ALL_MEALS.map((m) => ({ value: m, label: t(`meal.${m}`) })),
    [t],
  );

  const cuisineOptions = useMemo(
    () =>
      CUISINE_OPTIONS.map((slug) => ({
        value: slug,
        label: t(`mealPlan.preferences.cuisines.${slug}`),
        disabled:
          !prefs.cuisines.includes(slug) &&
          prefs.cuisines.length >= MAX_CUISINES,
      })),
    [t, prefs.cuisines],
  );

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
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={["bottom"]} style={styles.content}>
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
                  <Sparkles color={theme.brand} size={18} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText style={styles.title}>
                    {t("mealPlan.preferences.title")}
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.subtitle}>
                    {t("mealPlan.preferences.subtitle")}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeBtn,
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
                <Section
                  Icon={Users}
                  title={t("mealPlan.preferences.servingsTitle")}
                  hint={t("mealPlan.preferences.servingsHint")}
                >
                  <Stepper
                    value={prefs.servings_per_meal}
                    min={SERVINGS_MIN}
                    max={SERVINGS_MAX}
                    onChange={(v) => update("servings_per_meal", v)}
                    unitLabel={t("mealPlan.preferences.servingsUnit", {
                      count: prefs.servings_per_meal,
                    })}
                  />
                </Section>

                <Section
                  Icon={Clock}
                  title={t("mealPlan.preferences.prepTitle")}
                  hint={t("mealPlan.preferences.prepHint")}
                >
                  <ChipRow
                    options={prepOptions}
                    isActive={(v) => prefs.max_prep_minutes === v}
                    onSelect={(v) => update("max_prep_minutes", v)}
                  />
                </Section>

                <Section
                  Icon={CalendarRange}
                  title={t("mealPlan.preferences.mealsTitle")}
                  hint={t("mealPlan.preferences.mealsHint")}
                  errorText={errors.meals}
                >
                  <ChipRow
                    options={mealOptions}
                    isActive={(v) => prefs.meals_to_include.includes(v)}
                    onSelect={toggleMeal}
                  />
                </Section>

                <Section
                  Icon={ChefHat}
                  title={t("mealPlan.preferences.cuisinesTitle")}
                  hint={t("mealPlan.preferences.cuisinesHint")}
                  badge={`${prefs.cuisines.length}/${MAX_CUISINES}`}
                >
                  <ChipRow
                    options={cuisineOptions}
                    isActive={(v) => prefs.cuisines.includes(v)}
                    onSelect={toggleCuisine}
                  />
                </Section>

                <Section
                  Icon={CheckCircle2}
                  title={t("mealPlan.preferences.mustIncludeTitle")}
                  hint={t("mealPlan.preferences.mustIncludeHint")}
                  badge={`${prefs.must_include.length}/${MAX_MUST_INCLUDE}`}
                >
                  <ChipInput
                    items={prefs.must_include}
                    onAdd={(raw) => addToList("must_include", raw)}
                    onRemove={(name) => removeFromList("must_include", name)}
                    placeholder={t(
                      "mealPlan.preferences.mustIncludePlaceholder",
                    )}
                    addLabel={t("mealPlan.preferences.addChip")}
                  />
                </Section>

                <Section
                  Icon={Package}
                  title={t("mealPlan.preferences.pantryTitle")}
                  hint={t("mealPlan.preferences.pantryHint")}
                >
                  <ChipInput
                    items={prefs.pantry_ingredients}
                    onAdd={(raw) => addToList("pantry_ingredients", raw)}
                    onRemove={(name) =>
                      removeFromList("pantry_ingredients", name)
                    }
                    placeholder={t("mealPlan.preferences.pantryPlaceholder")}
                    addLabel={t("mealPlan.preferences.addChip")}
                  />
                </Section>

                <Section
                  Icon={XCircle}
                  title={t("mealPlan.preferences.avoidTitle")}
                  hint={t("mealPlan.preferences.avoidHint")}
                >
                  <ChipInput
                    items={prefs.avoid_ingredients}
                    onAdd={(raw) => addToList("avoid_ingredients", raw)}
                    onRemove={(name) =>
                      removeFromList("avoid_ingredients", name)
                    }
                    placeholder={t("mealPlan.preferences.avoidPlaceholder")}
                    addLabel={t("mealPlan.preferences.addChip")}
                  />
                </Section>

                <Section
                  Icon={MessageSquareText}
                  title={t("mealPlan.preferences.notesTitle")}
                  hint={t("mealPlan.preferences.notesHint")}
                  badge={t("mealPlan.preferences.notesCount", {
                    count: prefs.notes.length,
                    max: NOTES_MAX_LENGTH,
                  })}
                >
                  <View
                    style={[
                      styles.notesWrap,
                      {
                        backgroundColor: theme.background,
                        borderColor: theme.border,
                      },
                    ]}
                  >
                    <TextInput
                      value={prefs.notes}
                      onChangeText={(text) =>
                        update("notes", text.slice(0, NOTES_MAX_LENGTH))
                      }
                      placeholder={t("mealPlan.preferences.notesPlaceholder")}
                      placeholderTextColor={theme.textSecondary}
                      style={[styles.notesInput, { color: theme.text }]}
                      multiline
                      maxLength={NOTES_MAX_LENGTH}
                      textAlignVertical="top"
                    />
                  </View>
                </Section>

                <View
                  style={[
                    styles.switchRow,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.borderLight,
                    },
                  ]}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <ThemedText style={styles.switchTitle}>
                      {t("mealPlan.preferences.batchTitle")}
                    </ThemedText>
                    <ThemedText type="secondary" style={styles.switchHint}>
                      {t("mealPlan.preferences.batchHint")}
                    </ThemedText>
                  </View>
                  <Switch
                    value={prefs.batch_cooking}
                    onValueChange={(v) => update("batch_cooking", v)}
                    trackColor={{ false: theme.border, true: theme.brand }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor={theme.border}
                  />
                </View>

                <Section
                  Icon={Settings2}
                  title={t("mealPlan.preferences.advancedTitle")}
                  collapsible
                >
                  <View style={{ gap: Spacing.xs }}>
                    <ThemedText style={styles.fieldLabel} type="secondary">
                      {t("mealPlan.preferences.kcalOverrideLabel")}
                    </ThemedText>
                    <View
                      style={[
                        styles.kcalInputWrap,
                        {
                          backgroundColor: theme.background,
                          borderColor: errors.kcal ? theme.error : theme.border,
                        },
                      ]}
                    >
                      <TextInput
                        value={kcalDraft}
                        onChangeText={(text) => {
                          setKcalDraft(text);
                          if (errors.kcal) {
                            setErrors((e) => ({ ...e, kcal: "" }));
                          }
                        }}
                        keyboardType="number-pad"
                        placeholder={
                          goalKcal != null ? String(goalKcal) : "2000"
                        }
                        placeholderTextColor={theme.textSecondary}
                        style={[styles.kcalInput, { color: theme.text }]}
                        maxLength={4}
                      />
                      <ThemedText style={styles.kcalUnit} type="secondary">
                        kcal
                      </ThemedText>
                    </View>
                    <ThemedText
                      type="secondary"
                      style={
                        errors.kcal
                          ? { ...styles.fieldHint, color: theme.error }
                          : styles.fieldHint
                      }
                    >
                      {errors.kcal ||
                        t("mealPlan.preferences.kcalOverrideHint", {
                          kcal: goalKcal ?? 2000,
                        })}
                    </ThemedText>
                  </View>
                </Section>
              </ScrollView>

              {remainingLabel ? (
                <ThemedText type="secondary" style={styles.remaining}>
                  {remainingLabel}
                </ThemedText>
              ) : null}

              <TouchableOpacity
                onPress={submit}
                activeOpacity={0.85}
                disabled={submitting}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: theme.brand,
                    opacity: submitting ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={styles.primaryBtnText}
                  color={theme.textOnBrand}
                >
                  {submitting
                    ? t("mealPlan.preferences.submitting")
                    : t("mealPlan.preferences.submit")}
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
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    height: "92%",
  },
  content: { flex: 1, gap: Spacing.xl },
  scroll: { flex: 1 },
  handleRow: { alignItems: "center", paddingBottom: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: Radius.pill },
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
  title: { fontSize: Type.xl, fontWeight: "700" },
  subtitle: { fontSize: Type.xs },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: Spacing.xxl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  notesWrap: {
    minHeight: 96,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  notesInput: { fontSize: Type.base, lineHeight: 22, minHeight: 72 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  switchTitle: { fontSize: Type.base, fontWeight: "700" },
  switchHint: { fontSize: Type.xs, marginTop: 4, lineHeight: 18 },
  fieldLabel: { fontSize: Type.sm, marginLeft: Spacing.xs },
  fieldHint: {
    fontSize: Type.xs,
    marginLeft: Spacing.xs,
    marginTop: 4,
  },
  kcalInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  kcalInput: { flex: 1, fontSize: Type.base },
  kcalUnit: { fontSize: Type.sm, fontWeight: "700" },
  remaining: { fontSize: Type.xs, textAlign: "center" },
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
