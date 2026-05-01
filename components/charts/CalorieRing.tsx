import { Canvas, Path } from "@shopify/react-native-skia";
import { Text, View } from "react-native";

type Props = {
  size?: number;
  strokeWidth?: number;
  progress: number; // 0 to 1
  caloriesLeft: number;
  color?: string;
};

export const CalorieRing = ({
  size = 200,
  strokeWidth = 14,
  progress,
  caloriesLeft,
  color = "#50E3C2",
}: Props) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;

  // Clamp progress between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  // Background circle — full ring
  const backgroundPath = `
    M ${center} ${strokeWidth / 2}
    A ${radius} ${radius} 0 1 1 ${center - 0.001} ${strokeWidth / 2}
  `;

  // Progress arc
  const angle = clampedProgress * 2 * Math.PI;
  const startX = center;
  const startY = strokeWidth / 2;
  const endX = center + radius * Math.sin(angle);
  const endY = center - radius * Math.cos(angle);
  const largeArc = clampedProgress > 0.5 ? 1 : 0;

  const progressPath =
    clampedProgress >= 1
      ? backgroundPath
      : `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`;

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
        {/* Background ring */}
        <Path
          path={backgroundPath}
          style="stroke"
          strokeWidth={strokeWidth}
          color="rgba(255,255,255,0.2)"
          strokeCap="round"
        />
        {/* Progress ring */}
        {clampedProgress > 0 && (
          <Path
            path={progressPath}
            style="stroke"
            strokeWidth={strokeWidth}
            color={color}
            strokeCap="round"
          />
        )}
      </Canvas>

      {/* Center text */}
      <Text style={{ fontSize: 40, fontWeight: "bold", color: "white" }}>
        {caloriesLeft}
      </Text>
      <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
        KCAL LEFT
      </Text>
    </View>
  );
};
