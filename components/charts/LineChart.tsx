import {
  Canvas,
  Circle,
  LinearGradient,
  Path,
  Skia,
  vec,
} from "@shopify/react-native-skia";
import React, { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
} from "react-native";

type Props = {
  values: number[];
  color: string;
  height?: number;
  goal?: number;
  goalColor?: string;
  showLastDot?: boolean;
};

export const LineChart = ({
  values,
  color,
  height = 130,
  goal,
  goalColor,
  showLastDot = true,
}: Props) => {
  const [w, setW] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => {
    const next = e.nativeEvent.layout.width;
    if (next !== w) setW(next);
  };

  const padTop = 12;
  const padBottom = 12;
  const innerH = height - padTop - padBottom;

  const allVals = goal !== undefined ? [...values, goal] : values;
  const max = Math.max(...allVals);
  const min = Math.min(...allVals);
  const range = max - min || 1;

  const points = useMemo(() => {
    if (w === 0 || values.length === 0) return [];
    return values.map((v, i) => ({
      x: (i / Math.max(values.length - 1, 1)) * w,
      y: padTop + innerH * (1 - (v - min) / range),
    }));
  }, [values, w, innerH, min, range]);

  const linePath = useMemo(() => {
    if (points.length === 0) return null;
    const p = Skia.Path.Make();
    points.forEach((pt, i) => {
      if (i === 0) {
        p.moveTo(pt.x, pt.y);
        return;
      }
      const prev = points[i - 1];
      const midX = (prev.x + pt.x) / 2;
      p.cubicTo(midX, prev.y, midX, pt.y, pt.x, pt.y);
    });
    return p;
  }, [points]);

  const areaPath = useMemo(() => {
    if (!linePath || points.length === 0 || w === 0) return null;
    const p = linePath.copy();
    p.lineTo(w, height);
    p.lineTo(0, height);
    p.close();
    return p;
  }, [linePath, points, w, height]);

  const goalY =
    goal !== undefined
      ? padTop + innerH * (1 - (goal - min) / range)
      : null;

  const last = points[points.length - 1];

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {w > 0 && linePath && (
        <Canvas style={StyleSheet.absoluteFill}>
          {areaPath && (
            <Path path={areaPath}>
              <LinearGradient
                start={vec(0, 0)}
                end={vec(0, height)}
                colors={[color + "55", color + "00"]}
              />
            </Path>
          )}
          {goalY !== null && goalColor && (
            <Path
              path={`M 0 ${goalY} L ${w} ${goalY}`}
              style="stroke"
              strokeWidth={1.2}
              color={goalColor}
              opacity={0.5}
            />
          )}
          <Path
            path={linePath}
            style="stroke"
            strokeWidth={2.5}
            color={color}
            strokeCap="round"
            strokeJoin="round"
          />
          {showLastDot && last && (
            <>
              <Circle cx={last.x} cy={last.y} r={6} color={color} opacity={0.25} />
              <Circle cx={last.x} cy={last.y} r={3.5} color={color} />
            </>
          )}
        </Canvas>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});
