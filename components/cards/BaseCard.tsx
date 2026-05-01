import { Colors } from "@/constants/theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const BaseCard = ({ children, style }: Props) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: Colors[colorScheme].background },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default BaseCard;
const styles = StyleSheet.create({
  card: {
    padding: 20,
    gap: 20,
    borderRadius: 20,
  },
});
