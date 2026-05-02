import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useWizard } from "@/contexts/WizardContext";
import { calculateMacroTargets } from "@/utils/nutrition";
import {
  Beef,
  CalendarClock,
  Droplet,
  Flame,
  Wheat,
} from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import Input from "../ui/Input";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

function ageFromBirthDate(iso: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

function formatEta(weeks: number): string {
  if (weeks < 1) return "1 კვირაზე ნაკლებში";
  if (weeks <= 8) return `${Math.round(weeks)} კვირაში`;
  return `~${Math.round(weeks / 4.345)} თვეში`;
}

const Suggestion = () => {
  const { data, setField } = useWizard();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const showEta = data.goal_type === "lose" || data.goal_type === "gain";

  const computed = useMemo(() => {
    const age = ageFromBirthDate(data.birth_date);
    if (
      !data.biological_sex ||
      !data.activity_level ||
      !data.goal_type ||
      !data.height_cm ||
      !data.weight_kg ||
      age == null
    ) {
      return null;
    }
    return calculateMacroTargets({
      biological_sex: data.biological_sex,
      weight_kg: Number(data.weight_kg),
      height_cm: Number(data.height_cm),
      age,
      activity_level: data.activity_level,
      goal_type: data.goal_type,
      weekly_pace_kg: Number(data.weekly_pace_kg) || 0.5,
    });
  }, [
    data.biological_sex,
    data.activity_level,
    data.goal_type,
    data.height_cm,
    data.weight_kg,
    data.birth_date,
    data.weekly_pace_kg,
  ]);

  useEffect(() => {
    if (!computed) return;
    setField("daily_calorie_target", String(computed.kcal));
    setField("protein_g", String(computed.protein_g));
    setField("carbs_g", String(computed.carbs_g));
    setField("fat_g", String(computed.fat_g));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed?.kcal, computed?.protein_g, computed?.carbs_g, computed?.fat_g]);

  const etaWeeks = useMemo(() => {
    if (!showEta) return null;
    const target = Number(data.target_weight_kg);
    const current = Number(data.weight_kg);
    const pace = Number(data.weekly_pace_kg);
    if (!target || !current || !pace) return null;
    const delta = Math.abs(target - current);
    if (delta < 0.1) return null;
    return delta / pace;
  }, [data.target_weight_kg, data.weight_kg, data.weekly_pace_kg, showEta]);

  const kcalValue = Number(data.daily_calorie_target) || 0;

  const macroFields = [
    {
      key: "protein_g" as const,
      label: "ცილა",
      Icon: Beef,
      color: theme.macroProtein,
    },
    {
      key: "carbs_g" as const,
      label: "ნახშ.",
      Icon: Wheat,
      color: theme.macroCarbs,
    },
    {
      key: "fat_g" as const,
      label: "ცხიმი",
      Icon: Droplet,
      color: theme.macroFat,
    },
  ];

  return (
    <WizzardContentLayout
      title="შენი დღიური მიზნები"
      subtitle="გამოთვლილი შენი მონაცემების მიხედვით"
    >
      <View style={styles.stack}>
        <View
          style={[
            styles.hero,
            {
              backgroundColor: theme.brandSoft,
              borderColor: theme.brand + "22",
            },
          ]}
        >
          <View style={styles.heroTop}>
            <ThemedText
              type="secondary"
              style={styles.heroLabel}
              color={theme.brand}
            >
              შენი სამიზნე
            </ThemedText>
            <View style={styles.heroFlame}>
              <Flame color={theme.brand} size={16} />
            </View>
          </View>
          <View style={styles.heroNumberRow}>
            <ThemedText style={styles.heroNumber} color={theme.text}>
              {kcalValue ? kcalValue.toLocaleString() : "—"}
            </ThemedText>
            <ThemedText type="secondary" style={styles.heroUnit}>
              კალ / დღე
            </ThemedText>
          </View>

          {showEta && etaWeeks != null && (
            <>
              <View
                style={[
                  styles.heroDivider,
                  { backgroundColor: theme.brand + "22" },
                ]}
              />
              <View style={styles.etaRow}>
                <CalendarClock color={theme.brand} size={14} />
                <ThemedText style={styles.etaText} color={theme.text}>
                  მიაღწევ {data.target_weight_kg} კგ-ს{" "}
                </ThemedText>
                <ThemedText style={styles.etaTextStrong} color={theme.brand}>
                  {formatEta(etaWeeks)}
                </ThemedText>
              </View>
            </>
          )}
        </View>

        <View>
          <Input
            compact
            label="კალორია / დღე (შესაცვლელი)"
            value={data.daily_calorie_target}
            onChangeText={(t) => setField("daily_calorie_target", t)}
            Icon={Flame}
            keyboardType="decimal-pad"
          />
          <View style={styles.macroGrid}>
            {macroFields.map((f) => (
              <View key={f.key} style={styles.macroCol}>
                <Input
                  compact
                  label={f.label}
                  value={data[f.key]}
                  onChangeText={(t) => setField(f.key, t)}
                  Icon={(props) => <f.Icon {...props} color={f.color} />}
                  keyboardType="decimal-pad"
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </WizzardContentLayout>
  );
};

export default Suggestion;

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.lg,
  },
  hero: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  heroFlame: {
    width: 28,
    height: 28,
    borderRadius: Radius.pill,
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroNumberRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Spacing.sm,
  },
  heroNumber: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1.2,
  },
  heroUnit: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
  heroDivider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 2,
  },
  etaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
  },
  etaText: {
    fontSize: Type.sm,
    fontWeight: "500",
  },
  etaTextStrong: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  macroGrid: {
    marginTop: -8,
    flexDirection: "row",
    gap: Spacing.sm,
  },
  macroCol: {
    flex: 1,
  },
});
