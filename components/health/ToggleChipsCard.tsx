import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { LucideIcon } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export type ChipItem = { key: string; label: string; Icon: LucideIcon };

type Props = {
  title: string;
  caption: string;
  items: ChipItem[];
  selected: Set<string>;
  onToggle: (key: string) => void;
  // Active chip color — bg = `${color}12`, text/icon/border = color.
  // Pass theme.error for "danger"-styled (allergies), theme.brand for neutral.
  activeColor: string;
  activeBg?: string;
};

export default function ToggleChipsCard({
  title,
  caption,
  items,
  selected,
  onToggle,
  activeColor,
  activeBg,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <BaseCard>
      <View style={{ gap: Spacing.xs + 2 }}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText type="secondary" style={styles.caption}>
          {caption}
        </ThemedText>
      </View>
      <View style={styles.wrap}>
        {items.map(({ key, label, Icon }) => {
          const isActive = selected.has(key);
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.85}
              onPress={() => onToggle(key)}
              style={[
                styles.chip,
                {
                  backgroundColor: isActive
                    ? activeBg ?? activeColor + "12"
                    : theme.card,
                  borderColor: isActive ? activeColor : theme.border,
                },
              ]}
            >
              <Icon
                color={isActive ? activeColor : theme.textSecondary}
                size={14}
              />
              <ThemedText
                style={styles.label}
                color={isActive ? activeColor : theme.text}
              >
                {label}
              </ThemedText>
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
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  label: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
