import type { Diet } from "@/api/types";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useWizard } from "@/contexts/WizardContext";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

const DIET_OPTIONS: { key: Diet; labelKey: string }[] = [
  { key: "none", labelKey: "diet.noRestrictions" },
  { key: "vegetarian", labelKey: "diet.vegetarian" },
  { key: "vegan", labelKey: "diet.vegan" },
  { key: "pescatarian", labelKey: "diet.pescatarian" },
  { key: "keto", labelKey: "diet.keto" },
  { key: "paleo", labelKey: "diet.paleo" },
];

const ALLERGY_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "nuts", labelKey: "diet.nuts" },
  { value: "dairy", labelKey: "diet.milkProducts" },
  { value: "gluten", labelKey: "diet.gluten" },
  { value: "eggs", labelKey: "diet.egg" },
  { value: "soy", labelKey: "diet.soy" },
  { value: "shellfish", labelKey: "diet.seafoodFull" },
];

const RESTRICTION_OPTIONS: { value: string; labelKey: string }[] = [
  { value: "low-sodium", labelKey: "diet.lowSalt" },
  { value: "low-sugar", labelKey: "diet.lowSugar" },
  { value: "halal", labelKey: "diet.halal" },
  { value: "kosher", labelKey: "diet.kosher" },
];

const DietPreferences = () => {
  const { t } = useTranslation();
  const { data, setField, toggleInArray } = useWizard();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <WizzardContentLayout
      title={t("wizard.diet.title")}
      subtitle={t("wizard.diet.subtitle")}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.section}>
          <ThemedText type="secondary" style={styles.sectionLabel}>
            {t("wizard.diet.dietLabel")}
          </ThemedText>
          <View style={styles.chipRow}>
            {DIET_OPTIONS.map((opt) => {
              const active = data.diet === opt.key;
              return (
                <Chip
                  key={opt.key}
                  label={t(opt.labelKey)}
                  active={active}
                  onPress={() => setField("diet", opt.key)}
                  theme={theme}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="secondary" style={styles.sectionLabel}>
            {t("wizard.diet.allergiesLabel")}
          </ThemedText>
          <View style={styles.chipRow}>
            {ALLERGY_OPTIONS.map(({ value, labelKey }) => (
              <Chip
                key={value}
                label={t(labelKey)}
                active={data.allergies.includes(value)}
                onPress={() => toggleInArray("allergies", value)}
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="secondary" style={styles.sectionLabel}>
            {t("wizard.diet.restrictionsLabel")}
          </ThemedText>
          <View style={styles.chipRow}>
            {RESTRICTION_OPTIONS.map(({ value, labelKey }) => (
              <Chip
                key={value}
                label={t(labelKey)}
                active={data.restrictions.includes(value)}
                onPress={() => toggleInArray("restrictions", value)}
                theme={theme}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </WizzardContentLayout>
  );
};

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  theme: (typeof Colors)["light"] | (typeof Colors)["dark"];
};

const Chip = ({ label, active, onPress, theme }: ChipProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.chip,
      {
        backgroundColor: active ? theme.tint : theme.background,
        borderColor: active ? theme.brand : theme.border,
      },
    ]}
  >
    <ThemedText
      style={styles.chipLabel}
      color={active ? theme.brand : theme.text}
    >
      {label}
    </ThemedText>
  </TouchableOpacity>
);

export default DietPreferences;

const styles = StyleSheet.create({
  scroll: {
    gap: Spacing.xxl,
    paddingBottom: Spacing.lg,
  },
  section: {
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: Type.sm,
    marginLeft: Spacing.xs,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  chipLabel: {
    fontSize: Type.sm,
    fontWeight: "500",
  },
});
