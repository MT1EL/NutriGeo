import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { ScanBarcode, Zap } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  onScanBarcode: () => void;
  onQuickAdd: () => void;
};

export default function QuickActionsRow({
  onScanBarcode,
  onQuickAdd,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const tiles = [
    {
      key: "barcode",
      Icon: ScanBarcode,
      label: "ბარკოდი",
      hint: "შეფუთულ პროდუქტებს",
      color: "#5B6CE0",
      tint: colorScheme === "dark" ? "#222B4A" : "#EEF0FB",
      onPress: onScanBarcode,
    },
    {
      key: "quick",
      Icon: Zap,
      label: "სწრაფი ჩაწერა",
      hint: "უბრალოდ კალორია",
      color: "#E8A02C",
      tint: colorScheme === "dark" ? "#3A2E10" : "#FEF6E4",
      onPress: onQuickAdd,
    },
  ];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.sectionTitle}>სწრაფი ჩაწერა</ThemedText>
      <View style={styles.row}>
        {tiles.map(({ key, Icon, label, hint, color, tint, onPress }) => (
          <TouchableOpacity
            key={key}
            activeOpacity={0.85}
            onPress={onPress}
            style={[
              styles.tile,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderLight,
              },
            ]}
          >
            <View style={[styles.icon, { backgroundColor: tint }]}>
              <Icon color={color} size={20} />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText style={styles.label}>{label}</ThemedText>
              <ThemedText type="secondary" style={styles.hint}>
                {hint}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  tile: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  hint: {
    fontSize: 11,
    marginTop: 1,
  },
});
