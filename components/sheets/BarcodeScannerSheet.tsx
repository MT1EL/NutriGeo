import { getFoodByBarcode } from "@/api/foods";
import type { Food } from "@/api/types";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { CameraView, useCameraPermissions } from "expo-camera";
import { ScanBarcode, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  onFoodFound: (food: Food) => void;
};

const SCAN_TYPES = [
  "ean13",
  "ean8",
  "upc_a",
  "upc_e",
  "code128",
  "code39",
  "qr",
] as const;

export default function BarcodeScannerSheet({
  visible,
  onClose,
  onFoodFound,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const [permission, requestPermission] = useCameraPermissions();
  const [looking, setLooking] = useState(false);
  // Once we've handed a barcode to the API we ignore further scans until the
  // sheet closes/reopens, otherwise expo-camera fires onBarcodeScanned every
  // frame and we'd dispatch dozens of requests.
  const handledRef = useRef(false);

  useEffect(() => {
    if (visible) {
      handledRef.current = false;
      setLooking(false);
    }
  }, [visible]);

  const handleScanned = async ({ data }: { data: string }) => {
    if (handledRef.current || !data) return;
    handledRef.current = true;
    setLooking(true);
    try {
      const res = await getFoodByBarcode(data);
      if (res.data) {
        onFoodFound(res.data);
        onClose();
      } else {
        toast.error(t("barcode.notFound"));
        setLooking(false);
        // Allow the user to try again without closing the sheet.
        handledRef.current = false;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("common.error");
      toast.error(msg, t("common.error"));
      setLooking(false);
      handledRef.current = false;
    }
  };

  const renderBody = () => {
    if (!permission) return null;

    if (!permission.granted) {
      return (
        <View style={styles.permissionWrap}>
          <View style={[styles.icon, { backgroundColor: theme.brandSoft }]}>
            <ScanBarcode color={theme.brand} size={28} />
          </View>
          <ThemedText style={styles.permTitle}>
            {t("barcode.needCamera")}
          </ThemedText>
          <ThemedText type="secondary" style={styles.permText}>
            {t("barcode.cameraReason")}
          </ThemedText>
          <Button onPress={requestPermission}>{t("barcode.grant")}</Button>
        </View>
      );
    }

    return (
      <View style={styles.cameraWrap}>
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: [...SCAN_TYPES],
          }}
          onBarcodeScanned={looking ? undefined : handleScanned}
        />
        <View style={styles.frameOverlay} pointerEvents="none">
          <View style={[styles.frame, { borderColor: "#FFFFFF" }]} />
        </View>
        <View style={styles.hintWrap} pointerEvents="none">
          <ThemedText style={styles.hintText} color="#FFFFFF">
            {looking ? t("barcode.checking") : t("barcode.aim")}
          </ThemedText>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
      presentationStyle={Platform.OS === "ios" ? "pageSheet" : "fullScreen"}
    >
      <SafeAreaView
        edges={["top"]}
        style={[styles.root, { backgroundColor: theme.background }]}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>{t("barcode.title")}</ThemedText>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.iconBtn, { backgroundColor: theme.borderLight }]}
            hitSlop={6}
            activeOpacity={0.7}
          >
            <X color={theme.text} size={18} />
          </TouchableOpacity>
        </View>
        {renderBody()}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  icon: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  permTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  permText: {
    fontSize: Type.sm,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  cameraWrap: {
    flex: 1,
    backgroundColor: "#000",
    overflow: "hidden",
  },
  frameOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    width: 260,
    height: 180,
    borderWidth: 2,
    borderRadius: Radius.lg,
    backgroundColor: "transparent",
  },
  hintWrap: {
    position: "absolute",
    bottom: 48,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  hintText: {
    fontSize: Type.sm,
    fontWeight: "700",
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    overflow: "hidden",
  },
});
