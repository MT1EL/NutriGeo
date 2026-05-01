import React from "react";
import { StyleSheet, View } from "react-native";
import ThemedText from "../ui/ThemedText";
type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const WizzardContentLayout = ({ title, subtitle, children }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle && (
          <ThemedText type="secondary" style={{ textAlign: "center" }}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      {children}
    </View>
  );
};

export default WizzardContentLayout;
const styles = StyleSheet.create({
  container: {
    gap: 32,
    flex: 1,
    justifyContent: "center",
  },
  titleContainer: {
    gap: 14,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
});
