import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, ...viewProps }: CardProps & { className?: string }) {
  return (
    <View
      className={`bg-white rounded-2xl p-4 shadow-sm border border-border ${className ?? ""}`}
      {...viewProps}
    >
      {children}
    </View>
  );
}
