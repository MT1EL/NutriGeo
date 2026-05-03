import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon, X } from "lucide-react-native";
import { useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export type PickedImage = {
  uri: string;
  mimeType?: string;
  fileName?: string;
};

type Props = {
  value: PickedImage | string | null;
  onChange: (next: PickedImage | null) => void;
  uploading?: boolean;
};

export default function FoodImagePicker({
  value,
  onChange,
  uploading,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const [androidSheetOpen, setAndroidSheetOpen] = useState(false);

  const previewUri =
    typeof value === "string" ? value : (value?.uri ?? null);

  const handlePickFromLibrary = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toast.error("გალერეაზე წვდომა აკრძალულია");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets[0]) {
      const a = res.assets[0];
      onChange({
        uri: a.uri,
        mimeType: a.mimeType,
        fileName: a.fileName ?? undefined,
      });
    }
  };

  const handleTakePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      toast.error("კამერაზე წვდომა აკრძალულია");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!res.canceled && res.assets[0]) {
      const a = res.assets[0];
      onChange({
        uri: a.uri,
        mimeType: a.mimeType,
        fileName: a.fileName ?? undefined,
      });
    }
  };

  const presentOptions = () => {
    const options = previewUri
      ? ["გაუქმება", "კამერით გადაღება", "გალერეიდან არჩევა", "წაშლა"]
      : ["გაუქმება", "კამერით გადაღება", "გალერეიდან არჩევა"];
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 0,
          destructiveButtonIndex: previewUri ? 3 : undefined,
        },
        (idx) => {
          if (idx === 1) handleTakePhoto();
          else if (idx === 2) handlePickFromLibrary();
          else if (idx === 3 && previewUri) onChange(null);
        },
      );
    } else {
      setAndroidSheetOpen(true);
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={presentOptions}
        disabled={uploading}
        style={[
          styles.tile,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
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
            <View
              style={[
                styles.editBadge,
                { backgroundColor: theme.brand },
              ]}
            >
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
            <ThemedText style={styles.emptyTitle}>დაამატე ფოტო</ThemedText>
            <ThemedText type="secondary" style={styles.emptyHint}>
              კამერა ან გალერეა
            </ThemedText>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={androidSheetOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAndroidSheetOpen(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setAndroidSheetOpen(false)}
        >
          <Pressable
            style={[styles.androidSheet, { backgroundColor: theme.card }]}
            onPress={(e) => e.stopPropagation()}
          >
            <TouchableOpacity
              style={styles.sheetRow}
              activeOpacity={0.6}
              onPress={() => {
                setAndroidSheetOpen(false);
                handleTakePhoto();
              }}
            >
              <Camera color={theme.text} size={20} />
              <ThemedText style={styles.sheetLabel}>
                კამერით გადაღება
              </ThemedText>
            </TouchableOpacity>
            <View
              style={[styles.divider, { backgroundColor: theme.borderLight }]}
            />
            <TouchableOpacity
              style={styles.sheetRow}
              activeOpacity={0.6}
              onPress={() => {
                setAndroidSheetOpen(false);
                handlePickFromLibrary();
              }}
            >
              <ImageIcon color={theme.text} size={20} />
              <ThemedText style={styles.sheetLabel}>
                გალერეიდან არჩევა
              </ThemedText>
            </TouchableOpacity>
            {previewUri && (
              <>
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: theme.borderLight },
                  ]}
                />
                <TouchableOpacity
                  style={styles.sheetRow}
                  activeOpacity={0.6}
                  onPress={() => {
                    setAndroidSheetOpen(false);
                    onChange(null);
                  }}
                >
                  <X color={theme.error} size={20} />
                  <ThemedText style={styles.sheetLabel} color={theme.error}>
                    წაშლა
                  </ThemedText>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
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
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
    padding: Spacing.lg,
  },
  androidSheet: {
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  sheetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  sheetLabel: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
});
