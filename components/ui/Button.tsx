import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  backgroundColor?: string;
  color?: string;
};

const Button = ({ children, onPress, backgroundColor, color }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.button, backgroundColor && { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.buttonLabel, color && { color }]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.brand,
    padding: 16,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonLabel: {
    color: Colors.light.background,
    fontSize: 18,
    fontWeight: "semibold",
  },
});
