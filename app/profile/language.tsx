import type { Language } from "@/api/types";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useSettings } from "@/hooks/use-settings";
import { SUPPORTED_LANGUAGES } from "@/i18n";
import { track } from "@/lib/analytics";
import { Check } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const FLAGS: Record<string, string> = {
  ka: "🇬🇪",
  en: "🇬🇧",
};

export default function LanguageScreen() {
  const { t, i18n } = useTranslation();
  const { setLanguage } = useSettings();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const active = i18n.language?.split("-")[0];

  const onPick = (code: Language) => {
    if (code === active) return;
    track("language_switched", { from: active, to: code });
    // Switch the UI immediately (i18n listener also persists to SecureStore),
    // then sync to the server so the choice follows the account across devices.
    void i18n.changeLanguage(code);
    setLanguage(code);
  };

  return (
    <SubScreenLayout title={t("language.title")} subtitle={t("language.subtitle")}>
      <View
        style={[
          styles.list,
          { backgroundColor: theme.card, borderColor: theme.borderLight },
        ]}
      >
        {SUPPORTED_LANGUAGES.map((code, i) => {
          const isActive = active === code;
          return (
            <View key={code}>
              {i > 0 && (
                <View
                  style={[styles.sep, { backgroundColor: theme.borderLight }]}
                />
              )}
              <TouchableOpacity
                onPress={() => onPick(code as Language)}
                activeOpacity={0.6}
                style={styles.row}
              >
                <View
                  style={[styles.flag, { backgroundColor: theme.borderLight }]}
                >
                  <ThemedText style={styles.flagText}>{FLAGS[code]}</ThemedText>
                </View>
                <View style={{ flex: 1 }}>
                  <ThemedText style={styles.name}>{t(`language.${code}`)}</ThemedText>
                  <ThemedText style={styles.english} type="secondary">
                    {t(`language.${code}English`)}
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
        {t("language.saved")}
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
