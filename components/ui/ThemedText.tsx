import { Colors } from "@/constants/theme";
import React from "react";
import { Text, TextProps, TextStyle, useColorScheme } from "react-native";

type Props = TextProps & {
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  type?: "primary" | "secondary" | "text" | "error";
  color?: string;
};

const ThemedText = ({
  children,
  type = "text",
  color,
  style,
  ...rest
}: Props) => {
  const colorScheme = useColorScheme() || "light";

  let textColor = Colors[colorScheme].text;
  if (type === "primary") {
    textColor = Colors[colorScheme].text;
  } else if (type === "secondary") {
    textColor = Colors[colorScheme].textSecondary;
  } else if (type === "error") {
    textColor = Colors[colorScheme].error;
  }

  return (
    <Text {...rest} style={[{ color: color || textColor }, style]}>
      {children}
    </Text>
  );
};

export default ThemedText;
