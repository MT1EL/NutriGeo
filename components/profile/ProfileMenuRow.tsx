import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Href, router } from "expo-router";
import { ChevronRight, LucideIcon } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  Icon: LucideIcon;
  label: string;
  hint?: string;
  tint: string;
  iconColor: string;
  href?: Href;
};

export default function ProfileMenuRow({
  Icon,
  label,
  hint,
  tint,
  iconColor,
  href,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.row}
      onPress={() => href && router.push(href)}
    >
      <View style={[styles.icon, { backgroundColor: tint }]}>
        <Icon color={iconColor} size={18} />
      </View>
      <View style={{ flex: 1 }}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        {hint && (
          <ThemedText type="secondary" style={styles.hint}>
            {hint}
          </ThemedText>
        )}
      </View>
      <ChevronRight color={theme.textSecondary} size={18} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    gap: Spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  hint: {
    fontSize: Type.xs,
    marginTop: 2,
  },
});
