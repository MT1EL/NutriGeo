import { updateGoals } from "@/api/profile";
import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Beef,
  Droplet,
  Flame,
  Target,
  TrendingDown,
  Wheat,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Pace = "slow" | "moderate" | "fast";

const PACE_OPTIONS: {
  key: Pace;
  label: string;
  desc: string;
  weeklyKg: number;
}[] = [
  { key: "slow", label: "ნელი", desc: "0.25 კგ/კვ", weeklyKg: 0.25 },
  { key: "moderate", label: "საშუალო", desc: "0.5 კგ/კვ", weeklyKg: 0.5 },
  { key: "fast", label: "სწრაფი", desc: "0.75 კგ/კვ", weeklyKg: 0.75 },
];

function paceFromWeeklyKg(weeklyKg: number | undefined): Pace {
  if (weeklyKg == null) return "moderate";
  let best: Pace = "moderate";
  let bestDelta = Infinity;
  for (const opt of PACE_OPTIONS) {
    const delta = Math.abs(opt.weeklyKg - weeklyKg);
    if (delta < bestDelta) {
      bestDelta = delta;
      best = opt.key;
    }
  }
  return best;
}

export default function GoalsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const { user, refreshUser } = useAuth();
  const queryClient = useQueryClient();
  const goals = user?.goals;

  const [pace, setPace] = useState<Pace>(
    paceFromWeeklyKg(goals?.weekly_pace_kg),
  );
  const [targetWeight, setTargetWeight] = useState<string>(
    goals?.target_weight_kg != null ? String(goals.target_weight_kg) : "",
  );
  const [calorieTarget, setCalorieTarget] = useState<string>(
    goals?.daily_calorie_target ? String(goals.daily_calorie_target) : "",
  );

  useEffect(() => {
    if (!goals) return;
    setPace(paceFromWeeklyKg(goals.weekly_pace_kg));
    setTargetWeight(
      goals.target_weight_kg != null ? String(goals.target_weight_kg) : "",
    );
    setCalorieTarget(
      goals.daily_calorie_target ? String(goals.daily_calorie_target) : "",
    );
  }, [goals]);

  const mutation = useMutation({
    mutationFn: updateGoals,
    onSuccess: async (res) => {
      queryClient.setQueryData(["Profile"], res);
      await queryClient.invalidateQueries({ queryKey: ["Profile"] });
      await queryClient.invalidateQueries({ queryKey: ["meals"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
      await refreshUser();
      toast.success("მიზნები შენახულია");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const handleSave = () => {
    if (!goals) return;
    const weeklyPaceKg =
      PACE_OPTIONS.find((o) => o.key === pace)?.weeklyKg ??
      goals.weekly_pace_kg;
    const targetWeightNum = parseFloat(targetWeight.replace(",", "."));
    const calorieNum = parseInt(calorieTarget, 10);
    mutation.mutate({
      goal_type: goals.goal_type,
      activity_level: goals.activity_level,
      target_weight_kg: Number.isFinite(targetWeightNum)
        ? targetWeightNum
        : undefined,
      weekly_pace_kg: weeklyPaceKg,
      daily_calorie_target: Number.isFinite(calorieNum)
        ? calorieNum
        : undefined,
      protein_pct: goals.protein_pct,
      carbs_pct: goals.carbs_pct,
      fat_pct: goals.fat_pct,
    });
  };

  const calorieForMacroPct = (pct: number | undefined) => {
    const kcalGoal =
      parseInt(calorieTarget, 10) || goals?.daily_calorie_target || 0;
    return Math.round(((pct ?? 0) / 100) * kcalGoal);
  };

  const macros = [
    {
      label: "ცილა",
      pct: goals?.protein_pct,
      grams: goals?.protein_g_goal,
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: "ნახშირწყალი",
      pct: goals?.carbs_pct,
      grams: goals?.carbs_g_goal,
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: "ცხიმი",
      pct: goals?.fat_pct,
      grams: goals?.fat_g_goal,
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];

  return (
    <SubScreenLayout title="მიზნები" subtitle="წონა, კალორია, მაკრო">
      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardIcon, { backgroundColor: "#E6F6EA" }]}>
              <TrendingDown color="#34A867" size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>წონის მიზანი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                მიმდინარე ტემპით 6 კვირა
              </ThemedText>
            </View>
          </View>
        </View>
        <Input
          Icon={Target}
          label="სამიზნე წონა (კგ)"
          value={targetWeight}
          onChangeText={setTargetWeight}
          keyboardType="decimal-pad"
        />
        <View style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.subLabel} type="secondary">
            კვირეული ტემპი
          </ThemedText>
          <View style={styles.paceRow}>
            {PACE_OPTIONS.map((opt) => {
              const isActive = opt.key === pace;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setPace(opt.key)}
                  activeOpacity={0.85}
                  style={[
                    styles.paceCard,
                    {
                      borderColor: isActive ? theme.brand : theme.border,
                      backgroundColor: isActive ? theme.brandSoft : theme.card,
                    },
                  ]}
                >
                  <ThemedText
                    style={styles.paceLabel}
                    color={isActive ? theme.brand : theme.text}
                  >
                    {opt.label}
                  </ThemedText>
                  <ThemedText style={styles.paceDesc} type="secondary">
                    {opt.desc}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BaseCard>

      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardIcon, { backgroundColor: "#FEEDE2" }]}>
              <Flame color="#FF7A45" size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>კალორიის მიზანი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                გათვლილი შენი მონაცემებით
              </ThemedText>
            </View>
          </View>
        </View>
        <Input
          Icon={Flame}
          label="დღიური მიზანი (კალ)"
          value={calorieTarget}
          onChangeText={setCalorieTarget}
          keyboardType="number-pad"
        />
      </BaseCard>

      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[styles.cardIcon, { backgroundColor: theme.brandSoft }]}
            >
              <Beef color={theme.brand} size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>მაკრო ბალანსი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                კალორიის გადანაწილება
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.macroBarStack}>
          {macros.map((m) => (
            <View
              key={m.label}
              style={{
                width: `${m.pct || 33}%`,
                backgroundColor: m.color,
              }}
            />
          ))}
        </View>

        <View style={{ gap: Spacing.md }}>
          {macros.map(({ label, pct, grams, color, Icon }) => (
            <View key={label} style={styles.macroRow}>
              <View
                style={[styles.macroIcon, { backgroundColor: color + "22" }]}
              >
                <Icon color={color} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.macroLabel}>{label}</ThemedText>
                <ThemedText style={styles.macroSub} type="secondary">
                  {grams}გ / {pct}%
                </ThemedText>
              </View>
              <ThemedText style={styles.macroPct} color={color}>
                {calorieForMacroPct(pct)} კალ
              </ThemedText>
            </View>
          ))}
        </View>
      </BaseCard>

      <Button onPress={handleSave} disabled={mutation.isPending || !goals}>
        {mutation.isPending ? "ინახება..." : "შენახვა"}
      </Button>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  subLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  paceRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  paceCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 4,
  },
  paceLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  paceDesc: {
    fontSize: Type.xs,
  },
  macroBarStack: {
    flexDirection: "row",
    height: 12,
    borderRadius: Radius.pill,
    overflow: "hidden",
    marginTop: Spacing.xs,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  macroIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  macroLabel: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  macroSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  macroPct: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
