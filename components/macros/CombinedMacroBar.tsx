import { Colors, Radius } from "@/constants/theme";
import { DimensionValue, StyleSheet, useColorScheme, View } from "react-native";

type MacroSegment = {
  label: string;
  consumed: number;
  color: string;
};

type Props = {
  macros: MacroSegment[];
};

export const CombinedMacroBar = ({ macros }: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const total = macros.reduce((sum, m) => sum + m.consumed, 0);

  const getWidth = (consumed: number): DimensionValue =>
    total > 0 ? `${(consumed / total) * 100}%` : "0%";

  return (
    <View style={[styles.track, { backgroundColor: theme.borderLight }]}>
      {macros.map((m, index) => (
        <View
          key={m.label}
          style={[
            styles.segment,
            {
              width: getWidth(m.consumed),
              backgroundColor: m.color,
              borderTopLeftRadius: index === 0 ? Radius.pill : 0,
              borderBottomLeftRadius: index === 0 ? Radius.pill : 0,
              borderTopRightRadius:
                index === macros.length - 1 ? Radius.pill : 0,
              borderBottomRightRadius:
                index === macros.length - 1 ? Radius.pill : 0,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: Radius.pill,
    overflow: "hidden",
    flexDirection: "row",
  },
  segment: {
    height: "100%",
  },
});
