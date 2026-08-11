import React, { useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@components/ScreenContainer";
import { Card } from "@components/Card";
import { Button } from "@components/Button";
import { useQuiz } from "@hooks/useQuiz";

export default function QuizScreen() {
  const {
    questions, selectedAnswers, isLoading, isSubmitted, score, pointsEarned,
    loadQuiz, selectAnswer, submit, resetQuiz,
  } = useQuiz();

  useEffect(() => {
    loadQuiz("personal finance basics");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allAnswered = selectedAnswers.length > 0 && selectedAnswers.every((a) => a !== -1);

  if (isLoading) {
    return (
      <ScreenContainer scrollable={false}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0F766E" />
          <Text className="text-muted mt-3">Generating your quiz…</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (isSubmitted) {
    return (
      <ScreenContainer scrollable={false}>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-3xl mb-2">🎉</Text>
          <Text className="text-2xl font-bold text-navy mb-2">
            You scored {score}/{questions.length}
          </Text>
          <Text className="text-teal font-semibold text-lg mb-6">+{pointsEarned} points earned</Text>
          <Button
            label="Take Another Quiz"
            onPress={() => {
              resetQuiz();
              loadQuiz("personal finance basics");
            }}
          />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <Text className="text-2xl font-bold text-navy mt-4 mb-4">Financial Literacy Quiz</Text>

      {questions.map((q, qIndex) => (
        <Card key={q.id} className="mb-4">
          <Text className="text-base font-semibold text-navy mb-3">
            {qIndex + 1}. {q.question}
          </Text>
          {q.options.map((option, oIndex) => {
            const isSelected = selectedAnswers[qIndex] === oIndex;
            return (
              <Pressable
                key={oIndex}
                onPress={() => selectAnswer(qIndex, oIndex)}
                className={`rounded-xl border px-4 py-3 mb-2 ${
                  isSelected ? "border-teal bg-teal/10" : "border-border bg-white"
                }`}
              >
                <Text className={`text-sm ${isSelected ? "text-teal font-semibold" : "text-black"}`}>{option}</Text>
              </Pressable>
            );
          })}
        </Card>
      ))}

      <Button label="Submit Quiz" onPress={submit} disabled={!allAnswered} />
    </ScreenContainer>
  );
}
