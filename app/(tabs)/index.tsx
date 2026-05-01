import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";

import ArticleCover from "@/components/cards/ArticleCover";
import MacrosCard from "@/components/cards/MacrosCard";
import MealsCard from "@/components/cards/MealsCard";
import { CalorieRing } from "@/components/charts/CalorieRing";
import ThemedText from "@/components/ui/ThemedText";
import { Colors } from "@/constants/theme";
import { Calendar } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function HomeScreen() {
  const colorScheme = useColorScheme() || "light";
  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: Colors[colorScheme].surface,
        paddingBottom: TAB_BAR_HEIGHT + 20,
      }}
    >
      <SafeAreaView edges={["top"]} style={styles.headerContainer}>
        <View>
          <View style={styles.header}>
            <ThemedText style={styles.title} color={Colors.light.background}>
              გამარჯობა, თორნიკე
            </ThemedText>
            <View style={styles.iconWrapper}>
              <Calendar color={"#FFF"} />
            </View>
          </View>
          <ThemedText color="#F9F9F9">1 მაისი, 2026</ThemedText>
        </View>
        <View style={styles.ringContainer}>
          <CalorieRing
            size={210}
            strokeWidth={14}
            progress={500 / 2000}
            caloriesLeft={1500}
            color="#50E3C2"
          />
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        <MacrosCard />
        <MealsCard />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 20 }}
          style={{ marginLeft: -20, paddingLeft: 20 }}
        >
          <ArticleCover />
          <ArticleCover />
          <ArticleCover />
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: -50,
    gap: 40,
  },
  headerContainer: {
    padding: 20,
    paddingBottom: 70,
    borderRadius: 20,
    gap: 60,
    backgroundColor: Colors.light.brand,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#F9F9F910",
  },
  ringContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
