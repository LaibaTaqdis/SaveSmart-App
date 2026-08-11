import { create } from "zustand";
import type { QuizQuestion } from "@/types";
import { generateQuiz } from "@services/api/groqService";
import { saveQuizAttempt } from "@services/firebase/firestoreService";
import { calculateQuizPoints } from "@utils/gamification";
import { logger } from "@utils/logger";

interface QuizState {
  questions: QuizQuestion[];
  selectedAnswers: number[];
  isLoading: boolean;
  isSubmitted: boolean;
  score: number;
  pointsEarned: number;

  loadQuiz: (topic?: string) => Promise<void>;
  selectAnswer: (questionIndex: number, optionIndex: number) => void;
  submitQuiz: (uid: string) => Promise<void>;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  selectedAnswers: [],
  isLoading: false,
  isSubmitted: false,
  score: 0,
  pointsEarned: 0,

  loadQuiz: async (topic) => {
    set({ isLoading: true, isSubmitted: false, score: 0, pointsEarned: 0 });
    try {
      const questions = await generateQuiz(topic);
      set({
        questions,
        selectedAnswers: new Array(questions.length).fill(-1),
        isLoading: false,
      });
    } catch (error) {
      logger.error("QuizStore", "Failed to load quiz", error);
      set({ isLoading: false });
    }
  },

  selectAnswer: (questionIndex, optionIndex) => {
    const updated = [...get().selectedAnswers];
    updated[questionIndex] = optionIndex;
    set({ selectedAnswers: updated });
  },

  submitQuiz: async (uid) => {
    const { questions, selectedAnswers } = get();
    const correctCount = questions.reduce(
      (count, q, i) => (selectedAnswers[i] === q.correctAnswerIndex ? count + 1 : count),
      0
    );
    const pointsEarned = calculateQuizPoints(correctCount, questions.length);

    await saveQuizAttempt({
      userId: uid,
      questions,
      selectedAnswers,
      score: correctCount,
      pointsEarned,
      completedAt: new Date().toISOString(),
    });

    set({ isSubmitted: true, score: correctCount, pointsEarned });
    logger.info("QuizStore", "Quiz submitted", { correctCount, total: questions.length, pointsEarned });
  },

  resetQuiz: () => set({ questions: [], selectedAnswers: [], isSubmitted: false, score: 0, pointsEarned: 0 }),
}));
