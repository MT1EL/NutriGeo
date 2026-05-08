import { Radius } from "@/constants/theme";
import { StyleSheet, View } from "react-native";
import ThemedText from "../ui/ThemedText";

type Props = {
  label: string;
  consumed: number;
  goal?: number;
  color: string;
  tintColor: string;
  textColor: string;
  unit: string;
};

export const MacroPill = ({
  label,
  consumed,
  goal,
  color,
  tintColor,
  textColor,
  unit,
}: Props) => (
  <View style={[styles.pill, { backgroundColor: tintColor }]}>
    <View style={[styles.dot, { backgroundColor: color }]} />
    <ThemedText style={[styles.label, { color: textColor }]}>
      {label}{" "}
    </ThemedText>
    <ThemedText style={[styles.value, { color: textColor }]}>
      {consumed}
    </ThemedText>
    <ThemedText style={[styles.goal, { color: textColor }]}>
      {goal ? `/${goal}` : ""}
      {unit}
    </ThemedText>
  </View>
);

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  value: {
    fontSize: 12,
    fontWeight: "700",
  },
  goal: {
    fontSize: 11,
    fontWeight: "500",
  },
});
