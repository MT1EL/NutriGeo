import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { ThemeMode } from "@/hooks/use-settings";
import { Globe, LucideIcon, Moon, Sun } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const OPTIONS: { key: ThemeMode; labelKey: string; Icon: LucideIcon }[] = [
  { key: "system", labelKey: "settings.themeSystem", Icon: Globe },
  { key: "light", labelKey: "settings.themeLight", Icon: Sun },
  { key: "dark", labelKey: "settings.themeDark", Icon: Moon },
];

type Props = {
  value: ThemeMode;
  onChange: (next: ThemeMode) => void;
  disabled?: boolean;
};

export default function ThemeSelector({ value, onChange, disabled }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.groupLabel} type="secondary">
        {t("settings.theme")}
      </ThemedText>
      <View style={styles.row}>
        {OPTIONS.map(({ key, labelKey, Icon }) => {
          const isActive = value === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              disabled={disabled}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  backgroundColor: isActive ? theme.brandSoft : theme.card,
                  borderColor: isActive ? theme.brand : theme.border,
                },
              ]}
            >
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: isActive ? theme.brand : theme.borderLight,
                  },
                ]}
              >
                <Icon
                  color={isActive ? "#FFFFFF" : theme.textSecondary}
                  size={18}
                />
              </View>
              <ThemedText
                style={styles.label}
                color={isActive ? theme.brand : theme.text}
              >
                {t(labelKey)}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  card: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
