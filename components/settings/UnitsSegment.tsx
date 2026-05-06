import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { Units } from "@/hooks/use-settings";
import { Ruler } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const OPTIONS: { key: Units; labelKey: string }[] = [
  { key: "metric", labelKey: "settings.unitsMetric" },
  { key: "imperial", labelKey: "settings.unitsImperial" },
];

type Props = {
  value: Units;
  onChange: (next: Units) => void;
  disabled?: boolean;
};

export default function UnitsSegment({ value, onChange, disabled }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.groupLabel} type="secondary">
        {t("settings.units")}
      </ThemedText>
      <View style={[styles.segment, { backgroundColor: theme.borderLight }]}>
        {OPTIONS.map((opt) => {
          const isActive = value === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              onPress={() => onChange(opt.key)}
              disabled={disabled}
              activeOpacity={0.85}
              style={[
                styles.item,
                isActive && {
                  backgroundColor: theme.card,
                  shadowColor: theme.shadow,
                  shadowOpacity: 1,
                  shadowRadius: 6,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: 2,
                },
              ]}
            >
              <Ruler
                color={isActive ? theme.brand : theme.textSecondary}
                size={14}
              />
              <ThemedText
                style={styles.text}
                color={isActive ? theme.text : theme.textSecondary}
              >
                {t(opt.labelKey)}
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
  segment: {
    flexDirection: "row",
    padding: 4,
    borderRadius: Radius.md,
  },
  item: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs + 2,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.sm,
  },
  text: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
