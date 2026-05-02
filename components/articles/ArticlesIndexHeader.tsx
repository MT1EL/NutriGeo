import { GradientView } from "@/components/ui/GradientView";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ArticlesIndexHeader() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <GradientView
      colors={[theme.brandDeep, theme.brand]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      borderRadius={Radius.xl}
      style={styles.headerContainer}
    >
      <SafeAreaView edges={["top"]} style={styles.headerSafe}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={8}
            style={styles.iconBtn}
            activeOpacity={0.8}
          >
            <ChevronLeft color="#FFFFFF" size={22} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle} color="#FFFFFF">
            სტატიები
          </ThemedText>
          <View style={styles.iconBtn} />
        </View>
        <ThemedText
          style={styles.headerSubtitle}
          color="rgba(255,255,255,0.85)"
        >
          ნუტრიციის გზამკვლევი ყოველდღიური არჩევანისთვის
        </ThemedText>
      </SafeAreaView>
    </GradientView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingBottom: Spacing.xxxl,
  },
  headerSafe: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  headerTitle: {
    fontSize: Type.xl,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: Type.sm,
  },
});
