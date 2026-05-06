import { usePremium } from "@/hooks/use-premium";
import { router } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

type GateOptions = {
  featureName?: string;
};

// Wraps an action with a premium check. Premium users run the action
// immediately; free users see a native alert pitching the upgrade and
// linking to the buy screen. Use this for one-off gated *actions* (export,
// AI photo, voice log) — for recurring views, use PaywallBlur instead.
export function useRequirePremium() {
  const { isPremium } = usePremium();
  const { t } = useTranslation();

  return useCallback(
    (action: () => void, opts: GateOptions = {}) => {
      if (isPremium) {
        action();
        return;
      }
      Alert.alert(
        opts.featureName
          ? t("premium.gateTitleNamed", { feature: opts.featureName })
          : t("premium.gateTitle"),
        t("premium.gateBody"),
        [
          { text: t("common.cancel"), style: "cancel" },
          {
            text: t("premium.upgradeCta"),
            onPress: () => router.push("/profile/premium"),
          },
        ],
      );
    },
    [isPremium, t],
  );
}
