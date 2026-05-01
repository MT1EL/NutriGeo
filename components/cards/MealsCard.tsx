import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { CirclePlus, EggFried, HandPlatter, Salad } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

type Props = {};

const MealsCard = (props: Props) => {
  const colorScheme = useColorScheme() || "light";
  const data = [
    {
      title: "საუზმე",
      icon: EggFried,
      time: "9:00",
      calories: 500,
      meals: "კურასანი, ყავა",
    },
    {
      title: "სადილი",
      icon: Salad,
      time: "13:00",
      calories: 500,
      meals: "კურასანი, ყავა",
    },
    {
      title: "ვახშამი",
      icon: HandPlatter,
      time: "17:00",
      calories: 500,
      meals: "კურასანი, ყავა",
    },
  ];
  return (
    <BaseCard>
      <View style={[styles.row, styles.spaced]}>
        <ThemedText style={styles.title}>დღის საკვები</ThemedText>
        <TouchableOpacity onPress={() => router.navigate("/add")}>
          <CirclePlus color={Colors[colorScheme].success} />
        </TouchableOpacity>
      </View>

      {data.map((item) => (
        <View style={[styles.row, { gap: 12 }]} key={item.title}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: Colors[colorScheme].borderLight },
            ]}
          >
            <Salad color={Colors[colorScheme].text} />
          </View>
          <View style={[styles.row, { flex: 1 }]}>
            <View style={{ gap: 8, flex: 1 }}>
              <View style={[styles.row, styles.spaced]}>
                <View style={[styles.row, { gap: 4 }]}>
                  <ThemedText style={styles.mealTypeTitle}>სადილი</ThemedText>
                  <ThemedText style={styles.timelabel} type="secondary">
                    9:00
                  </ThemedText>
                </View>
                <ThemedText style={styles.caloriesLabel}>500კალ</ThemedText>
              </View>
              <ThemedText style={styles.timelabel} type="secondary">
                კრუასანი, ყავა
              </ThemedText>
            </View>
          </View>
        </View>
      ))}
    </BaseCard>
  );
};

export default MealsCard;
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaced: {
    justifyContent: "space-between",
  },
  title: { fontSize: 16, fontWeight: "bold", lineHeight: 20 },
  iconWrapper: {
    padding: 12,
    borderRadius: 16,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: "medium",
    lineHeight: 20,
  },
  timelabel: {
    fontSize: 12,
    lineHeight: 20,
  },
  caloriesLabel: {
    fontSize: 14,
    fontWeight: "medium",
  },
});
