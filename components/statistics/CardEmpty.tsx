import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import { LucideIcon } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

type Props = {
  Icon: LucideIcon;
  title: string;
  hint?: string;
  color: string;
  tint: string;
};

export default function CardEmpty({ Icon, title, hint, color, tint }: Props) {
  return (
    <View style={styles.container}>
      <View style={[styles.icon, { backgroundColor: tint }]}>
        <Icon color={color} size={22} />
      </View>
      <ThemedText style={styles.title}>{title}</ThemedText>
      {hint ? (
        <ThemedText type="secondary" style={styles.hint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: Type.base,
    fontWeight: "700",
    textAlign: "center",
  },
  hint: {
    fontSize: Type.xs,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: Spacing.md,
  },
});
