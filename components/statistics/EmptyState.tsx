import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import { Activity, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function EmptyState() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.card, borderColor: theme.borderLight },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: theme.brandSoft }]}>
        <Activity color={theme.brand} size={32} />
      </View>
      <ThemedText style={styles.title}>{t("statistics.emptyTitle")}</ThemedText>
      <ThemedText type="secondary" style={styles.body}>
        {t("statistics.emptyBody")}
      </ThemedText>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => router.push("/add")}
        style={[styles.cta, { backgroundColor: theme.brand }]}
      >
        <Plus color={theme.textOnBrand} size={18} />
        <ThemedText style={styles.ctaText} color={theme.textOnBrand}>
          {t("statistics.startLogging")}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
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
    fontSize: Type.xl,
    fontWeight: "800",
    textAlign: "center",
  },
  body: {
    fontSize: Type.sm,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.pill,
  },
  ctaText: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
