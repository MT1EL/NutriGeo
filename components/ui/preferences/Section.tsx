import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import React, { useState } from "react";
import { Pressable, StyleSheet, useColorScheme, View } from "react-native";

type Props = {
  Icon: React.ComponentType<{ color?: string; size?: number }>;
  title: string;
  hint?: string;
  badge?: string;
  errorText?: string;
  collapsible?: boolean;
  children: React.ReactNode;
};

export default function Section({
  Icon,
  title,
  hint,
  badge,
  errorText,
  collapsible,
  children,
}: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [open, setOpen] = useState(!collapsible);

  return (
    <View style={styles.section}>
      <Pressable
        onPress={collapsible ? () => setOpen((o) => !o) : undefined}
        style={styles.header}
      >
        <View style={[styles.icon, { backgroundColor: theme.brandSoft }]}>
          <Icon color={theme.brand} size={14} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {badge ? (
              <ThemedText type="secondary" style={styles.badge}>
                {badge}
              </ThemedText>
            ) : null}
          </View>
          {hint ? (
            <ThemedText type="secondary" style={styles.hint}>
              {hint}
            </ThemedText>
          ) : null}
        </View>
        {collapsible ? (
          <ThemedText type="secondary" style={styles.toggle}>
            {open ? "−" : "+"}
          </ThemedText>
        ) : null}
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
      {errorText ? (
        <ThemedText style={styles.error} color={theme.error}>
          {errorText}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.md },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.md,
  },
  icon: {
    padding: 7,
    borderRadius: Radius.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: { fontSize: Type.base, fontWeight: "800" },
  badge: { fontSize: Type.xs, fontWeight: "700" },
  hint: {
    fontSize: Type.xs,
    marginTop: 4,
    lineHeight: 18,
  },
  body: { paddingTop: Spacing.xs },
  toggle: {
    fontSize: Type.lg,
    fontWeight: "700",
    paddingHorizontal: Spacing.sm,
  },
  error: {
    fontSize: Type.xs,
    marginTop: 4,
    marginLeft: Spacing.xs,
  },
});
