import React from "react";
import { View, Text } from "react-native";
import type { Badge } from "@/types";

interface BadgeChipProps {
  badge: Badge;
}

export function BadgeChip({ badge }: BadgeChipProps) {
  return (
    <View className="flex-row items-center bg-surface rounded-full px-3 py-2 mr-2 mb-2 border border-border">
      <Text className="text-base mr-2">{badge.icon}</Text>
      <Text className="text-xs font-medium text-navy">{badge.name}</Text>
    </View>
  );
}
