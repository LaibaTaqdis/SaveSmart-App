import { LEVEL_THRESHOLDS, BADGE_DEFINITIONS } from "@constants/theme";
import type { Badge, UserProfile } from "@/types";
import { logger } from "./logger";

/**
 * Gamification Engine
 * Pure functions that compute level, badge eligibility, and streak logic.
 * Kept side-effect free so they can be unit tested independently of Firestore.
 */

export function calculateLevel(points: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (points >= LEVEL_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

export function pointsToNextLevel(points: number): { needed: number; nextThreshold: number } {
  const currentLevel = calculateLevel(points);
  const nextThreshold = LEVEL_THRESHOLDS[currentLevel] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  return { needed: Math.max(nextThreshold - points, 0), nextThreshold };
}

export function calculateQuizPoints(correctCount: number, totalQuestions: number): number {
  const basePointsPerQuestion = 10;
  const bonus = correctCount === totalQuestions ? 20 : 0;
  return correctCount * basePointsPerQuestion + bonus;
}

export function evaluateNewBadges(profile: UserProfile, context: { quizPerfectStreak?: number }): Badge[] {
  const earnedIds = new Set(profile.badges.map((b) => b.id));
  const newBadges: Badge[] = [];
  const now = new Date().toISOString();

  const maybeAward = (id: string) => {
    if (earnedIds.has(id)) return;
    const def = BADGE_DEFINITIONS.find((b) => b.id === id);
    if (!def) return;
    newBadges.push({ ...def, earnedAt: now });
  };

  if (profile.badges.length === 0 && profile.points > 0) maybeAward("first-quiz");
  if (profile.currentStreak >= 7) maybeAward("streak-7");
  if (profile.currentStreak >= 30) maybeAward("streak-30");
  if (calculateLevel(profile.points) >= 5) maybeAward("level-5");
  if ((context.quizPerfectStreak ?? 0) >= 5) maybeAward("quiz-master");

  if (newBadges.length > 0) {
    logger.info("Gamification", `Awarding ${newBadges.length} new badge(s)`, newBadges.map((b) => b.id));
  }

  return newBadges;
}

export function updateStreak(lastCompletedAt: string | null, currentStreak: number): number {
  if (!lastCompletedAt) return 1;

  const last = new Date(lastCompletedAt);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return currentStreak; // already completed today
  if (diffDays === 1) return currentStreak + 1; // consecutive day
  return 1; // streak broken, restart
}
