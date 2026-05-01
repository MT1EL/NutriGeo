import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Beef } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import ThemedText from "../ui/ThemedText";

type Props = {
  label: string;
  consumed: number;
  goal: number;
  color: string;
  unit?: string;
};

export const MacroBar = ({
  label,
  consumed,
  goal,
  color,
  unit = "გ",
}: Props) => {
  const colorScheme = useColorScheme() || "light";
  const progress = Math.min(consumed / goal, 1);

  return (
    <View style={styles.container}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={styles.row}>
          <Beef size={15} color={color} />
          <ThemedText style={styles.macroText}>{label}</ThemedText>
        </View>
        <ThemedText style={styles.macroText} type="secondary">
          {consumed}/{goal}
          {unit}
        </ThemedText>
      </View>
      <View
        style={[
          styles.track,
          { backgroundColor: Colors[colorScheme].borderLight },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              backgroundColor: color,
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  macroText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  track: {
    height: 10,
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 99,
  },
});
