import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type ChipProps = {
  label: string;
  active: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export function Chip({ label, active, disabled, onPress }: ChipProps) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.chip,
        {
          backgroundColor: active ? theme.brand : theme.card,
          borderColor: active ? theme.brand : theme.border,
        },
        disabled && !active ? { opacity: 0.4 } : null,
      ]}
    >
      <ThemedText style={styles.text} color={active ? "#FFFFFF" : theme.text}>
        {label}
      </ThemedText>
    </TouchableOpacity>
  );
}

type Option<T> = { value: T; label: string; disabled?: boolean };

type ChipRowProps<T> = {
  options: Option<T>[];
  isActive: (value: T) => boolean;
  onSelect: (value: T) => void;
};

// Multi-select or single-select chip row. Caller decides which by how
// isActive/onSelect are wired (single = compare to current, multi = check inclusion).
export function ChipRow<T>({ options, isActive, onSelect }: ChipRowProps<T>) {
  return (
    <View style={styles.wrap}>
      {options.map((opt, i) => (
        <Chip
          key={String(opt.value) + i}
          label={opt.label}
          active={isActive(opt.value)}
          disabled={opt.disabled}
          onPress={() => onSelect(opt.value)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: { fontSize: Type.sm, fontWeight: "700" },
});
