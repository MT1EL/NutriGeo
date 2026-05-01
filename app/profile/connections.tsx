import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { INTEGRATIONS, Integration } from "@/constants/integrations";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Plug,
  RefreshCw,
} from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  Alert,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Switch,
  TouchableOpacity,
  UIManager,
  useColorScheme,
  View,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ConnectionState = {
  connected: boolean;
  enabledTypes: Set<string>;
};

const initState = (i: Integration): ConnectionState => ({
  connected: !!i.defaultConnected,
  enabledTypes: i.defaultConnected
    ? new Set(i.dataTypes.map((d) => d.key))
    : new Set(),
});

export default function ConnectionsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const [states, setStates] = useState<Record<string, ConnectionState>>(() => {
    const out: Record<string, ConnectionState> = {};
    INTEGRATIONS.forEach((i) => (out[i.id] = initState(i)));
    return out;
  });
  const [expanded, setExpanded] = useState<string | null>("apple-health");

  const connectedCount = useMemo(
    () => Object.values(states).filter((s) => s.connected).length,
    [states]
  );

  const toggleConnected = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStates((prev) => {
      const cur = prev[id];
      const next = !cur.connected;
      return {
        ...prev,
        [id]: {
          connected: next,
          enabledTypes: next
            ? new Set(
                INTEGRATIONS.find((i) => i.id === id)!.dataTypes.map(
                  (d) => d.key
                )
              )
            : new Set(),
        },
      };
    });
    if (id !== expanded) setExpanded(id);
  };

  const toggleType = (id: string, key: string) => {
    setStates((prev) => {
      const cur = prev[id];
      const next = new Set(cur.enabledTypes);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...prev, [id]: { ...cur, enabledTypes: next } };
    });
  };

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((p) => (p === id ? null : id));
  };

  const sync = (name: string) => {
    Alert.alert("სინქრონიზაცია", `${name} განახლდა ახლახან.`);
  };

  const grouped = useMemo(() => {
    const map: Record<string, Integration[]> = {};
    INTEGRATIONS.forEach((i) => {
      if (!map[i.category]) map[i.category] = [];
      map[i.category].push(i);
    });
    return map;
  }, []);

  return (
    <SubScreenLayout
      title="კავშირები"
      subtitle="ჯანმრთელობისა და ფიტნესის აპები"
    >
      <View
        style={[
          styles.banner,
          { backgroundColor: theme.brandSoft },
        ]}
      >
        <View style={[styles.bannerIcon, { backgroundColor: theme.brand }]}>
          <Plug color="#FFFFFF" size={20} />
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.bannerTitle}>
            {connectedCount} დაკავშირებული წყარო
          </ThemedText>
          <ThemedText type="secondary" style={styles.bannerSub}>
            მონაცემი ავტომატურად სინქრონიზდება
          </ThemedText>
        </View>
      </View>

      {Object.entries(grouped).map(([category, items]) => (
        <View key={category} style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.groupTitle} type="secondary">
            {category}
          </ThemedText>
          <View style={{ gap: Spacing.md }}>
            {items.map((i) => {
              const state = states[i.id];
              const isConnected = state.connected;
              const isExpanded = expanded === i.id;
              const tint =
                colorScheme === "dark" ? i.tintDark : i.tint;

              return (
                <BaseCard key={i.id} style={styles.card}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => isConnected && toggleExpand(i.id)}
                    style={styles.headerRow}
                  >
                    <View style={[styles.appIcon, { backgroundColor: tint }]}>
                      <i.Icon color={i.color} size={22} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.appName}>{i.name}</ThemedText>
                      {isConnected ? (
                        <View style={styles.statusRow}>
                          <View
                            style={[
                              styles.dot,
                              { backgroundColor: theme.success },
                            ]}
                          />
                          <ThemedText
                            style={styles.statusText}
                            type="secondary"
                          >
                            დაკავშირებულია · ახლახან
                          </ThemedText>
                        </View>
                      ) : (
                        <ThemedText
                          style={styles.statusText}
                          type="secondary"
                        >
                          {i.description}
                        </ThemedText>
                      )}
                    </View>
                    <Switch
                      value={isConnected}
                      onValueChange={() => toggleConnected(i.id)}
                      trackColor={{ false: theme.border, true: i.color }}
                      thumbColor="#FFFFFF"
                      ios_backgroundColor={theme.border}
                    />
                  </TouchableOpacity>

                  {isConnected && isExpanded && (
                    <View
                      style={[
                        styles.expanded,
                        { borderTopColor: theme.borderLight },
                      ]}
                    >
                      <View style={styles.typesHeader}>
                        <ThemedText
                          style={styles.typesTitle}
                          type="secondary"
                        >
                          სინქრონიზებული მონაცემი
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => sync(i.name)}
                          activeOpacity={0.6}
                          hitSlop={6}
                          style={styles.syncBtn}
                        >
                          <RefreshCw color={theme.brand} size={12} />
                          <ThemedText
                            style={styles.syncText}
                            color={theme.brand}
                          >
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
                              onPress={() => toggleType(i.id, d.key)}
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
                                    backgroundColor: isOn
                                      ? i.color
                                      : theme.border,
                                  },
                                ]}
                              >
                                {isOn && (
                                  <Check color="#FFFFFF" size={10} />
                                )}
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

                  {isConnected && (
                    <TouchableOpacity
                      onPress={() => toggleExpand(i.id)}
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
            })}
          </View>
        </View>
      ))}

      <ThemedText style={styles.footer} type="secondary">
        მონაცემი არ ეთიშება მესამე მხარეს. შეგიძლია ნებისმიერ დროს გათიშო.
      </ThemedText>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  bannerSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  groupTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
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
  footer: {
    fontSize: Type.xs,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
    marginTop: Spacing.md,
  },
});
