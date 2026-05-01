import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

const BaseCard = ({ children }: Props) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <View
      style={[styles.card, { backgroundColor: Colors[colorScheme].background }]}
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
