import { Colors } from "@/constants/theme";
import { useEffect, useRef } from "react";
import { Animated, useColorScheme } from "react-native";

type Props = {
  isActive: boolean;
};

const StepItem = ({ isActive }: Props) => {
  const colorScheme = useColorScheme() || "light";
  const width = useRef(new Animated.Value(isActive ? 24 : 10)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: isActive ? 25 : 10,
      duration: 250,
      useNativeDriver: false, // ⚠️ width can't use native driver
    }).start();
  }, [isActive]);

  return (
    <Animated.View
      style={{
        height: 10,
        width,
        borderRadius: 10,
        backgroundColor: isActive
          ? Colors[colorScheme].brand
          : Colors[colorScheme].icon,
      }}
    />
  );
};
export default StepItem;
