import React from "react";
import { Pressable, Text, ActivityIndicator, PressableProps } from "react-native";

interface ButtonProps extends PressableProps {
  label: string;
  variant?: "primary" | "secondary" | "outline";
  loading?: boolean;
  disabled?: boolean;
}

const VARIANT_STYLES: Record<string, string> = {
  primary: "bg-navy active:bg-navy-light",
  secondary: "bg-teal active:bg-teal-dark",
  outline: "bg-transparent border border-navy",
};

const VARIANT_TEXT_STYLES: Record<string, string> = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-navy",
};

export function Button({ label, variant = "primary", loading, disabled, ...pressableProps }: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      className={`rounded-xl py-4 px-6 items-center justify-center ${VARIANT_STYLES[variant]} ${
        isDisabled ? "opacity-50" : ""
      }`}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#0B1E3D" : "#FFFFFF"} />
      ) : (
        <Text className={`font-semibold text-base ${VARIANT_TEXT_STYLES[variant]}`}>{label}</Text>
      )}
    </Pressable>
  );
}
