import type { Diet } from "@/api/types";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useWizard } from "@/contexts/WizardContext";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

const DIET_OPTIONS: { key: Diet; label: string }[] = [
  { key: "none", label: "შეზღუდვების გარეშე" },
  { key: "vegetarian", label: "ვეგეტარიანული" },
  { key: "vegan", label: "ვეგანური" },
  { key: "pescatarian", label: "პესკატარიანული" },
  { key: "keto", label: "კეტო" },
  { key: "paleo", label: "პალეო" },
];

const ALLERGY_OPTIONS = [
  "nuts",
  "dairy",
  "gluten",
  "eggs",
  "soy",
  "shellfish",
];

const ALLERGY_LABELS: Record<string, string> = {
  nuts: "თხილეული",
  dairy: "რძის ნაწარმი",
  gluten: "გლუტენი",
  eggs: "კვერცხი",
  soy: "სოია",
  shellfish: "ზღვის პროდუქტები",
};

const RESTRICTION_OPTIONS = [
  "low-sodium",
  "low-sugar",
  "halal",
  "kosher",
];

const RESTRICTION_LABELS: Record<string, string> = {
  "low-sodium": "ნაკლები მარილი",
  "low-sugar": "ნაკლები შაქარი",
  halal: "ჰალალი",
  kosher: "კოშერი",
};

const DietPreferences = () => {
  const { data, setField, toggleInArray } = useWizard();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <WizzardContentLayout
      title="კვების უპირატესობები"
      subtitle="აირჩიე კვების ტიპი და შენი შეზღუდვები"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.section}>
          <ThemedText type="secondary" style={styles.sectionLabel}>
            დიეტა
          </ThemedText>
          <View style={styles.chipRow}>
            {DIET_OPTIONS.map((opt) => {
              const active = data.diet === opt.key;
              return (
                <Chip
                  key={opt.key}
                  label={opt.label}
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
            ალერგიები
          </ThemedText>
          <View style={styles.chipRow}>
            {ALLERGY_OPTIONS.map((value) => (
              <Chip
                key={value}
                label={ALLERGY_LABELS[value]}
                active={data.allergies.includes(value)}
                onPress={() => toggleInArray("allergies", value)}
                theme={theme}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="secondary" style={styles.sectionLabel}>
            შეზღუდვები
          </ThemedText>
          <View style={styles.chipRow}>
            {RESTRICTION_OPTIONS.map((value) => (
              <Chip
                key={value}
                label={RESTRICTION_LABELS[value]}
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
