import BaseCard from "@/components/cards/BaseCard";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Radius, Spacing, Type } from "@/constants/theme";
import { Flame } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

type Props = {
  value: string;
  onChange: (next: string) => void;
};

export default function CalorieGoalCard({ value, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <BaseCard>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.cardIcon, { backgroundColor: "#FEEDE2" }]}>
            <Flame color="#FF7A45" size={18} />
          </View>
          <View style={{ gap: 2 }}>
            <ThemedText style={styles.cardTitle}>
              {t("goals2.calorieGoal")}
            </ThemedText>
            <ThemedText type="secondary" style={styles.cardCaption}>
              {t("goals2.computedFromYou")}
            </ThemedText>
          </View>
        </View>
      </View>
      <Input
        Icon={Flame}
        label={t("home.kcalGoal")}
        value={value}
        onChangeText={onChange}
        keyboardType="number-pad"
      />
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
});
