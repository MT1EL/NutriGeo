import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "./ThemedText";

type Props = {
  Icon?: LucideIcon;
  iconColor?: string;
  iconTint?: string;
  label: string;
  hint?: string;
  value?: string;
  onPress?: () => void;
  rightAccessory?: "chevron" | "switch" | "value" | "none";
  switchOn?: boolean;
  onSwitchChange?: (v: boolean) => void;
  destructive?: boolean;
};

export const SettingsRow = ({
  Icon,
  iconColor,
  iconTint,
  label,
  hint,
  value,
  onPress,
  rightAccessory = "chevron",
  switchOn,
  onSwitchChange,
  destructive,
}: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const labelColor = destructive ? theme.error : theme.text;

  const content = (
    <View style={styles.row}>
      {Icon && (
        <View
          style={[
            styles.icon,
            { backgroundColor: iconTint ?? theme.borderLight },
          ]}
        >
          <Icon color={iconColor ?? theme.text} size={18} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.label} color={labelColor}>
          {label}
        </ThemedText>
        {hint && (
          <ThemedText style={styles.hint} type="secondary">
            {hint}
          </ThemedText>
        )}
      </View>
      {rightAccessory === "value" && value !== undefined && (
        <ThemedText style={styles.value} type="secondary">
          {value}
        </ThemedText>
      )}
      {rightAccessory === "switch" && (
        <Switch
          value={!!switchOn}
          onValueChange={onSwitchChange}
          trackColor={{ false: theme.border, true: theme.brand }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={theme.border}
        />
      )}
      {rightAccessory === "chevron" && (
        <ChevronRight color={theme.textSecondary} size={18} />
      )}
    </View>
  );

  if (rightAccessory === "switch" || !onPress) {
    return <View>{content}</View>;
  }

  return (
    <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
};

export const SettingsGroup = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  return (
    <View style={{ gap: Spacing.sm }}>
      {title && (
        <ThemedText style={styles.groupTitle} type="secondary">
          {title}
        </ThemedText>
      )}
      <View
        style={[
          styles.group,
          { backgroundColor: theme.card, borderColor: theme.borderLight },
        ]}
      >
        {React.Children.map(children, (child, i) => (
          <View>
            {i > 0 && (
              <View
                style={[styles.sep, { backgroundColor: theme.borderLight }]}
              />
            )}
            {child}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    minHeight: 56,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  hint: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  value: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  groupTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  group: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  sep: {
    height: StyleSheet.hairlineWidth,
    marginLeft: Spacing.lg + 36 + Spacing.md,
  },
});
