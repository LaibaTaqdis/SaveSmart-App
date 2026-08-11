import { useCallback } from "react";
import { useQuizStore } from "@stores/quizStore";
import { useUserStore } from "@stores/userStore";
import { useAuthStore } from "@stores/authStore";

/**
 * Convenience hook that wires the quiz store to the current authenticated
 * user, so quiz screens don't need to manually pass uid everywhere.
 */
export function useQuiz() {
  const uid = useAuthStore((s) => s.firebaseUser?.uid);
  const addPoints = useUserStore((s) => s.addPoints);

  const questions = useQuizStore((s) => s.questions);
  const selectedAnswers = useQuizStore((s) => s.selectedAnswers);
  const isLoading = useQuizStore((s) => s.isLoading);
  const isSubmitted = useQuizStore((s) => s.isSubmitted);
  const score = useQuizStore((s) => s.score);
  const pointsEarned = useQuizStore((s) => s.pointsEarned);
  const loadQuiz = useQuizStore((s) => s.loadQuiz);
  const selectAnswer = useQuizStore((s) => s.selectAnswer);
  const submitQuiz = useQuizStore((s) => s.submitQuiz);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);

  const submit = useCallback(async () => {
    if (!uid) return;
    await submitQuiz(uid);
    const { pointsEarned: earned } = useQuizStore.getState();
    if (earned > 0) {
      await addPoints(uid, earned);
    }
  }, [uid, submitQuiz, addPoints]);

  return {
    questions,
    selectedAnswers,
    isLoading,
    isSubmitted,
    score,
    pointsEarned,
    loadQuiz,
    selectAnswer,
    submit,
    resetQuiz,
  };
}
