import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { Link } from "expo-router";
import { ScreenContainer } from "@components/ScreenContainer";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { validateSignUpForm } from "@utils/validators";
import { STRINGS } from "@constants/strings";
import { logger } from "@utils/logger";

export default function SignUpScreen() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    const result = validateSignUpForm(name, email, password);
    if (!result.valid) {
      setErrorMessage(result.error ?? STRINGS.errors.genericAuth);
      return;
    }
    setErrorMessage(null);
    setSubmitting(true);
    try {
      await signup(name, email, password);
    } catch (error: any) {
      logger.error("SignUpScreen", "Sign up attempt failed", error);
      Alert.alert("Sign Up Failed", error?.message ?? STRINGS.errors.genericAuth);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="mt-16 mb-10 items-center">
        <Text className="text-3xl font-bold text-navy">Create your account</Text>
        <Text className="text-sm text-muted mt-1">Start your savings journey today</Text>
      </View>

      <Input label="Full Name" placeholder="Laiba Khan" value={name} onChangeText={setName} />
      <Input
        label="Email"
        placeholder="you@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <Input label="Password" placeholder="At least 8 characters" secureTextEntry value={password} onChangeText={setPassword} />

      {errorMessage ? <Text className="text-danger text-sm mb-4">{errorMessage}</Text> : null}

      <Button label="Sign Up" onPress={handleSignUp} loading={submitting} />

      <View className="flex-row justify-center mt-6">
        <Text className="text-muted text-sm">Already have an account? </Text>
        <Link href="/(auth)/login">
          <Text className="text-teal text-sm font-semibold">Log In</Text>
        </Link>
      </View>
    </ScreenContainer>
  );
}
