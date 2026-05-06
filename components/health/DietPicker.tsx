import type { Diet } from "@/api";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Apple, Beef, Check, Leaf, LucideIcon, Sprout } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const OPTIONS: { key: Diet; labelKey: string; Icon: LucideIcon; color: string }[] =
  [
    { key: "none", labelKey: "healthPicker.regular", Icon: Apple, color: "#64748B" },
    { key: "vegetarian", labelKey: "diet.vegetarian", Icon: Sprout, color: "#34A867" },
    { key: "vegan", labelKey: "diet.vegan", Icon: Leaf, color: "#16A34A" },
    { key: "keto", labelKey: "diet.keto", Icon: Beef, color: "#7C5CFF" },
  ];

type Props = {
  value: Diet;
  onChange: (next: Diet) => void;
};

export default function DietPicker({ value, onChange }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <BaseCard>
      <View style={{ gap: Spacing.xs + 2 }}>
        <ThemedText style={styles.title}>{t("healthPicker.title")}</ThemedText>
        <ThemedText type="secondary" style={styles.caption}>
          {t("healthPicker.subtitle")}
        </ThemedText>
      </View>
      <View style={styles.list}>
        {OPTIONS.map(({ key, labelKey, Icon, color }) => {
          const isActive = value === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              activeOpacity={0.85}
              style={[
                styles.row,
                {
                  borderColor: isActive ? color : theme.border,
                  backgroundColor: isActive ? color + "12" : theme.card,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: color + "22" }]}>
                <Icon color={color} size={18} />
              </View>
              <ThemedText style={styles.label}>{t(labelKey)}</ThemedText>
              {isActive && (
                <View style={[styles.check, { backgroundColor: color }]}>
                  <Check color="#FFFFFF" size={14} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  caption: {
    fontSize: Type.xs,
  },
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: Type.base,
    fontWeight: "600",
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
