import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { usePremium } from "@/hooks/use-premium";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Lock } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
};

// Renders `children` always so the layout is preserved, but stacks a blur
// over them when the user isn't entitled. Pair with <PaywallBlurOverlay />
// at the screen-container level for the centered upgrade CTA.
export function PaywallBlur({ children, style, intensity = 30 }: Props) {
  const { isPremium } = usePremium();
  const colorScheme = useColorScheme() || "light";

  if (isPremium) return <>{children}</>;

  return (
    <View style={[styles.wrap, style]}>
      <View pointerEvents="none">{children}</View>

      <BlurView
        intensity={intensity}
        tint={colorScheme === "dark" ? "dark" : "light"}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

type OverlayProps = {
  featureName?: string;
  // When false the overlay renders nothing, regardless of entitlement.
  // Use this to hide the upgrade prompt on ranges/screens that are free.
  visible?: boolean;
};

// Full-screen, viewport-centered upgrade card. Mount alongside the ScrollView
// inside a flex:1 wrapper so it stays pinned to the visible viewport while
// the blurred content scrolls underneath. `pointerEvents="box-none"` lets
// taps pass through everywhere except the upgrade button, so the segmented
// control above stays interactive.
export function PaywallBlurOverlay({
  featureName,
  visible = true,
}: OverlayProps) {
  const { isPremium, isLoading } = usePremium();
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  if (isPremium || !visible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, styles.overlay]}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.borderLight,
            shadowColor: theme.shadow,
          },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: theme.brandSoft }]}>
          <Lock color={theme.brand} size={28} />
        </View>
        <ThemedText style={styles.title}>
          {featureName
            ? t("premium.gateTitleNamed", { feature: featureName })
            : t("premium.gateTitle")}
        </ThemedText>
        <ThemedText style={styles.body} type="secondary">
          {t("premium.gateBody")}
        </ThemedText>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/profile/premium")}
          disabled={isLoading}
          style={[
            styles.button,
            { backgroundColor: isLoading ? theme.border : theme.brand },
          ]}
        >
          <ThemedText style={styles.buttonLabel}>
            {t("premium.upgradeCta")}
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
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
    shadowOpacity: 1,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
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
