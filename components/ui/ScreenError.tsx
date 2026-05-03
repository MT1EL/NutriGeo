import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { CloudOff, RefreshCw, type LucideIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
  type ViewStyle,
} from "react-native";

type Props = {
  /** Custom icon; defaults to `CloudOff` for the standard "load failed" case. */
  Icon?: LucideIcon;
  /** Heading. Defaults to t("common.loadFailed"). */
  title?: string;
  /** Body text. Defaults to t("common.loadFailedHint"). */
  hint?: string;
  /** If provided, shows a "Try again" button that runs this. Skip for not-found states. */
  onRetry?: () => void;
  /** Extra style for the wrapper — useful when embedding in a non-flex parent. */
  style?: ViewStyle;
};

// Used when a screen's primary data fetch fails and there's nothing useful to
// render. Pair with TanStack Query's `isError` and call `.refetch` from
// `onRetry`. For "not found" cases (the data succeeded but the row doesn't
// exist), pass `Icon`/`title`/`hint` from `t("common.notFound")` and omit
// `onRetry` — retrying won't help.
export default function ScreenError({
  Icon = CloudOff,
  title,
  hint,
  onRetry,
  style,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.icon, { backgroundColor: theme.brandSoft }]}>
        <Icon color={theme.brand} size={28} />
      </View>
      <ThemedText style={styles.title}>
        {title ?? t("common.loadFailed")}
      </ThemedText>
      <ThemedText type="secondary" style={styles.body}>
        {hint ?? t("common.loadFailedHint")}
      </ThemedText>
      {onRetry ? (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRetry}
          style={[styles.cta, { backgroundColor: theme.brand }]}
        >
          <RefreshCw color={theme.textOnBrand} size={16} />
          <ThemedText style={styles.ctaText} color={theme.textOnBrand}>
            {t("common.retry")}
          </ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    padding: Spacing.xl,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  body: {
    fontSize: Type.sm,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: Spacing.md,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  ctaText: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
