import ThemedText from "@/components/ui/ThemedText";
import { Spacing, Type } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

export default function HomeBodyEmpty() {
  return (
    <View style={styles.container}>
      <ThemedText type="secondary" style={styles.text}>
        ვერ ჩავტვირთეთ დღეს მონაცემი. სცადე მოგვიანებით.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.huge,
    alignItems: "center",
  },
  text: {
    fontSize: Type.sm,
    textAlign: "center",
  },
});
