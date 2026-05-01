import FoodCard from "@/components/cards/FoodCard";
import Header from "@/components/headers";
import Button from "@/components/ui/Button";
import { Coffee } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

function AddScreen() {
  const [activeButton, setActiveButton] = useState("საუზმე");
  const buttons = [
    {
      Icon: Coffee,
      label: "საუზმე",
    },
    {
      Icon: Coffee,
      label: "სადილი",
    },
    {
      Icon: Coffee,
      label: "სნექი",
    },
    {
      Icon: Coffee,
      label: "ვახშამი",
    },
  ];
  return (
    <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT + 20 }}>
      <Header
        title={"კვების ჩაწერა"}
        buttons={buttons}
        onButtonPress={(button) => setActiveButton(button.label)}
        activeButton={activeButton}
      />
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={({ item }) => <FoodCard key={item} />}
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />

      <View style={{ marginHorizontal: 20 }}>
        <Button onPress={() => console.log("Clciked")}>
          + შექმენი საკვები
        </Button>
      </View>
    </View>
  );
}

export default AddScreen;
const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 20,
  },
});
