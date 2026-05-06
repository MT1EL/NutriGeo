import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Camera, Image as ImageIcon, Trash2 } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickCamera: () => void;
  onPickLibrary: () => void;
  onRemove?: () => void;
  title?: string;
};

export default function ImageSourceSheet({
  visible,
  onClose,
  onPickCamera,
  onPickLibrary,
  onRemove,
  title,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const resolvedTitle = title ?? t("food.photoPickTitle");
  const theme = Colors[colorScheme];
  const { bottom } = useSafeAreaInsets();

  // Action selected before the modal closed; fired once the Modal has fully
  // animated out so iOS will actually present the OS picker (the picker is
  // dropped silently when launched over a still-dismissing Modal).
  const pendingActionRef = useRef<(() => void) | null>(null);

  // Android doesn't fire Modal.onDismiss, so fall back to a setTimeout once
  // `visible` flips to false.
  useEffect(() => {
    if (visible) return;
    if (Platform.OS === "ios") return; // handled by onDismiss
    const action = pendingActionRef.current;
    if (!action) return;
    pendingActionRef.current = null;
    const id = setTimeout(action, 0);
    return () => clearTimeout(id);
  }, [visible]);

  const close = () => onClose();
  const pick = (fn: () => void) => () => {
    pendingActionRef.current = fn;
    onClose();
  };
  const handleDismissed = () => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
      onDismiss={handleDismissed}
      statusBarTranslucent
    >
      <Pressable style={styles.backdrop} onPress={close}>
        <Pressable
          style={[
            styles.sheet,
            {
              backgroundColor: theme.surface,
              paddingBottom: Math.max(bottom, Spacing.lg),
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <ThemedText style={styles.title}>{resolvedTitle}</ThemedText>

          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pick(onPickCamera)}
              style={[
                styles.tile,
                { backgroundColor: theme.card, borderColor: theme.borderLight },
              ]}
            >
              <View
                style={[styles.tileIcon, { backgroundColor: theme.brandSoft }]}
              >
                <Camera color={theme.brand} size={22} />
              </View>
              <ThemedText style={styles.tileLabel}>
                {t("imagePicker.camera")}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={pick(onPickLibrary)}
              style={[
                styles.tile,
                { backgroundColor: theme.card, borderColor: theme.borderLight },
              ]}
            >
              <View
                style={[styles.tileIcon, { backgroundColor: theme.brandSoft }]}
              >
                <ImageIcon color={theme.brand} size={22} />
              </View>
              <ThemedText style={styles.tileLabel}>
                {t("imagePicker.gallery")}
              </ThemedText>
            </TouchableOpacity>
          </View>

          {onRemove && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={pick(onRemove)}
              style={[
                styles.removeRow,
                { backgroundColor: theme.error + "1A" },
              ]}
            >
              <Trash2 color={theme.error} size={18} />
              <ThemedText style={styles.removeLabel} color={theme.error}>
                {t("imagePicker.remove")}
              </ThemedText>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={close}
            style={styles.cancel}
          >
            <ThemedText type="secondary" style={styles.cancelLabel}>
              {t("common.cancel")}
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
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
    alignSelf: "center",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
    textAlign: "center",
    marginTop: Spacing.xs,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  tile: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.sm,
  },
  tileIcon: {
    width: 48,
    height: 48,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  removeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
  },
  removeLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  cancel: {
    paddingVertical: Spacing.md,
    alignItems: "center",
  },
  cancelLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
