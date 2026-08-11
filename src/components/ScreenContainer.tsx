import React from "react";
import { View, ScrollView, ScrollViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ScreenContainerProps extends ScrollViewProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export function ScreenContainer({ children, scrollable = true, ...scrollProps }: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 bg-surface">
      {scrollable ? (
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 16 }}
          keyboardShouldPersistTaps="handled"
          {...scrollProps}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1 px-4 py-4">{children}</View>
      )}
    </SafeAreaView>
  );
}
