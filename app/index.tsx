import React from "react";
import { View, ActivityIndicator } from "react-native";

/**
 * This screen is shown only for an instant while the root layout determines
 * auth state and redirects to either (auth)/login or (tabs)/home.
 */
export default function Index() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#0B1E3D" }}>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}
