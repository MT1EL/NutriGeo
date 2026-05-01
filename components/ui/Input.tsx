import { Colors } from "@/constants/theme";
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
  keyboardType?: KeyboardTypeOptions;
  disabled?: boolean;
};

const Input = ({
  label,
  placeholder,
  Icon,
  actionText,
  errorText,
  onActionTextPress,
  defaultValue,
  keyboardType,
  disabled,
}: Props) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const colorScheme = useColorScheme() || "light";

  return (
    <View>
      {label && <ThemedText>{label}</ThemedText>}
      <View
        style={[
          styles.inputContainer,
          errorText && { borderColor: Colors[colorScheme].error },
          isFocused && { borderColor: Colors[colorScheme].brand },
        ]}
      >
        <Icon
          color={
            isFocused
              ? Colors[colorScheme].brand
              : errorText
                ? Colors[colorScheme].error
                : Colors[colorScheme].textSecondary
          }
        />
        <TextInput
          placeholder={placeholder}
          style={styles.input}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          defaultValue={defaultValue}
          keyboardType={keyboardType}
          editable={!disabled}
        />
      </View>
      {errorText && (
        <ThemedText style={styles.errorText} color={Colors[colorScheme].error}>
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
  inputsContainer: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    gap: 16,
    borderRadius: 14,
    backgroundColor: Colors.light.background,
    borderWidth: 1.5,
    borderColor: Colors.light.border,
  },
  input: {
    flex: 1,
    height: "100%",
  },
  errorText: {
    fontSize: 14,
    marginLeft: 4,
    marginTop: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: "right",
  },
});
