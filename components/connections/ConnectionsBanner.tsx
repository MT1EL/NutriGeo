import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Plug } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  count: number;
};

export default function ConnectionsBanner({ count }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.banner, { backgroundColor: theme.brandSoft }]}>
      <View style={[styles.icon, { backgroundColor: theme.brand }]}>
        <Plug color="#FFFFFF" size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.title}>
          {count} დაკავშირებული წყარო
        </ThemedText>
        <ThemedText type="secondary" style={styles.sub}>
          მონაცემი ავტომატურად სინქრონიზდება
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  sub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
});
