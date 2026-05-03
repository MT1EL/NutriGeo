import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useMemo } from "react";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  // ISO YYYY-MM-DD
  value: string;
  // Called with ISO YYYY-MM-DD when user picks a date.
  onChange: (next: string) => void;
  // Optional bounds (also ISO YYYY-MM-DD).
  minimumDate?: string;
  maximumDate?: string;
};

function isoToDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function dateToIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

export default function DatePickerSheet({
  visible,
  onClose,
  value,
  onChange,
  minimumDate,
  maximumDate,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const initial = useMemo(() => isoToDate(value), [value]);
  const minDate = minimumDate ? isoToDate(minimumDate) : undefined;
  const maxDate = maximumDate ? isoToDate(maximumDate) : undefined;

  const handle = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      onClose();
      if (event.type === "set" && selected) onChange(dateToIso(selected));
      return;
    }
    if (selected) onChange(dateToIso(selected));
  };

  if (!visible) return null;

  if (Platform.OS === "android") {
    return (
      <DateTimePicker
        value={initial}
        mode="date"
        display="default"
        minimumDate={minDate}
        maximumDate={maxDate}
        onChange={handle}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: theme.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          <DateTimePicker
            value={initial}
            mode="date"
            display="spinner"
            minimumDate={minDate}
            maximumDate={maxDate}
            onChange={handle}
            themeVariant={colorScheme}
            textColor={theme.text}
            style={styles.picker}
          />
          <TouchableOpacity
            onPress={onClose}
            style={[styles.done, { backgroundColor: theme.brand }]}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.doneText} color={theme.textOnBrand}>
              მზადაა
            </ThemedText>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    gap: Spacing.md,
  },
  picker: {
    alignSelf: "stretch",
    width: "100%",
  },
  done: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: Radius.pill,
  },
  doneText: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
