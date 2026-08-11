// ============================================
// SaveSmart — Global TypeScript Types
// ============================================

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  points: number;
  level: number;
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
  lastChallengeCompletedAt: string | null;
  createdAt: string;
  role: "user" | "admin";
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  topic: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface QuizAttempt {
  id: string;
  userId: string;
  questions: QuizQuestion[];
  selectedAnswers: number[];
  score: number;
  pointsEarned: number;
  completedAt: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  date: string;
  completed: boolean;
}

export interface SavingsEntry {
  id: string;
  userId: string;
  amount: number;
  note: string;
  createdAt: string;
}

export interface SavingTip {
  id: string;
  text: string;
  generatedAt: string;
  isPersonalized: boolean;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  points: number;
  level: number;
  rank: number;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated" | "error";

export interface ApiError {
  code: string;
  message: string;
}
