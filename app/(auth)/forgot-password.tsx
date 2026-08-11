import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@components/ScreenContainer";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { isValidEmail } from "@utils/validators";

export default function ForgotPasswordScreen() {
  const { forgotPassword } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleReset = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await forgotPassword(email);
      Alert.alert("Check your inbox", "A password reset link has been sent to your email.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err?.message ?? "Could not send reset email.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="mt-16 mb-10">
        <Text className="text-2xl font-bold text-navy">Reset your password</Text>
        <Text className="text-sm text-muted mt-2">
          Enter the email associated with your account and we'll send you a reset link.
        </Text>
      </View>

      <Input
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        errorMessage={error ?? undefined}
      />

      <Button label="Send Reset Link" onPress={handleReset} loading={submitting} />
    </ScreenContainer>
  );
}
