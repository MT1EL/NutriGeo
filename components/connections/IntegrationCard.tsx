import BaseCard from "@/components/cards/BaseCard";
import ThemedText from "@/components/ui/ThemedText";
import type { Integration } from "@/constants/integrations";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import type { ConnectionState } from "@/hooks/use-connections";
import { Check, ChevronDown, ChevronUp, RefreshCw } from "lucide-react-native";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  integration: Integration;
  state: ConnectionState;
  isExpanded: boolean;
  onToggleConnected: () => void;
  onToggleType: (key: string) => void;
  onToggleExpand: () => void;
};

export default function IntegrationCard({
  integration: i,
  state,
  isExpanded,
  onToggleConnected,
  onToggleType,
  onToggleExpand,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const tint = colorScheme === "dark" ? i.tintDark : i.tint;

  return (
    <BaseCard style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => state.connected && onToggleExpand()}
        style={styles.headerRow}
      >
        <View style={[styles.appIcon, { backgroundColor: tint }]}>
          <i.Icon color={i.color} size={22} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.appName}>{i.name}</ThemedText>
          {state.connected ? (
            <View style={styles.statusRow}>
              <View
                style={[styles.dot, { backgroundColor: theme.success }]}
              />
              <ThemedText style={styles.statusText} type="secondary">
                დაკავშირებულია · ახლახან
              </ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.statusText} type="secondary">
              {i.description}
            </ThemedText>
          )}
        </View>
        <Switch
          value={state.connected}
          onValueChange={onToggleConnected}
          trackColor={{ false: theme.border, true: i.color }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={theme.border}
        />
      </TouchableOpacity>

      {state.connected && isExpanded && (
        <View
          style={[styles.expanded, { borderTopColor: theme.borderLight }]}
        >
          <View style={styles.typesHeader}>
            <ThemedText style={styles.typesTitle} type="secondary">
              სინქრონიზებული მონაცემი
            </ThemedText>
            <TouchableOpacity
              onPress={() =>
                Alert.alert("სინქრონიზაცია", `${i.name} განახლდა ახლახან.`)
              }
              activeOpacity={0.6}
              hitSlop={6}
              style={styles.syncBtn}
            >
              <RefreshCw color={theme.brand} size={12} />
              <ThemedText style={styles.syncText} color={theme.brand}>
                სინქრონი
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.typesGrid}>
            {i.dataTypes.map((d) => {
              const isOn = state.enabledTypes.has(d.key);
              return (
                <TouchableOpacity
                  key={d.key}
                  activeOpacity={0.7}
                  onPress={() => onToggleType(d.key)}
                  style={[
                    styles.typeChip,
                    {
                      backgroundColor: isOn
                        ? i.color + "12"
                        : theme.borderLight,
                      borderColor: isOn ? i.color : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.typeCheckBox,
                      {
                        backgroundColor: isOn ? i.color : theme.border,
                      },
                    ]}
                  >
                    {isOn && <Check color="#FFFFFF" size={10} />}
                  </View>
                  <ThemedText
                    style={styles.typeText}
                    color={isOn ? theme.text : theme.textSecondary}
                  >
                    {d.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {state.connected && (
        <TouchableOpacity
          onPress={onToggleExpand}
          style={styles.expandBtn}
          hitSlop={6}
        >
          {isExpanded ? (
            <ChevronUp color={theme.textSecondary} size={14} />
          ) : (
            <ChevronDown color={theme.textSecondary} size={14} />
          )}
        </TouchableOpacity>
      )}
    </BaseCard>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.md,
    gap: 0,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: Type.xs,
  },
  expanded: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  typesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typesTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  syncBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  syncText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  typesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  typeCheckBox: {
    width: 14,
    height: 14,
    borderRadius: Radius.sm / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  typeText: {
    fontSize: Type.xs,
    fontWeight: "600",
  },
  expandBtn: {
    alignSelf: "center",
    marginTop: Spacing.xs,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
  },
});
