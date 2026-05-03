import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { usePremium } from "@/hooks/use-premium";
import { router } from "expo-router";
import { Lock } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  /** What to render when the user is entitled. */
  children: React.ReactNode;
  /** Custom locked-state UI; defaults to a centered upgrade card. */
  fallback?: React.ReactNode;
  /** Optional context for the default fallback's title. */
  featureName?: string;
};

// Wraps any subtree behind the premium entitlement. Use it as the outer
// container for premium-only screens or sections. While the entitlement is
// still loading, we render the locked state to avoid a flash of unlocked
// content for users who aren't paying.
export function PaywallGate({ children, fallback, featureName }: Props) {
  const { isPremium, isLoading } = usePremium();

  if (isPremium) return <>{children}</>;
  if (isLoading) return <>{fallback ?? <DefaultLocked featureName={featureName} loading />}</>;
  return <>{fallback ?? <DefaultLocked featureName={featureName} />}</>;
}

function DefaultLocked({
  featureName,
  loading,
}: {
  featureName?: string;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const onUpgrade = () => {
    router.push("/profile/premium");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.borderLight }]}>
        <View style={[styles.iconWrap, { backgroundColor: theme.brandSoft }]}>
          <Lock color={theme.brand} size={28} />
        </View>
        <ThemedText style={styles.title}>
          {featureName
            ? t("premium.gateTitleNamed", {
                feature: featureName,
                defaultValue: `${featureName} is a premium feature`,
              })
            : t("premium.gateTitle", { defaultValue: "Premium feature" })}
        </ThemedText>
        <ThemedText style={styles.body} type="secondary">
          {t("premium.gateBody", {
            defaultValue:
              "Upgrade to unlock advanced statistics, AI meal photos, voice logging, and more.",
          })}
        </ThemedText>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onUpgrade}
          disabled={loading}
          style={[
            styles.button,
            { backgroundColor: loading ? theme.border : theme.brand },
          ]}
        >
          <ThemedText style={styles.buttonLabel}>
            {t("premium.upgradeCta", { defaultValue: "Upgrade" })}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: Type.sm,
    lineHeight: 20,
    textAlign: "center",
  },
  button: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
    minWidth: 160,
    alignItems: "center",
    marginTop: Spacing.sm,
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: Type.base,
    fontWeight: "700",
  },
});
