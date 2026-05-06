import BaseCard from "@/components/cards/BaseCard";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useWizard } from "@/contexts/WizardContext";
import { Scale, Target, TrendingDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Input from "../ui/inputs/Input";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

const GoalDetails = () => {
  const { t } = useTranslation();
  const { data, setField } = useWizard();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const PACE_OPTIONS = [
    {
      value: "0.25",
      label: t("wizard.goalDetails.slow"),
      desc: t("wizard.goalDetails.kgPerWeek", { kg: "0.25" }),
    },
    {
      value: "0.5",
      label: t("wizard.goalDetails.medium"),
      desc: t("wizard.goalDetails.kgPerWeek", { kg: "0.5" }),
    },
    {
      value: "0.75",
      label: t("wizard.goalDetails.fast"),
      desc: t("wizard.goalDetails.kgPerWeek", { kg: "0.75" }),
    },
  ];

  function formatEta(weeks: number): string {
    if (weeks < 1) return t("wizard.suggestion.lessThanWeek");
    if (weeks <= 8)
      return `${Math.round(weeks)} ${t("wizard.suggestion.weeks")}`;
    return `~${Math.round(weeks / 4.345)} ${t("wizard.suggestion.monthsApprox")}`;
  }

  if (data.goal_type === "maintain") {
    return (
      <WizzardContentLayout
        title={t("wizard.goalDetails.title")}
        subtitle={t("wizard.goalDetails.maintainNoExtra")}
      >
        <BaseCard>
          <View style={styles.maintainRow}>
            <View style={[styles.cardIcon, { backgroundColor: "#EFF6FF" }]}>
              <Scale color="#3B82F6" size={18} />
            </View>
            <ThemedText style={styles.maintainText} type="secondary">
              {t("wizard.goalDetails.tapNext")}
            </ThemedText>
          </View>
        </BaseCard>
      </WizzardContentLayout>
    );
  }

  const targetNum = Number(data.target_weight_kg);
  const currentNum = Number(data.weight_kg);
  let targetError: string | undefined;
  if (data.target_weight_kg && targetNum > 0 && currentNum > 0) {
    if (data.goal_type === "lose" && targetNum >= currentNum) {
      targetError = t("wizard.goalDetails.mustBeLessThan", { kg: currentNum });
    } else if (data.goal_type === "gain" && targetNum <= currentNum) {
      targetError = t("wizard.goalDetails.mustBeMoreThan", { kg: currentNum });
    }
  }

  let etaCaption = t("wizard.goalDetails.targetWeightAndPace");
  if (targetNum > 0 && currentNum > 0 && !targetError) {
    const pace = Number(data.weekly_pace_kg) || 0.5;
    const delta = Math.abs(targetNum - currentNum);
    if (delta >= 0.1) {
      etaCaption = t("wizard.goalDetails.currentPace", {
        eta: formatEta(delta / pace),
      });
    }
  }

  return (
    <WizzardContentLayout
      title={t("wizard.goalDetails.title")}
      subtitle={t("wizard.goalDetails.targetWeightAndPace")}
    >
      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardIcon, { backgroundColor: "#E6F6EA" }]}>
              <TrendingDown color="#34A867" size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>
                {t("wizard.goalDetails.weightGoal")}
              </ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                {etaCaption}
              </ThemedText>
            </View>
          </View>
        </View>

        <Input
          Icon={Target}
          label={t("wizard.goalDetails.targetWeight")}
          placeholder="65"
          value={data.target_weight_kg}
          onChangeText={(text) => setField("target_weight_kg", text)}
          keyboardType="decimal-pad"
          errorText={targetError}
        />

        <View style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.subLabel} type="secondary">
            {t("wizard.goalDetails.weeklyPaceLabel")}
          </ThemedText>
          <View style={styles.paceRow}>
            {PACE_OPTIONS.map((opt) => {
              const isActive = opt.value === data.weekly_pace_kg;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setField("weekly_pace_kg", opt.value)}
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
    </WizzardContentLayout>
  );
};

export default GoalDetails;

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
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
  maintainRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  maintainText: {
    flex: 1,
    fontSize: Type.base,
  },
});
