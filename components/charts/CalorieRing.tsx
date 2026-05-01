import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type Props = {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  goal?: number;
  color?: string;
  textColor?: string;
  trackColor?: string;
  label?: string;
};

export const CalorieRing = ({
  size = 200,
  strokeWidth = 14,
  progress,
  goal,
  color = "#50E3C2",
  textColor = "#FFFFFF",
  trackColor = "rgba(255,255,255,0.2)",
  label = "KCAL LEFT",
}: Props) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  const caloriesLeft = goal ? goal - progress : 0;

  const animated = useSharedValue(0);

  useEffect(() => {
    animated.value = withTiming(Math.min(Math.max(progress, 0), 1), {
      duration: 900,
    });
  }, [progress, animated]);

  const backgroundPath = React.useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(center, center, radius);
    return p;
  }, [center, radius]);

  const animatedPath = useDerivedValue(() => {
    const p = Skia.Path.Make();
    p.addCircle(center, center, radius);
    return p;
  }, [center, radius]);

  // We animate via the `end` prop on Path (Skia draws fraction of the path).
  const end = useDerivedValue(() => animated.value);
  // Skia rotates the path so the start sits at the top.
  const transform = [{ rotate: -Math.PI / 2 }];
  const origin = { x: center, y: center };

  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Canvas style={{ position: "absolute", width: size, height: size }}>
        <Path
          path={backgroundPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color={trackColor}
          strokeCap="round"
        />
        <Path
          path={animatedPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color={color}
          strokeCap="round"
          start={0}
          end={end}
          origin={origin}
          transform={transform}
        />
      </Canvas>

      <Text
        style={{
          fontSize: 44,
          fontWeight: "700",
          color: textColor,
          letterSpacing: -1,
        }}
      >
        {caloriesLeft}
      </Text>
      <Text
        style={{
          fontSize: 11,
          color: textColor,
          opacity: 0.85,
          letterSpacing: 1.5,
          fontWeight: "600",
          marginTop: 2,
        }}
      >
        {label}
      </Text>
      {goal !== undefined && (
        <Text
          style={{
            fontSize: 12,
            color: textColor,
            opacity: 0.7,
            marginTop: 4,
          }}
        >
          {`${goal - caloriesLeft} / ${goal}`}
        </Text>
      )}
    </View>
  );
};
