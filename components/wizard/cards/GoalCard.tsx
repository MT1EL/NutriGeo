import ThemedText from "@/components/ui/ThemedText";
import ThemedView from "@/components/ui/ThemedView";
import { Colors } from "@/constants/theme";
import { LucideProps } from "lucide-react-native";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Props = {
  goal: {
    title: string;
    subtitle: string;
    Icon: React.ForwardRefExoticComponent<
      LucideProps & React.RefAttributes<SVGSVGElement>
    >;
    tintColor: string;
    iconColor: string;
  };
  isActive: boolean;
  onPress: () => void;
  isError?: boolean;
};

const GoalCard = ({ goal, isActive, onPress, isError }: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { Icon, title, subtitle, tintColor, iconColor } = goal;
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        backgroundColor={isActive ? theme.tint : undefined}
        style={[
          styles.card,
          (isActive || isError) && {
            borderColor: isError ? theme.error : theme.brand,
          },
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: tintColor }]}>
          <Icon size={32} color={iconColor} />
        </View>

        <View style={styles.contentContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle} type="secondary">
            {subtitle}
          </ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
};

export default GoalCard;
const styles = StyleSheet.create({
  card: {
    padding: 20,
    flexDirection: "row",
    gap: 24,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 8,
  },
  contentContainer: {
    gap: 4,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "semibold",
  },
  subtitle: {
    fontSize: 14,
    flexShrink: 1,
  },
});
