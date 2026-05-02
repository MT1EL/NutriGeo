import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Camera,
  Mic,
  ScanBarcode,
  Sparkles,
} from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const QUICK_ACTIONS = [
  {
    Icon: ScanBarcode,
    label: "ბარკოდი",
    color: "#5B6CE0",
    tint: "#EEF0FB",
    tintDark: "#222B4A",
  },
  {
    Icon: Camera,
    label: "ფოტო",
    color: "#2FB871",
    tint: "#E8F6EC",
    tintDark: "#1F3A28",
  },
  {
    Icon: Mic,
    label: "ხმოვანი",
    color: "#E85A8C",
    tint: "#FCEAF1",
    tintDark: "#3A2030",
  },
  {
    Icon: Sparkles,
    label: "AI",
    color: "#7C5CFF",
    tint: "#F0EBFE",
    tintDark: "#2A1F4A",
  },
];

export default function QuickActionsRow() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.sectionTitle}>სწრაფი ჩაწერა</ThemedText>
      <View style={styles.row}>
        {QUICK_ACTIONS.map(({ Icon, label, color, tint, tintDark }) => (
          <TouchableOpacity
            key={label}
            activeOpacity={0.85}
            style={[
              styles.tile,
              {
                backgroundColor: theme.card,
                borderColor: theme.borderLight,
              },
            ]}
          >
            <View
              style={[
                styles.icon,
                {
                  backgroundColor: colorScheme === "dark" ? tintDark : tint,
                },
              ]}
            >
              <Icon color={color} size={20} />
            </View>
            <ThemedText style={styles.label}>{label}</ThemedText>
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
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
});
