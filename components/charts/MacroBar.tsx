import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LucideIcon } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import ThemedText from "../ui/ThemedText";

type Props = {
  label: string;
  consumed: number;
  goal: number;
  color: string;
  unit?: string;
  Icon?: LucideIcon;
};

export const MacroBar = ({
  label,
  consumed,
  goal,
  color,
  unit,
  Icon,
}: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const resolvedUnit = unit ?? t("macros.g");
  const theme = Colors[colorScheme];
  const progress = Math.min(consumed / goal, 1);

  return (
    <View style={styles.container}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={styles.row}>
          {Icon && <Icon size={14} color={color} />}
          <ThemedText style={styles.macroText}>{label}</ThemedText>
        </View>
        <ThemedText style={styles.macroValue} type="secondary">
          {consumed}
          <ThemedText style={styles.macroValueGoal} type="secondary">
            {" "}
            / {goal}
            {resolvedUnit}
          </ThemedText>
        </ThemedText>
      </View>
      <View style={[styles.track, { backgroundColor: theme.borderLight }]}>
        <View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.xs + 2,
    alignItems: "center",
  },
  macroText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  macroValue: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  macroValueGoal: {
    fontSize: Type.xs,
    fontWeight: "500",
  },
  track: {
    height: 8,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: Radius.pill,
  },
});
