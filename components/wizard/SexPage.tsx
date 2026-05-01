import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

const SexPage = () => {
  const [active, setActive] = useState<null | "male" | "female">(null);
  const colorScheme = useColorScheme() || "light";
  const options: ("female" | "male")[] = ["female", "male"];
  return (
    <WizzardContentLayout
      title="სქესი"
      subtitle="ეს ინფორმაცია დაგვეხმარება შენთვის სწორი კალორიული მიზნის გამოთვლაში"
    >
      <View style={styles.cardContainer}>
        {options.map((item: "female" | "male") => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: Colors[colorScheme].background },
              active === item && {
                borderWidth: 1,
                borderColor: Colors[colorScheme].brand,
                backgroundColor: Colors[colorScheme].tint,
              },
            ]}
            onPress={() => setActive(item)}
            key={item}
          >
            <Image
              source={
                item === "female"
                  ? require("@/assets/illustrations/female.png")
                  : require("@/assets/illustrations/male.png")
              }
              style={styles.illustration}
            />
            <ThemedText style={styles.cardLabel}>
              {item === "female" ? "მდედრობითი" : "მამრობითი"}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </WizzardContentLayout>
  );
};

export default SexPage;
const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  titleContainer: {
    gap: 14,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
  },
  cardContainer: {
    flexDirection: "row",
    gap: 20,
  },
  card: {
    flex: 1,
    padding: 20,
    gap: 20,
    borderRadius: 16,
  },
  illustration: {
    width: "100%",
    aspectRatio: 0.67,
  },
  cardLabel: {
    fontSize: 16,
    textAlign: "center",
  },
});
