import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@components/ScreenContainer";
import { Card } from "@components/Card";
import { useAuthStore } from "@stores/authStore";
import { getLeaderboard } from "@services/firebase/firestoreService";
import type { LeaderboardEntry } from "@/types";
import { logger } from "@utils/logger";

export default function LeaderboardScreen() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getLeaderboard(20);
        setEntries(data);
      } catch (error) {
        logger.error("LeaderboardScreen", "Failed to load leaderboard", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <ScreenContainer scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F766E" />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-navy mt-4 mb-4">Leaderboard</Text>

      <Card>
        {entries.length === 0 ? (
          <Text className="text-sm text-muted">No rankings yet — be the first to earn points!</Text>
        ) : (
          entries.map((entry) => {
            const isCurrentUser = entry.uid === uid;
            return (
              <View
                key={entry.uid}
                className={`flex-row items-center justify-between py-3 border-b border-border ${
                  isCurrentUser ? "bg-teal/10 -mx-4 px-4 rounded-lg" : ""
                }`}
              >
                <View className="flex-row items-center">
                  <Text className="w-8 text-sm font-bold text-navy">#{entry.rank}</Text>
                  <Text className={`text-sm ${isCurrentUser ? "font-bold text-teal" : "text-black"}`}>
                    {entry.name} {isCurrentUser ? "(You)" : ""}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-sm font-semibold text-navy">{entry.points} pts</Text>
                  <Text className="text-xs text-muted">Level {entry.level}</Text>
                </View>
              </View>
            );
          })
        )}
      </Card>
    </ScreenContainer>
  );
}
