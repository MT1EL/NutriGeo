import { Colors } from "@/constants/theme";
import React from "react";
import { Text, TextProps, TextStyle, useColorScheme } from "react-native";

type Props = TextProps & {
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  type?: "primary" | "secondary" | "text";
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
  }

  return (
    <Text {...rest} style={[{ color: color || textColor }, style]}>
      {children}
    </Text>
  );
};

export default ThemedText;
