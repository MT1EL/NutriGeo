import type { Diet } from "@/api";
import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Apple, Beef, Check, Leaf, LucideIcon, Sprout } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const OPTIONS: { key: Diet; label: string; Icon: LucideIcon; color: string }[] =
  [
    { key: "none", label: "ჩვეულებრივი", Icon: Apple, color: "#64748B" },
    { key: "vegetarian", label: "ვეგეტარიანული", Icon: Sprout, color: "#34A867" },
    { key: "vegan", label: "ვეგანური", Icon: Leaf, color: "#16A34A" },
    { key: "keto", label: "კეტო", Icon: Beef, color: "#7C5CFF" },
  ];

type Props = {
  value: Diet;
  onChange: (next: Diet) => void;
};

export default function DietPicker({ value, onChange }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <BaseCard>
      <View style={{ gap: Spacing.xs + 2 }}>
        <ThemedText style={styles.title}>დიეტური სტილი</ThemedText>
        <ThemedText type="secondary" style={styles.caption}>
          გავლენას მოახდენს რეცეპტების რეკომენდაციაზე
        </ThemedText>
      </View>
      <View style={styles.list}>
        {OPTIONS.map(({ key, label, Icon, color }) => {
          const isActive = value === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              activeOpacity={0.85}
              style={[
                styles.row,
                {
                  borderColor: isActive ? color : theme.border,
                  backgroundColor: isActive ? color + "12" : theme.card,
                },
              ]}
            >
              <View style={[styles.icon, { backgroundColor: color + "22" }]}>
                <Icon color={color} size={18} />
              </View>
              <ThemedText style={styles.label}>{label}</ThemedText>
              {isActive && (
                <View style={[styles.check, { backgroundColor: color }]}>
                  <Check color="#FFFFFF" size={14} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  caption: {
    fontSize: Type.xs,
  },
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    flex: 1,
    fontSize: Type.base,
    fontWeight: "600",
  },
  check: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
