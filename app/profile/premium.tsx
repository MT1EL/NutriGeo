import { restorePremium } from "@/api/premium";
import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { PREMIUM_STATUS_QUERY_KEY, usePremium } from "@/hooks/use-premium";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CloudUpload,
  Crown,
  Sparkles,
  type LucideIcon,
} from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type PlanId = "monthly" | "yearly" | "lifetime";

type Plan = {
  id: PlanId;
  labelKey: string;
  priceKey: string;
  periodKey?: string;
  helperKey?: string;
  badgeKey?: string;
  badgePercent?: number;
};

const PLANS: Plan[] = [
  {
    id: "monthly",
    labelKey: "premium.monthly",
    priceKey: "premium.monthlyPrice",
    periodKey: "premium.perMonth",
  },
  {
    id: "yearly",
    labelKey: "premium.yearly",
    priceKey: "premium.yearlyPrice",
    periodKey: "premium.perYear",
    helperKey: "premium.yearlyEquivalent",
    badgeKey: "premium.saveBadge",
    badgePercent: 50,
  },
  {
    id: "lifetime",
    labelKey: "premium.lifetime",
    priceKey: "premium.lifetimePrice",
    periodKey: "premium.oneTime",
  },
];

type Benefit = {
  Icon: LucideIcon;
  titleKey: string;
  bodyKey: string;
  color: string;
  tintLight: string;
  tintDark: string;
};

const BENEFITS: Benefit[] = [
  {
    Icon: Sparkles,
    titleKey: "premium.benefitCoachTitle",
    bodyKey: "premium.benefitCoachBody",
    color: "#7C5CFF",
    tintLight: "#F0EBFE",
    tintDark: "#2A1F4A",
  },
  {
    Icon: CalendarDays,
    titleKey: "premium.benefitMealPlanTitle",
    bodyKey: "premium.benefitMealPlanBody",
    color: "#34A867",
    tintLight: "#E6F6EA",
    tintDark: "#1F3A28",
  },
  {
    Icon: BarChart3,
    titleKey: "premium.benefitStatsTitle",
    bodyKey: "premium.benefitStatsBody",
    color: "#5B6CE0",
    tintLight: "#EEF0FB",
    tintDark: "#222B4A",
  },
  {
    Icon: CloudUpload,
    titleKey: "premium.benefitBackupTitle",
    bodyKey: "premium.benefitBackupBody",
    color: "#3FA9F5",
    tintLight: "#E5F3FE",
    tintDark: "#102A3A",
  },
];

export default function PremiumScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();
  const { isPremium, status } = usePremium();

  const [selected, setSelected] = useState<PlanId>("yearly");
  const [purchasing, setPurchasing] = useState(false);

  const restoreMutation = useMutation({
    mutationFn: restorePremium,
    onSuccess: async (res) => {
      await queryClient.invalidateQueries({ queryKey: PREMIUM_STATUS_QUERY_KEY });
      if (res.data.active) {
        toast.success(t("premium.restoreSuccess"));
      } else {
        Alert.alert(
          t("premium.restoreNoneTitle"),
          t("premium.restoreNoneBody"),
        );
      }
    },
    onError: (err) => {
      const message = err instanceof Error ? err.message : t("premium.restoreFailed");
      toast.error(message, t("common.error"));
    },
  });

  const onSubscribe = () => {
    // Real purchase flow lands with the IAP/RevenueCat integration. Until
    // then, surface the same placeholder the PaywallGate used so the screen
    // is functional end-to-end without a working store SDK.
    setPurchasing(true);
    setTimeout(() => {
      setPurchasing(false);
      Alert.alert(
        t("premium.comingSoonTitle"),
        t("premium.comingSoonBody"),
      );
    }, 600);
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(i18n.language, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  return (
    <SubScreenLayout
      title={t("premium.screenTitle")}
      subtitle={t("premium.screenSubtitle")}
    >
      {isPremium ? (
        <ActiveCard
          theme={theme}
          title={t("premium.activeTitle")}
          subtitle={t("premium.activeSubtitle")}
          line={
            status?.expires_at
              ? status.will_renew === false
                ? `${t("premium.expiresOn", { date: formatDate(status.expires_at) })} · ${t("premium.willNotRenew")}`
                : t("premium.renewsOn", { date: formatDate(status.expires_at) })
              : undefined
          }
        />
      ) : (
        <HeroCard
          theme={theme}
          title={t("premium.heroTitle")}
          subtitle={t("premium.heroSubtitle")}
        />
      )}

      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>
          {t("premium.benefitsTitle")}
        </ThemedText>
        <BaseCard style={styles.benefitsCard}>
          {BENEFITS.map((b, i) => (
            <View
              key={b.titleKey}
              style={[
                styles.benefitRow,
                i < BENEFITS.length - 1 && {
                  borderBottomColor: theme.borderLight,
                  borderBottomWidth: StyleSheet.hairlineWidth,
                },
              ]}
            >
              <View
                style={[
                  styles.benefitIcon,
                  {
                    backgroundColor:
                      colorScheme === "dark" ? b.tintDark : b.tintLight,
                  },
                ]}
              >
                <b.Icon color={b.color} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.benefitTitle}>
                  {t(b.titleKey)}
                </ThemedText>
                <ThemedText type="secondary" style={styles.benefitBody}>
                  {t(b.bodyKey)}
                </ThemedText>
              </View>
            </View>
          ))}
        </BaseCard>
      </View>

      {!isPremium && (
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            {t("premium.choosePlan")}
          </ThemedText>
          <View style={styles.plans}>
            {PLANS.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                selected={selected === plan.id}
                onSelect={() => setSelected(plan.id)}
                theme={theme}
              />
            ))}
          </View>
        </View>
      )}

      {!isPremium && (
        <View style={{ gap: Spacing.md }}>
          <Button
            onPress={onSubscribe}
            disabled={purchasing}
          >
            {purchasing ? t("premium.subscribingCta") : t("premium.subscribeCta")}
          </Button>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => restoreMutation.mutate()}
            disabled={restoreMutation.isPending}
            style={styles.restoreBtn}
          >
            {restoreMutation.isPending ? (
              <ActivityIndicator size="small" color={theme.brand} />
            ) : (
              <ThemedText style={styles.restoreText} color={theme.brand}>
                {t("premium.restoreCta")}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.legalWrap}>
        <ThemedText type="secondary" style={styles.legalText}>
          {t("premium.footerLegal")}
        </ThemedText>
        <View style={styles.legalLinks}>
          <Pressable onPress={() => router.push("/profile/terms")} hitSlop={6}>
            <ThemedText style={styles.legalLink} color={theme.brand}>
              {t("premium.termsLink")}
            </ThemedText>
          </Pressable>
          <ThemedText type="secondary" style={styles.legalDot}>
            ·
          </ThemedText>
          <Pressable
            onPress={() => router.push("/profile/privacy")}
            hitSlop={6}
          >
            <ThemedText style={styles.legalLink} color={theme.brand}>
              {t("premium.privacyLink")}
            </ThemedText>
          </Pressable>
        </View>
      </View>
    </SubScreenLayout>
  );
}

function HeroCard({
  theme,
  title,
  subtitle,
}: {
  theme: typeof Colors.light;
  title: string;
  subtitle: string;
}) {
  return (
    <BaseCard
      style={[styles.hero, { backgroundColor: theme.brand }]}
      flat
    >
      <View style={styles.heroIconWrap}>
        <Crown color="#FFFFFF" size={36} />
        <Sparkles
          color="#FFD7A3"
          size={16}
          style={{ position: "absolute", top: -2, right: -6 }}
        />
      </View>
      <View style={{ alignItems: "center", gap: 6 }}>
        <ThemedText style={styles.heroTitle} color="#FFFFFF">
          {title}
        </ThemedText>
        <ThemedText style={styles.heroSubtitle} color="#FFFFFFCC">
          {subtitle}
        </ThemedText>
      </View>
    </BaseCard>
  );
}

function ActiveCard({
  theme,
  title,
  subtitle,
  line,
}: {
  theme: typeof Colors.light;
  title: string;
  subtitle: string;
  line?: string;
}) {
  return (
    <BaseCard style={[styles.hero, { backgroundColor: theme.brand }]} flat>
      <View style={styles.heroIconWrap}>
        <CheckCircle2 color="#FFFFFF" size={36} />
      </View>
      <View style={{ alignItems: "center", gap: 6 }}>
        <ThemedText style={styles.heroTitle} color="#FFFFFF">
          {title}
        </ThemedText>
        <ThemedText style={styles.heroSubtitle} color="#FFFFFFCC">
          {subtitle}
        </ThemedText>
        {line && (
          <ThemedText style={styles.heroLine} color="#FFFFFFE6">
            {line}
          </ThemedText>
        )}
      </View>
    </BaseCard>
  );
}

function PlanCard({
  plan,
  selected,
  onSelect,
  theme,
}: {
  plan: Plan;
  selected: boolean;
  onSelect: () => void;
  theme: typeof Colors.light;
}) {
  const { t } = useTranslation();
  return (
    <Pressable
      onPress={onSelect}
      style={({ pressed }) => [
        styles.planCard,
        {
          backgroundColor: theme.card,
          borderColor: selected ? theme.brand : theme.borderLight,
          borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
        },
        pressed && { transform: [{ scale: 0.99 }] },
      ]}
    >
      <View style={styles.planRadio}>
        <View
          style={[
            styles.radioOuter,
            { borderColor: selected ? theme.brand : theme.border },
          ]}
        >
          {selected && (
            <View
              style={[styles.radioInner, { backgroundColor: theme.brand }]}
            />
          )}
        </View>
      </View>

      <View style={{ flex: 1, gap: 2 }}>
        <View style={styles.planTitleRow}>
          <ThemedText style={styles.planLabel}>{t(plan.labelKey)}</ThemedText>
          {plan.badgeKey && plan.badgePercent ? (
            <View
              style={[
                styles.planBadge,
                { backgroundColor: theme.brandSoft },
              ]}
            >
              <ThemedText style={styles.planBadgeText} color={theme.brandDeep}>
                {t(plan.badgeKey, { percent: plan.badgePercent })}
              </ThemedText>
            </View>
          ) : null}
        </View>
        {plan.helperKey && (
          <ThemedText type="secondary" style={styles.planHelper}>
            {t(plan.helperKey)}
          </ThemedText>
        )}
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <ThemedText style={styles.planPrice}>{t(plan.priceKey)}</ThemedText>
        {plan.periodKey && (
          <ThemedText type="secondary" style={styles.planPeriod}>
            {t(plan.periodKey)}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    borderWidth: 0,
    ...(Platform.OS === "ios"
      ? {
          shadowColor: "#000",
          shadowOpacity: 0.15,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 8 },
        }
      : { elevation: 4 }),
  },
  heroIconWrap: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: Type.xl,
    fontWeight: "800",
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: Type.sm,
    lineHeight: 20,
    textAlign: "center",
  },
  heroLine: {
    fontSize: Type.xs,
    fontWeight: "600",
    marginTop: Spacing.xs,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  benefitsCard: {
    padding: 0,
    gap: 0,
    overflow: "hidden",
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  benefitTitle: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  benefitBody: {
    fontSize: Type.xs,
    lineHeight: 18,
    marginTop: 2,
  },
  plans: {
    gap: Spacing.md,
  },
  planCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  planRadio: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: Radius.pill,
  },
  planTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  planLabel: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  planBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  planHelper: {
    fontSize: Type.xs,
  },
  planPrice: {
    fontSize: Type.lg,
    fontWeight: "800",
  },
  planPeriod: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  restoreBtn: {
    paddingVertical: Spacing.sm,
    alignItems: "center",
    minHeight: 32,
    justifyContent: "center",
  },
  restoreText: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  legalWrap: {
    alignItems: "center",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  legalText: {
    fontSize: Type.xs,
    lineHeight: 18,
    textAlign: "center",
  },
  legalLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  legalLink: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  legalDot: {
    fontSize: Type.xs,
  },
});
