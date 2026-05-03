import ImageSourceSheet from "@/components/ui/ImageSourceSheet";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import {
  pickFromCamera,
  pickFromLibrary,
  type PickedImage,
} from "@/utils/pickImage";
import { Image } from "expo-image";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export type { PickedImage };

type Props = {
  value: PickedImage | string | null;
  onChange: (next: PickedImage | null) => void;
  uploading?: boolean;
};

export default function FoodImagePicker({ value, onChange, uploading }: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const [sheetOpen, setSheetOpen] = useState(false);

  const previewUri = typeof value === "string" ? value : (value?.uri ?? null);

  const launch = async (kind: "camera" | "library") => {
    try {
      const picked =
        kind === "camera"
          ? await pickFromCamera({ aspect: [1, 1] })
          : await pickFromLibrary({ aspect: [1, 1] });
      if (picked) onChange(picked);
    } catch (err) {
      const message = err instanceof Error ? err.message : t("common.errorGeneric");
      toast.error(message, t("common.error"));
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setSheetOpen(true)}
        disabled={uploading}
        style={[
          styles.tile,
          { backgroundColor: theme.card, borderColor: theme.border },
        ]}
      >
        {previewUri ? (
          <>
            <Image
              source={{ uri: previewUri }}
              style={styles.preview}
              contentFit="cover"
            />
            {uploading && (
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  styles.overlay,
                  { backgroundColor: theme.overlay },
                ]}
              >
                <ActivityIndicator color="#FFFFFF" />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: theme.brand }]}>
              <Camera color="#FFFFFF" size={14} />
            </View>
          </>
        ) : (
          <View style={styles.empty}>
            <View
              style={[styles.emptyIcon, { backgroundColor: theme.brandSoft }]}
            >
              <ImageIcon color={theme.brand} size={20} />
            </View>
            <ThemedText style={styles.emptyTitle}>{t("food.addPhoto")}</ThemedText>
            <ThemedText type="secondary" style={styles.emptyHint}>
              {t("food.cameraOrGallery")}
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>

      <ImageSourceSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onPickCamera={() => launch("camera")}
        onPickLibrary={() => launch("library")}
        onRemove={previewUri ? () => onChange(null) : undefined}
      />
    </>
  );
}

const styles = StyleSheet.create({
  tile: {
    height: 140,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  preview: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: Spacing.sm,
    right: Spacing.sm,
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    alignItems: "center",
    gap: 4,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xs,
  },
  emptyTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  emptyHint: {
    fontSize: Type.xs,
  },
});
