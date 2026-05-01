import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "./ThemedText";

type Props = {
  label?: string;
  Icon: React.ComponentType<{ color: string }>;
  placeholder?: string;
  onActionTextPress?: () => void;
  actionText?: string;
  errorText?: string;
  defaultValue?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
  compact?: boolean;
  secure?: boolean;
};

const Input = ({
  label,
  placeholder,
  Icon,
  actionText,
  errorText,
  onActionTextPress,
  defaultValue,
  value,
  onChangeText,
  keyboardType,
  disabled,
  compact,
  secure,
}: Props) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const borderColor = errorText
    ? theme.error
    : isFocused
      ? theme.brand
      : theme.border;

  return (
    <View style={{ gap: Spacing.xs }}>
      {label && (
        <ThemedText style={styles.label} type="secondary">
          {label}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputContainer,
          compact && styles.inputContainerCompact,
          {
            backgroundColor: theme.background,
            borderColor,
          },
          isFocused &&
            !errorText && {
              shadowColor: theme.brand,
              shadowOpacity: 0.18,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 4 },
              elevation: 2,
            },
        ]}
      >
        <Icon
          color={
            isFocused
              ? theme.brand
              : errorText
                ? theme.error
                : theme.textSecondary
          }
        />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          defaultValue={defaultValue}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={!disabled}
          secureTextEntry={!!secure}
          autoCapitalize={secure ? "none" : undefined}
          autoCorrect={!secure}
        />
      </View>
      {errorText && (
        <ThemedText style={styles.errorText} color={theme.error}>
          {errorText}
        </ThemedText>
      )}
      {actionText && !errorText && (
        <TouchableOpacity onPress={onActionTextPress}>
          <ThemedText style={styles.forgotPasswordText} type="secondary">
            {actionText}
          </ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 56,
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  inputContainerCompact: {
    height: 44,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: Type.base,
  },
  label: {
    fontSize: Type.sm,
    marginLeft: Spacing.xs,
  },
  errorText: {
    fontSize: Type.sm,
    marginLeft: Spacing.xs,
  },
  forgotPasswordText: {
    fontSize: Type.sm,
    textAlign: "right",
    marginTop: Spacing.xs,
  },
});
