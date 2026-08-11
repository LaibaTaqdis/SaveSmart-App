import React from "react";
import { View, Text, TextInput, TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
}

export function Input({ label, errorMessage, ...textInputProps }: InputProps) {
  return (
    <View className="mb-4 w-full">
      <Text className="mb-1 text-sm font-medium text-navy">{label}</Text>
      <TextInput
        className={`rounded-xl border px-4 py-3 text-base text-black bg-white ${
          errorMessage ? "border-danger" : "border-border"
        }`}
        placeholderTextColor="#6B7280"
        {...textInputProps}
      />
      {errorMessage ? <Text className="mt-1 text-xs text-danger">{errorMessage}</Text> : null}
    </View>
  );
}
