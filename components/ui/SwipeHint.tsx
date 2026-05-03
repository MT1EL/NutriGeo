import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { ArrowLeft } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  text?: string;
};

export default function SwipeHint({
  text = "გადასწიე ბარათი მარცხნივ",
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.row, { backgroundColor: theme.borderLight }]}>
      <ArrowLeft color={theme.textSecondary} size={14} />
      <ThemedText type="secondary" style={styles.text}>
        {text}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs + 2,
    alignSelf: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  text: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
});
