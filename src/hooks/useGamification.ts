import { useMemo } from "react";
import { useUserStore } from "@stores/userStore";
import { calculateLevel, pointsToNextLevel } from "@utils/gamification";

/**
 * Derives gamification-related display values (progress to next level,
 * points remaining) from the current user profile without re-fetching data.
 */
export function useGamification() {
  const profile = useUserStore((s) => s.profile);

  const progress = useMemo(() => {
    if (!profile) return { percentage: 0, pointsNeeded: 0, level: 1 };

    const level = calculateLevel(profile.points);
    const { needed, nextThreshold } = pointsToNextLevel(profile.points);
    const levelStartPoints = nextThreshold - needed === profile.points ? 0 : nextThreshold;
    const percentage = nextThreshold > 0 ? Math.min(profile.points / nextThreshold, 1) : 1;

    return { percentage, pointsNeeded: needed, level };
  }, [profile]);

  return {
    profile,
    level: progress.level,
    progressPercentage: progress.percentage,
    pointsToNextLevel: progress.pointsNeeded,
    badges: profile?.badges ?? [],
    currentStreak: profile?.currentStreak ?? 0,
  };
}
