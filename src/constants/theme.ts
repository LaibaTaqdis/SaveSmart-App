export const THEME = {
  radius: {
    sm: 8,
    md: 12,
    lg: 20,
    full: 999,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  },
} as const;

// Points required to reach each level (index 0 = level 1 threshold)
export const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1400, 2000, 2700, 3500, 4500, 6000];

export const BADGE_DEFINITIONS = [
  { id: "first-quiz", name: "First Steps", description: "Completed your first quiz", icon: "🎯" },
  { id: "streak-7", name: "Consistency", description: "Maintained a 7-day challenge streak", icon: "🔥" },
  { id: "streak-30", name: "Habit Builder", description: "Maintained a 30-day challenge streak", icon: "🏆" },
  { id: "level-5", name: "Rising Saver", description: "Reached Level 5", icon: "⭐" },
  { id: "quiz-master", name: "Quiz Master", description: "Scored 100% on 5 quizzes", icon: "🧠" },
  { id: "first-saving", name: "First Deposit", description: "Logged your first savings entry", icon: "💰" },
] as const;
