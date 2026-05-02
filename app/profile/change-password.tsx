import { HttpError } from "@/api/client";
import { updatePassword } from "@/api/me";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useToast } from "@/contexts/ToastContext";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Check, Lock, ShieldCheck, X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

const RULES = [
  { key: "len", label: "მინ. 8 სიმბოლო", test: (s: string) => s.length >= 8 },
  { key: "num", label: "ერთი ციფრი მაინც", test: (s: string) => /\d/.test(s) },
  {
    key: "case",
    label: "ერთი დიდი ასო მაინც",
    test: (s: string) => /[A-Z]/.test(s),
  },
];

export default function ChangePasswordScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const checks = useMemo(
    () => RULES.map((r) => ({ ...r, ok: r.test(next) })),
    [next]
  );
  const allRulesOk = checks.every((c) => c.ok);
  const matches = next.length > 0 && next === confirm;

  const mutation = useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => updatePassword(currentPassword, newPassword),
    onSuccess: () => {
      setCurrent("");
      setNext("");
      setConfirm("");
      setServerError(null);
      toast.success("პაროლი წარმატებით შეიცვალა");
      router.back();
    },
    onError: (err) => {
      if (err instanceof HttpError) {
        if (err.status === 401 || err.status === 403) {
          setServerError("მიმდინარე პაროლი არასწორია");
          return;
        }
        if (err.status === 422) {
          setServerError("ახალი პაროლი არ აკმაყოფილებს მოთხოვნებს");
          return;
        }
      }
      const message =
        err instanceof Error ? err.message : "პაროლის შეცვლა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const canSave =
    current.length >= 4 &&
    allRulesOk &&
    matches &&
    !mutation.isPending;

  const handleSave = () => {
    setServerError(null);
    mutation.mutate({ currentPassword: current, newPassword: next });
  };

  return (
    <SubScreenLayout title="პაროლის შეცვლა" subtitle="გააძლიერე უსაფრთხოება">
      <View style={styles.heroIconWrap}>
        <View style={[styles.heroIcon, { backgroundColor: theme.brandSoft }]}>
          <ShieldCheck color={theme.brand} size={28} />
        </View>
      </View>

      <View style={{ gap: Spacing.md }}>
        <Input
          Icon={Lock}
          label="მიმდინარე პაროლი"
          placeholder="••••••••"
          secure
          value={current}
          onChangeText={(text) => {
            setCurrent(text);
            if (serverError) setServerError(null);
          }}
          errorText={serverError ?? undefined}
        />
        <Input
          Icon={Lock}
          label="ახალი პაროლი"
          placeholder="••••••••"
          secure
          value={next}
          onChangeText={setNext}
        />
        <Input
          Icon={Lock}
          label="ახალი პაროლი (გამეორება)"
          placeholder="••••••••"
          secure
          value={confirm}
          onChangeText={setConfirm}
          errorText={
            confirm.length > 0 && confirm !== next
              ? "პაროლი არ ემთხვევა"
              : undefined
          }
        />
      </View>

      <View
        style={[
          styles.rulesCard,
          { backgroundColor: theme.card, borderColor: theme.borderLight },
        ]}
      >
        <ThemedText style={styles.rulesTitle} type="secondary">
          მოთხოვნები
        </ThemedText>
        {checks.map((c) => (
          <View key={c.key} style={styles.ruleRow}>
            <View
              style={[
                styles.ruleIcon,
                {
                  backgroundColor: c.ok
                    ? theme.success + "22"
                    : theme.borderLight,
                },
              ]}
            >
              {c.ok ? (
                <Check color={theme.success} size={12} />
              ) : (
                <X color={theme.textSecondary} size={12} />
              )}
            </View>
            <ThemedText
              style={styles.ruleText}
              color={c.ok ? theme.text : theme.textSecondary}
            >
              {c.label}
            </ThemedText>
          </View>
        ))}
      </View>

      <Button onPress={handleSave} disabled={!canSave}>
        {mutation.isPending ? "ინახება..." : "პაროლის შენახვა"}
      </Button>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  heroIconWrap: {
    alignItems: "center",
    paddingTop: Spacing.sm,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  rulesCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
  rulesTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: Spacing.xs,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  ruleIcon: {
    width: 20,
    height: 20,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  ruleText: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
