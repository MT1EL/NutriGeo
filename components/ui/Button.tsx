import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  ViewStyle,
} from "react-native";

type Variant = "primary" | "secondary" | "ghost" | "outline";

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  variant?: Variant;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
};

const Button = ({
  children,
  onPress,
  variant = "primary",
  backgroundColor,
  color,
  disabled,
  style,
}: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const variantBg: Record<Variant, string> = {
    primary: theme.brand,
    secondary: theme.brandSoft,
    ghost: "transparent",
    outline: "transparent",
  };

  const variantText: Record<Variant, string> = {
    primary: theme.textOnBrand,
    secondary: theme.brand,
    ghost: theme.brand,
    outline: theme.text,
  };

  const bg = backgroundColor ?? variantBg[variant];
  const fg = color ?? variantText[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },

        variant === "primary" && {
          shadowColor: theme.brand,
          shadowOpacity: 0.25,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 3,
        },

        variant === "outline" && {
          borderWidth: 1,
          borderColor: theme.border,
        },

        disabled && { opacity: 0.4 },

        pressed &&
          !disabled && {
            transform: [{ scale: 0.97 }],
            opacity: 0.9,
          },

        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.buttonLabel, { color: fg }]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonLabel: {
    fontSize: Type.lg,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
});
