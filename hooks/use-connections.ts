import { INTEGRATIONS, Integration } from "@/constants/integrations";
import { useMemo, useState } from "react";
import { LayoutAnimation, Platform, UIManager } from "react-native";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type ConnectionState = {
  connected: boolean;
  enabledTypes: Set<string>;
};

const initState = (i: Integration): ConnectionState => ({
  connected: !!i.defaultConnected,
  enabledTypes: i.defaultConnected
    ? new Set(i.dataTypes.map((d) => d.key))
    : new Set(),
});

export function useConnections() {
  const [states, setStates] = useState<Record<string, ConnectionState>>(() => {
    const out: Record<string, ConnectionState> = {};
    INTEGRATIONS.forEach((i) => (out[i.id] = initState(i)));
    return out;
  });
  const [expanded, setExpanded] = useState<string | null>("apple-health");

  const connectedCount = useMemo(
    () => Object.values(states).filter((s) => s.connected).length,
    [states],
  );

  const grouped = useMemo(() => {
    const map: Record<string, Integration[]> = {};
    INTEGRATIONS.forEach((i) => {
      if (!map[i.category]) map[i.category] = [];
      map[i.category].push(i);
    });
    return map;
  }, []);

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
                  (d) => d.key,
                ),
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

  return {
    states,
    expanded,
    connectedCount,
    grouped,
    toggleConnected,
    toggleType,
    toggleExpand,
  };
}
