import BaseCard from "@/components/cards/BaseCard";
import Input from "@/components/ui/inputs/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { PACE_OPTIONS, type Pace } from "@/hooks/use-edit-goals";
import { FormikErrors } from "formik";
import { Target, TrendingDown } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  targetWeight: string;
  onTargetWeightChange: (next: string) => void;
  pace: Pace;
  onPaceChange: (next: Pace) => void;
  weeks?: number;
  errorText?: FormikErrors<{ targetWeight: string }>["targetWeight"];
};

export default function WeightGoalCard({
  targetWeight,
  onTargetWeightChange,
  pace,
  onPaceChange,
  weeks,
  errorText,
}: Props) {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.cardIcon, { backgroundColor: "#E6F6EA" }]}>
            <TrendingDown color="#34A867" size={18} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.cardTitle}>
              {t("goals2.weightGoal")}
            </ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              {t("goals2.currentTempWeeks", { weeks })}
            </ThemedText>
          </View>
        </View>
      </View>

      <Input
        Icon={Target}
        label={t("wizard.goalDetails.targetWeight")}
        value={targetWeight}
        onChangeText={onTargetWeightChange}
        placeholder="65"
        keyboardType="decimal-pad"
        errorText={errorText}
      />

      <View style={{ gap: Spacing.sm }}>
        <ThemedText style={styles.subLabel} type="secondary">
          {t("goals2.weeklyTempLabel")}
        </ThemedText>
        <View style={styles.paceRow}>
          {PACE_OPTIONS.map((opt) => {
            const isActive = opt.key === pace;
            return (
              <TouchableOpacity
                key={opt.key}
                onPress={() => onPaceChange(opt.key)}
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
                  {t(opt.labelKey)}
                </ThemedText>
                <ThemedText style={styles.paceDesc} type="secondary">
                  {t("wizard.goalDetails.kgPerWeek", { kg: opt.weeklyKg })}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </BaseCard>
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
});
