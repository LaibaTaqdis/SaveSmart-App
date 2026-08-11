import { callGroqChat, GroqApiError } from "./groqClient";
import { FALLBACK_QUIZ_QUESTIONS, FALLBACK_SAVING_TIPS } from "./fallbackData";
import { getItem, setItem, STORAGE_KEYS } from "@services/storage/asyncStorageService";
import { logger } from "@utils/logger";
import type { QuizQuestion, SavingTip } from "@/types";

// ============================================
// Groq Service — High-level AI features for SaveSmart
// - generateQuiz(): Zero-shot prompting, strict JSON-only output contract
// - generatePersonalizedTip(): Role-based prompting with user activity context
// Both functions gracefully fall back to cached/default content on failure.
// ============================================

interface UserActivitySummary {
  recentSavingsAmounts: number[];
  currentStreak: number;
  quizAccuracy: number; // 0–1
}

function extractJson(raw: string): unknown {
  // Groq sometimes wraps JSON in prose or code fences despite instructions.
  // Strip markdown fences and attempt to locate the first valid JSON array/object.
  const cleaned = raw.replace(/```json|```/g, "").trim();
  const start = cleaned.search(/[[{]/);
  const jsonSlice = start >= 0 ? cleaned.slice(start) : cleaned;
  return JSON.parse(jsonSlice);
}

export async function generateQuiz(topic: string = "general personal finance", count: number = 5): Promise<QuizQuestion[]> {
  try {
    const raw = await callGroqChat(
      [
        {
          role: "system",
          content:
            "You are a financial literacy quiz generator for a mobile app aimed at young adults in Pakistan. " +
            "Return ONLY a JSON array — no explanation, no markdown fences, no surrounding text.",
        },
        {
          role: "user",
          content:
            `Generate ${count} multiple-choice financial literacy questions about "${topic}" suitable for a beginner-to-intermediate audience. ` +
            `Return a JSON array where each item has exactly these fields: ` +
            `"question" (string), "options" (array of 4 strings), "correctAnswerIndex" (number 0-3), "difficulty" (one of "beginner","intermediate","advanced").`,
        },
      ],
      { temperature: 0.6, maxTokens: 900 }
    );

    const parsed = extractJson(raw) as Array<Omit<QuizQuestion, "id" | "topic">>;

    const questions: QuizQuestion[] = parsed.map((q, index) => ({
      id: `ai-${Date.now()}-${index}`,
      question: q.question,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
      topic,
      difficulty: q.difficulty ?? "beginner",
    }));

    await setItem(STORAGE_KEYS.CACHED_QUIZ, questions);
    logger.info("GroqService", "Generated AI quiz successfully", { topic, count: questions.length });
    return questions;
  } catch (error) {
    logger.warn("GroqService", "Falling back to cached/default quiz", error instanceof GroqApiError ? error.message : error);
    const cached = await getItem<QuizQuestion[]>(STORAGE_KEYS.CACHED_QUIZ);
    return cached && cached.length > 0 ? cached : FALLBACK_QUIZ_QUESTIONS;
  }
}

export async function generatePersonalizedTip(activity: UserActivitySummary): Promise<SavingTip> {
  const hasEnoughData = activity.recentSavingsAmounts.length >= 3;

  try {
    const contextLine = hasEnoughData
      ? `Recent savings amounts (PKR): ${activity.recentSavingsAmounts.join(", ")}. Current streak: ${activity.currentStreak} days. Quiz accuracy: ${Math.round(activity.quizAccuracy * 100)}%.`
      : "This user is new and has limited activity history yet.";

    const raw = await callGroqChat(
      [
        {
          role: "system",
          content:
            "You are a warm, encouraging financial coach for a gamified savings app used by young adults in Pakistan. " +
            "Keep tone supportive and non-judgmental. Respond in under 40 words with no preamble.",
        },
        {
          role: "user",
          content: `${contextLine} Give one short, personalized saving tip based on this context.`,
        },
      ],
      { temperature: 0.8, maxTokens: 120 }
    );

    const tip: SavingTip = {
      id: `tip-${Date.now()}`,
      text: raw.trim(),
      generatedAt: new Date().toISOString(),
      isPersonalized: hasEnoughData,
    };

    await setItem(STORAGE_KEYS.CACHED_TIP, tip);
    logger.info("GroqService", "Generated personalized tip", { isPersonalized: hasEnoughData });
    return tip;
  } catch (error) {
    logger.warn("GroqService", "Falling back to cached/default tip", error instanceof GroqApiError ? error.message : error);
    const cached = await getItem<SavingTip>(STORAGE_KEYS.CACHED_TIP);
    if (cached) return cached;

    const randomTip = FALLBACK_SAVING_TIPS[Math.floor(Math.random() * FALLBACK_SAVING_TIPS.length)];
    return {
      id: `fallback-tip-${Date.now()}`,
      text: randomTip,
      generatedAt: new Date().toISOString(),
      isPersonalized: false,
    };
  }
}
