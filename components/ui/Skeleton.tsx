import { Colors, Radius } from "@/constants/theme";
import { useEffect } from "react";
import { StyleProp, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

type Props = {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

const Skeleton = ({ width, height = 16, radius = Radius.sm, style }: Props) => {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const opacity = useSharedValue(0.55);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width: width ?? "100%",
          height,
          borderRadius: radius,
          backgroundColor:
            colorScheme === "dark" ? theme.borderLight : theme.border,
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
