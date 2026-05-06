import { Canvas, LinearGradient, Rect, vec } from "@shopify/react-native-skia";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type Props = {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  borderRadius?: number;
  borderBottomRadius?: number;
};

export const GradientView = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
  borderRadius,
  borderBottomRadius,
}: Props) => {
  const [size, setSize] = useState({ w: 0, h: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== size.w || height !== size.h) setSize({ w: width, h: height });
  };

  return (
    <View
      style={[
        style,
        borderRadius || borderBottomRadius
          ? {
              borderRadius,
              borderBottomRightRadius: borderBottomRadius,
              borderBottomLeftRadius: borderBottomRadius,
              overflow: "hidden",
            }
          : null,
      ]}
      onLayout={onLayout}
    >
      {size.w > 0 && size.h > 0 && (
        <View
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          collapsable={false}
        >
          <Canvas style={StyleSheet.absoluteFill}>
            <Rect x={0} y={0} width={size.w} height={size.h}>
              <LinearGradient
                start={vec(start.x * size.w, start.y * size.h)}
                end={vec(end.x * size.w, end.y * size.h)}
                colors={colors}
              />
            </Rect>
          </Canvas>
        </View>
      )}
      {children}
    </View>
  );
};
