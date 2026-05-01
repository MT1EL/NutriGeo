import { Colors } from "@/constants/theme";
import React from "react";
import { Text, TextStyle, useColorScheme } from "react-native";

type Props = {
  style?: TextStyle;
  children: React.ReactNode;
  type?: "primary" | "secondary" | "text";
  color?: string;
};

const ThemedText = ({ children, type = "text", color, style }: Props) => {
  const colorScheme = useColorScheme() || "light";

  let textColor = Colors[colorScheme].text;
  if (type === "primary") {
    textColor = Colors[colorScheme].text;
  } else if (type === "secondary") {
    textColor = Colors[colorScheme].textSecondary;
  }

  return <Text style={[style, { color: color || textColor }]}>{children}</Text>;
};

export default ThemedText;
