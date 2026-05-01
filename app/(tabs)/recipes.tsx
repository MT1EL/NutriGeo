import RecipeCard from "@/components/cards/RecipeCard";
import Header from "@/components/headers";
import { FlatList, StyleSheet, View } from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

export default function RecipesScreen() {
  return (
    <View style={styles.screen}>
      <Header title="რეცეპტები" />
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={({ item }) => <RecipeCard key={item} />}
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 16,
  },
  header: {
    padding: 20,
    gap: 20,
    borderRadius: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "semibold",
    color: "#FFF",
    textTransform: "uppercase",
    textAlign: "center",
  },
  container: {
    gap: 10,
    paddingHorizontal: 10,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
});
