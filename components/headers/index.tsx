import { Colors } from "@/constants/theme";
import { ChevronLeft, Search } from "lucide-react-native";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../ui/Input";

type Props = {
  title: string;
  hasGoBack?: boolean;
  hasInput?: boolean;
};

const Header = ({ title, hasGoBack = false, hasInput = true }: Props) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.header, { backgroundColor: Colors[colorScheme].brand }]}
    >
      <View style={styles.headerRow}>
        {hasGoBack && <ChevronLeft color={Colors[colorScheme].text} />}
        <Text style={styles.title}>{title}</Text>
        {hasGoBack && <ChevronLeft color={"transparent"} />}
      </View>
      {hasInput && <Input Icon={Search} placeholder="მოძებნე რეცეპტი..." />}
    </SafeAreaView>
  );
};

export default Header;
const styles = StyleSheet.create({
  screen: {
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
    flex: 1,
  },
});
