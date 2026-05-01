import { Radius } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export type DayState = "logged" | "partial" | "missed" | "future";

type Props = {
  days: DayState[];
  color: string;
  partialColor: string;
  mutedColor: string;
};

export const StreakGrid = ({ days, color, partialColor, mutedColor }: Props) => {
  // 7 cols × N rows. Pad to a multiple of 7 with future days.
  const padded = [...days];
  while (padded.length % 7 !== 0) padded.push("future");
  const rows: DayState[][] = [];
  for (let i = 0; i < padded.length; i += 7) {
    rows.push(padded.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.row}>
          {row.map((d, di) => (
            <View
              key={di}
              style={[
                styles.cell,
                {
                  backgroundColor:
                    d === "logged"
                      ? color
                      : d === "partial"
                        ? partialColor
                        : mutedColor,
                  opacity: d === "future" ? 0.4 : 1,
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 6,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.sm,
  },
});
