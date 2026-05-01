import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const LANGUAGES = [
  { code: "ka", name: "ქართული", english: "Georgian", flag: "🇬🇪" },
  { code: "en", name: "English", english: "English", flag: "🇬🇧" },
  { code: "ru", name: "Русский", english: "Russian", flag: "🇷🇺" },
  { code: "tr", name: "Türkçe", english: "Turkish", flag: "🇹🇷" },
];

export default function LanguageScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [active, setActive] = useState("ka");

  return (
    <SubScreenLayout title="ენა" subtitle="აპლიკაციის ინტერფეისი">
      <View
        style={[
          styles.list,
          { backgroundColor: theme.card, borderColor: theme.borderLight },
        ]}
      >
        {LANGUAGES.map((lang, i) => {
          const isActive = active === lang.code;
          return (
            <View key={lang.code}>
              {i > 0 && (
                <View
                  style={[
                    styles.sep,
                    { backgroundColor: theme.borderLight },
                  ]}
                />
              )}
              <TouchableOpacity
                onPress={() => setActive(lang.code)}
                activeOpacity={0.6}
                style={styles.row}
              >
                <View
                  style={[
                    styles.flag,
                    { backgroundColor: theme.borderLight },
                  ]}
                >
                  <ThemedText style={styles.flagText}>{lang.flag}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.name}>{lang.name}</ThemedText>
                  <ThemedText style={styles.english} type="secondary">
                    {lang.english}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isActive ? theme.brand : theme.border,
                      backgroundColor: isActive ? theme.brand : "transparent",
                    },
                  ]}
                >
                  {isActive && <Check color="#FFFFFF" size={14} />}
                </View>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      <ThemedText style={styles.hint} type="secondary">
        ცვლილება შეინახება და გამოყენებული იქნება შემდეგი გახსნისას.
      </ThemedText>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    minHeight: 64,
  },
  flag: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  flagText: {
    fontSize: 22,
  },
  name: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  english: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg + 40 + Spacing.md,
  },
  hint: {
    fontSize: Type.xs,
    paddingHorizontal: Spacing.sm,
    lineHeight: 18,
  },
});
