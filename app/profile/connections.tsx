import ConnectionsBanner from "@/components/connections/ConnectionsBanner";
import IntegrationCard from "@/components/connections/IntegrationCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Spacing, Type } from "@/constants/theme";
import { useConnections } from "@/hooks/use-connections";
import { StyleSheet, View } from "react-native";

export default function ConnectionsScreen() {
  const {
    states,
    expanded,
    connectedCount,
    grouped,
    toggleConnected,
    toggleType,
    toggleExpand,
  } = useConnections();

  return (
    <SubScreenLayout
      title="კავშირები"
      subtitle="ჯანმრთელობისა და ფიტნესის აპები"
    >
      <ConnectionsBanner count={connectedCount} />

      {Object.entries(grouped).map(([category, items]) => (
        <View key={category} style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.groupTitle} type="secondary">
            {category}
          </ThemedText>
          <View style={{ gap: Spacing.md }}>
            {items.map((i) => (
              <IntegrationCard
                key={i.id}
                integration={i}
                state={states[i.id]}
                isExpanded={expanded === i.id}
                onToggleConnected={() => toggleConnected(i.id)}
                onToggleType={(key) => toggleType(i.id, key)}
                onToggleExpand={() => toggleExpand(i.id)}
              />
            ))}
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
  groupTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  footer: {
    fontSize: Type.xs,
    textAlign: "center",
    paddingHorizontal: Spacing.md,
    lineHeight: 18,
    marginTop: Spacing.md,
  },
});
