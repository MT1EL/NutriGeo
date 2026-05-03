import ThemedText from "@/components/ui/ThemedText";
import { Spacing, Type } from "@/constants/theme";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function HomeBodyEmpty() {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <ThemedText type="secondary" style={styles.text}>
        {t("home.loadFailed")}
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
