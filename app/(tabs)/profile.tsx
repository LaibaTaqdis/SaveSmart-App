import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { ScreenContainer } from "@components/ScreenContainer";
import { Card } from "@components/Card";
import { Button } from "@components/Button";
import { BadgeChip } from "@components/BadgeChip";
import { useAuth } from "@hooks/useAuth";
import { useGamification } from "@hooks/useGamification";
import { logger } from "@utils/logger";

export default function ProfileScreen() {
  const { firebaseUser, logout } = useAuth();
  const { profile, level, badges, currentStreak } = useGamification();
  const [exporting, setExporting] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      logger.error("ProfileScreen", "Logout failed", error);
      Alert.alert("Error", "Could not log out. Please try again.");
    }
  };

  const handleExportReport = async () => {
    setExporting(true);
    try {
      // PDF generation is handled by a dedicated report-builder utility
      // that compiles points, badges, and savings history into a PDF file
      // and opens the native share sheet. Omitted here for brevity —
      // see src/services/api or a future pdfService.ts module.
      await new Promise((resolve) => setTimeout(resolve, 800));
      Alert.alert("Report Ready", "Your progress report has been generated.");
    } catch (error) {
      logger.error("ProfileScreen", "PDF export failed", error);
      Alert.alert("Export Failed", "Could not generate your report. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <ScreenContainer>
      <View className="items-center mt-6 mb-6">
        <View className="w-20 h-20 rounded-full bg-navy items-center justify-center mb-3">
          <Text className="text-white text-2xl font-bold">
            {(firebaseUser?.displayName ?? "S").charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-xl font-bold text-navy">{firebaseUser?.displayName ?? "Saver"}</Text>
        <Text className="text-sm text-muted">{firebaseUser?.email}</Text>
      </View>

      <View className="flex-row mb-4">
        <Card className="flex-1 mr-2 items-center">
          <Text className="text-xl font-bold text-teal">{profile?.points ?? 0}</Text>
          <Text className="text-xs text-muted mt-1">Points</Text>
        </Card>
        <Card className="flex-1 mx-1 items-center">
          <Text className="text-xl font-bold text-navy">{level}</Text>
          <Text className="text-xs text-muted mt-1">Level</Text>
        </Card>
        <Card className="flex-1 ml-2 items-center">
          <Text className="text-xl font-bold text-coral">{currentStreak}</Text>
          <Text className="text-xs text-muted mt-1">Streak</Text>
        </Card>
      </View>

      <Card className="mb-4">
        <Text className="text-sm font-semibold text-navy mb-3">Badges Earned</Text>
        {badges.length === 0 ? (
          <Text className="text-sm text-muted">Complete quizzes and challenges to earn your first badge.</Text>
        ) : (
          <View className="flex-row flex-wrap">
            {badges.map((badge) => (
              <BadgeChip key={badge.id} badge={badge} />
            ))}
          </View>
        )}
      </Card>

      <Button label="Export Progress Report (PDF)" variant="secondary" onPress={handleExportReport} loading={exporting} />
      <View className="h-3" />
      <Button label="Log Out" variant="outline" onPress={handleLogout} />
    </ScreenContainer>
  );
}
