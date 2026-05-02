import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { ChevronLeft, Search } from "lucide-react-native";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GradientView } from "../ui/GradientView";
import Input from "../ui/Input";
import ThemedText from "../ui/ThemedText";

type button = {
  label: string;
  Icon: React.ComponentType<{ color: string; size: number }>;
};

type Props = {
  title: string;
  hasGoBack?: boolean;
  hasInput?: boolean;
  inputPlaceholder?: string;
  buttons?: button[];
  activeButton?: string;
  onButtonPress?: (button: button) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
};

const Header = ({
  title,
  hasGoBack = false,
  hasInput = true,
  inputPlaceholder = "მოძებნე რეცეპტი...",
  buttons,
  activeButton,
  onButtonPress,
  searchValue,
  onSearchChange,
}: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <GradientView
      colors={[theme.brandDeep, theme.brand]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      borderRadius={Radius.xl}
    >
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerRow}>
          {hasGoBack && <ChevronLeft color={"#FFF"} />}
          <ThemedText style={styles.title}>{title}</ThemedText>
          {hasGoBack && <ChevronLeft color={"transparent"} />}
        </View>
        <View>
          {hasInput && (
            <Input
              Icon={Search}
              placeholder={inputPlaceholder}
              compact
              value={searchValue}
              onChangeText={onSearchChange}
            />
          )}
          {buttons && (
            <FlatList
              data={buttons}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: Spacing.sm }}
              keyExtractor={(item) => item.label}
              renderItem={({ item }) => {
                const isActive = activeButton === item.label;
                return (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      {
                        backgroundColor: isActive
                          ? "#FFFFFF"
                          : "rgba(255,255,255,0.18)",
                      },
                    ]}
                    onPress={() => onButtonPress?.(item)}
                    activeOpacity={0.85}
                  >
                    <item.Icon
                      color={isActive ? theme.brand : "#FFFFFF"}
                      size={14}
                    />
                    <ThemedText
                      style={styles.label}
                      color={isActive ? theme.brand : "#FFFFFF"}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </GradientView>
  );
};

export default Header;
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    flex: 1,
    letterSpacing: 0.2,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs + 2,
    borderRadius: Radius.pill,
  },
  label: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
});
