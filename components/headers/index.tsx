import { Colors } from "@/constants/theme";
import { ChevronLeft, Search } from "lucide-react-native";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "../themed-text";
import Input from "../ui/Input";

type button = {
  label: string;
  Icon: React.ComponentType<{ color: string; size: number }>;
};

type Props = {
  title: string;
  hasGoBack?: boolean;
  hasInput?: boolean;
  buttons?: button[];
  activeButton?: string;
  onButtonPress?: (button: button) => void;
};

const Header = ({
  title,
  hasGoBack = false,
  hasInput = true,
  buttons,
  activeButton,
  onButtonPress,
}: Props) => {
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
      <View style={{ gap: 8 }}>
        {hasInput && <Input Icon={Search} placeholder="მოძებნე რეცეპტი..." />}
        {buttons && (
          <FlatList
            data={buttons}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor:
                      activeButton === item.label
                        ? Colors[colorScheme].success
                        : Colors[colorScheme].background,
                  },
                ]}
                onPress={() => onButtonPress?.(item)}
              >
                <item.Icon color={Colors[colorScheme].text} size={14} />
                <ThemedText style={styles.label}>{item.label}</ThemedText>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 4,
    borderRadius: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "semibold",
  },
});
