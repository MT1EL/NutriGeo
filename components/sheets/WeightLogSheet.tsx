import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useLogWeight } from "@/hooks/use-log-weight";
import { Minus, Plus, Scale, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STEP = 0.1;
const MIN_KG = 20;
const MAX_KG = 300;

type Props = {
  visible: boolean;
  onClose: () => void;
  // Pre-fills the input — usually the most recent logged weight or
  // profile.weight_kg.
  defaultWeightKg: number;
  // Used in the title to remind the user which day they're logging to.
  dateLabel: string;
};

function clamp(n: number): number {
  return Math.min(MAX_KG, Math.max(MIN_KG, n));
}

function formatWeight(n: number): string {
  return n.toFixed(1);
}

export default function WeightLogSheet({
  visible,
  onClose,
  defaultWeightKg,
  dateLabel,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const mutation = useLogWeight();

  const [value, setValue] = useState<string>(formatWeight(defaultWeightKg || 70));

  // Reset to the latest default whenever the sheet opens for a new context.
  useEffect(() => {
    if (visible) setValue(formatWeight(defaultWeightKg || 70));
  }, [visible, defaultWeightKg]);

  const parsed = parseFloat(value.replace(",", "."));
  const isValid = !Number.isNaN(parsed) && parsed >= MIN_KG && parsed <= MAX_KG;

  const adjust = (delta: number) => {
    const base = isValid ? parsed : defaultWeightKg || 70;
    setValue(formatWeight(clamp(base + delta)));
  };

  const handleSave = () => {
    if (!isValid) return;
    mutation.mutate(parseFloat(parsed.toFixed(1)), {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[styles.sheet, { backgroundColor: theme.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={["bottom"]} style={styles.content}>
              <View style={styles.handleRow}>
                <View
                  style={[styles.handle, { backgroundColor: theme.border }]}
                />
              </View>

              <View style={styles.headerRow}>
                <View style={[styles.icon, { backgroundColor: theme.brandSoft }]}>
                  <Scale color={theme.brand} size={20} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText style={styles.title}>წონის ჩაწერა</ThemedText>
                  <ThemedText type="secondary" style={styles.subtitle}>
                    {dateLabel}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={6}
                  style={[styles.closeBtn, { backgroundColor: theme.borderLight }]}
                  activeOpacity={0.7}
                >
                  <X color={theme.text} size={18} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputRow}>
                <TouchableOpacity
                  onPress={() => adjust(-STEP)}
                  activeOpacity={0.7}
                  style={[styles.stepBtn, { backgroundColor: theme.brandSoft }]}
                  hitSlop={6}
                >
                  <Minus color={theme.brand} size={20} />
                </TouchableOpacity>

                <View style={styles.amountWrap}>
                  <TextInput
                    value={value}
                    onChangeText={setValue}
                    keyboardType="decimal-pad"
                    selectTextOnFocus
                    style={[styles.amountInput, { color: theme.text }]}
                    returnKeyType="done"
                  />
                  <ThemedText style={styles.amountUnit} type="secondary">
                    კგ
                  </ThemedText>
                </View>

                <TouchableOpacity
                  onPress={() => adjust(STEP)}
                  activeOpacity={0.7}
                  style={[styles.stepBtn, { backgroundColor: theme.brandSoft }]}
                  hitSlop={6}
                >
                  <Plus color={theme.brand} size={20} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.85}
                disabled={!isValid || mutation.isPending}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: theme.brand,
                    opacity: !isValid || mutation.isPending ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={styles.primaryBtnText}
                  color={theme.textOnBrand}
                >
                  {mutation.isPending ? "ინახება..." : "შენახვა"}
                </ThemedText>
              </TouchableOpacity>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
  },
  content: {
    gap: Spacing.lg,
  },
  handleRow: {
    alignItems: "center",
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  stepBtn: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  amountWrap: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  amountInput: {
    fontSize: Type.xxxl,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.5,
    minWidth: 80,
    paddingVertical: 0,
  },
  amountUnit: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  primaryBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  primaryBtnText: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
