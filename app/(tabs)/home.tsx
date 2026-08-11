import React, { useEffect, useState } from "react";
import { View, Text, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@components/ScreenContainer";
import { Card } from "@components/Card";
import { Button } from "@components/Button";
import { ProgressBar } from "@components/ProgressBar";
import { useAuthStore } from "@stores/authStore";
import { useGamification } from "@hooks/useGamification";
import { generatePersonalizedTip } from "@services/api/groqService";
import type { SavingTip } from "@/types";
import { logger } from "@utils/logger";

export default function HomeScreen() {
  const router = useRouter();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const { profile, level, progressPercentage, pointsToNextLevel, currentStreak } = useGamification();
  const [tip, setTip] = useState<SavingTip | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadTip = async () => {
    try {
      const generated = await generatePersonalizedTip({
        recentSavingsAmounts: [],
        currentStreak,
        quizAccuracy: 0.7,
      });
      setTip(generated);
    } catch (error) {
      logger.error("HomeScreen", "Failed to load saving tip", error);
    }
  };

  useEffect(() => {
    loadTip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTip();
    setRefreshing(false);
  };

  return (
    <ScreenContainer refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      <View className="mt-4 mb-6">
        <Text className="text-lg text-muted">Welcome back,</Text>
        <Text className="text-2xl font-bold text-navy">{firebaseUser?.displayName ?? "Saver"} 👋</Text>
      </View>

      <Card className="mb-4">
        <Text className="text-sm text-muted mb-1">Level {level}</Text>
        <ProgressBar progress={progressPercentage} />
        <Text className="text-xs text-muted mt-2">{pointsToNextLevel} points to next level</Text>
      </Card>

      <View className="flex-row mb-4">
        <Card className="flex-1 mr-2 items-center">
          <Text className="text-2xl font-bold text-teal">{profile?.points ?? 0}</Text>
          <Text className="text-xs text-muted mt-1">Total Points</Text>
        </Card>
        <Card className="flex-1 ml-2 items-center">
          <Text className="text-2xl font-bold text-coral">{currentStreak}🔥</Text>
          <Text className="text-xs text-muted mt-1">Day Streak</Text>
        </Card>
      </View>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-navy mb-2">💡 Today's Saving Tip</Text>
        <Text className="text-sm text-black leading-5">{tip?.text ?? "Loading your personalized tip..."}</Text>
      </Card>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-navy mb-2">🎯 Today's Challenge</Text>
        <Text className="text-sm text-black mb-3">
          Log a savings entry today and keep your streak alive!
        </Text>
        <Button label="Go to Dashboard" variant="outline" onPress={() => router.push("/(tabs)/dashboard")} />
      </Card>

      <Button label="Take Today's Quiz" onPress={() => router.push("/(tabs)/quiz")} />
    </ScreenContainer>
  );
}
