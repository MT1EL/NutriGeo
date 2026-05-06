import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Minus, Plus } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  unitLabel?: string;
};

export default function Stepper({
  value,
  min,
  max,
  onChange,
  unitLabel,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const adjust = (delta: number) => {
    onChange(Math.min(max, Math.max(min, value + delta)));
  };

  const atMin = value <= min;
  const atMax = value >= max;

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => adjust(-1)}
        activeOpacity={0.7}
        disabled={atMin}
        style={[
          styles.btn,
          { backgroundColor: theme.brandSoft },
          atMin && { opacity: 0.4 },
        ]}
        hitSlop={6}
      >
        <Minus color={theme.brand} size={18} />
      </TouchableOpacity>

      <View style={styles.valueWrap}>
        <ThemedText style={styles.value}>{value}</ThemedText>
        {unitLabel ? (
          <ThemedText type="secondary" style={styles.unit}>
            {unitLabel}
          </ThemedText>
        ) : null}
      </View>

      <TouchableOpacity
        onPress={() => adjust(1)}
        activeOpacity={0.7}
        disabled={atMax}
        style={[
          styles.btn,
          { backgroundColor: theme.brandSoft },
          atMax && { opacity: 0.4 },
        ]}
        hitSlop={6}
      >
        <Plus color={theme.brand} size={18} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.lg,
  },
  btn: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  valueWrap: { flex: 1, alignItems: "center" },
  value: { fontSize: Type.xxl, fontWeight: "800" },
  unit: { fontSize: Type.xs, marginTop: 2 },
});
