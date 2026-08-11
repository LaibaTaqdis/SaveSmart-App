import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@components/ScreenContainer";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { isValidEmail } from "@utils/validators";
import { STRINGS } from "@constants/strings";
import { logger } from "@utils/logger";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    const nextErrors: typeof errors = {};
    if (!isValidEmail(email)) nextErrors.email = "Please enter a valid email address.";
    if (password.length === 0) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await login(email, password);
    } catch (error: any) {
      logger.error("LoginScreen", "Login attempt failed", error);
      Alert.alert("Login Failed", error?.message ?? STRINGS.errors.genericAuth);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="mt-16 mb-10 items-center">
        <Text className="text-3xl font-bold text-navy">SaveSmart</Text>
        <Text className="text-sm text-muted mt-1">{STRINGS.tagline}</Text>
      </View>

      <Text className="text-2xl font-bold text-navy mb-6">Welcome back</Text>

      <Input
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        errorMessage={errors.email}
      />
      <Input
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        errorMessage={errors.password}
      />

      <Link href="/(auth)/forgot-password" className="self-end mb-6">
        <Text className="text-teal text-sm font-medium">Forgot password?</Text>
      </Link>

      <Button label="Log In" onPress={handleLogin} loading={submitting} />

      <View className="flex-row justify-center mt-6">
        <Text className="text-muted text-sm">Don't have an account? </Text>
        <Link href="/(auth)/signup">
          <Text className="text-teal text-sm font-semibold">Sign Up</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}
