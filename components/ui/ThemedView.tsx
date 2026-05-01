import { Colors } from "@/constants/theme";
import React from "react";
import { StyleProp, useColorScheme, View, ViewStyle } from "react-native";

type Props = {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  backgroundColor?: string;
};

const ThemedView = ({ children, style, backgroundColor }: Props) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <View
      style={[
        style,
        { backgroundColor: backgroundColor || Colors[colorScheme].background },
      ]}
    >
      {children}
    </View>
  );
};

export default ThemedView;
