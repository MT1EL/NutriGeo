import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
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

const FoodCard = (props: Props) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <TouchableOpacity>
      <BaseCard style={styles.card}>
        <Image
          source={require("@/assets/images/cheesecake.png")}
          style={styles.image}
        />

        <View style={{ gap: 8, flex: 1 }}>
          <View
            style={[
              styles.header,
              { borderBottomColor: Colors[colorScheme].border },
            ]}
          >
            <ThemedText style={styles.text}>ჩიზქეიქი</ThemedText>
            <ThemedText style={styles.text} color={Colors[colorScheme].brand}>
              321 კალ
            </ThemedText>
          </View>
          <ThemedText type="secondary" style={styles.macros}>
            ცილა 2გ . ნახშირწყალი 20გ . ცხიმი 5გ
          </ThemedText>
        </View>
      </BaseCard>
    </TouchableOpacity>
  );
};

export default FoodCard;
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  image: {
    width: 75,
    aspectRatio: 1,
    borderRadius: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  macros: {
    fontSize: 13,
  },
});
