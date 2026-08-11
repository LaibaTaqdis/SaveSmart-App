import React from "react";
import { View } from "react-native";

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
}

export function ProgressBar({ progress, color = "#0F766E", trackColor = "#E2E8F0", height = 10 }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: trackColor, overflow: "hidden", width: "100%" }}>
      <View
        style={{
          height: "100%",
          width: `${clamped * 100}%`,
          backgroundColor: color,
          borderRadius: height / 2,
        }}
      />
    </View>
  );
}
