import { Colors } from "@/constants/theme";
import { useWizard } from "@/contexts/WizardContext";
import { Image } from "expo-image";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

const SexPage = () => {
  const { data, setField } = useWizard();
  const colorScheme = useColorScheme() || "light";
  const options: ("female" | "male")[] = ["female", "male"];
  return (
    <WizzardContentLayout
      title="სქესი"
      subtitle="ეს ინფორმაცია დაგვეხმარება შენთვის სწორი კალორიული მიზნის გამოთვლაში"
    >
      <View style={styles.cardContainer}>
        {options.map((item) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: Colors[colorScheme].background },
              data.biological_sex === item && {
                borderWidth: 1,
                borderColor: Colors[colorScheme].brand,
                backgroundColor: Colors[colorScheme].tint,
              },
            ]}
            onPress={() => setField("biological_sex", item)}
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
