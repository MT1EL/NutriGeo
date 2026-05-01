import { Colors } from "@/constants/theme";
import { Image } from "expo-image";
import {
  ChartNoAxesColumnIncreasingIcon,
  Clock,
  Users,
} from "lucide-react-native";
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

const RecipeCard = (props: Props) => {
  const colorScheme = useColorScheme() || "light";
  const stats = [
    {
      Icon: Clock,
      label: "45 წთ.",
    },
    {
      Icon: Users,
      label: "1 პორცია",
    },
    {
      Icon: ChartNoAxesColumnIncreasingIcon,
      label: "საშუალო",
    },
  ];
  return (
    <TouchableOpacity onPress={() => console.log("Recipe has been pressed")}>
      <BaseCard style={styles.card}>
        <Image
          source={require("@/assets/images/cheesecake.png")}
          style={styles.cover}
        />

        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title}>ჩიზქეიქი</ThemedText>
              <ThemedText
                style={styles.title}
                color={Colors[colorScheme].brand}
              >
                321 კალ
              </ThemedText>
            </View>
            <ThemedText type="secondary" style={styles.smallDescription}>
              იტალიური დესერტი მდიდრულ იგემოებით
            </ThemedText>
          </View>

          <View style={styles.statsRow}>
            {stats.map(({ Icon, label }) => (
              <View key={label} style={styles.stat}>
                <Icon size={16} color={Colors[colorScheme].textSecondary} />
                <ThemedText type="secondary" style={styles.statLabel}>
                  {label}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </BaseCard>
    </TouchableOpacity>
  );
};

export default RecipeCard;
const styles = StyleSheet.create({
  card: {
    gap: 12,
    padding: 10,
  },
  cover: {
    width: "100%",
    aspectRatio: 2.5,
  },
  content: {
    gap: 20,
  },
  headerContainer: {
    gap: 4,
  },
  titleRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "semibold",
  },
  smallDescription: {
    fontSize: 10,
  },
  statsRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
  },
  stat: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "semibold",
  },
});
