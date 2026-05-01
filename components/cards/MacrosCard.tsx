import { DayMeals } from "@/api/meals";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Beef, Droplet, PieChart, Wheat } from "lucide-react-native";
import { StyleSheet, useColorScheme, View } from "react-native";
import { MacroBar } from "../charts/MacroBar";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

type Props = {
  data: DayMeals;
};
const MacrosCard = ({ data }: Props) => {
  const { user } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const macros = [
    {
      label: "ცილა",
      consumed: data.totals.protein_g,
      goal: user?.goals.protein_g_goal || 0,
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: "ნახშირწყალი",
      consumed: data.totals.carbs_g,
      goal: user?.goals.carbs_g_goal || 0,
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: "ცხიმი",
      consumed: data.totals.fat_g,
      goal: user?.goals.fat_g_goal || 0,
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];
  return (
    <BaseCard>
      <View style={styles.row}>
        <PieChart size={18} color={theme.brand} />
        <ThemedText style={styles.title}>მაკრონუტრიენტები</ThemedText>
      </View>
      <View style={{ gap: Spacing.md }}>
        {macros.map((item) => (
          <MacroBar key={item.label} {...item} />
        ))}
      </View>
    </BaseCard>
  );
};

export default MacrosCard;
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: Spacing.sm,
    alignItems: "center",
  },
  title: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
});
