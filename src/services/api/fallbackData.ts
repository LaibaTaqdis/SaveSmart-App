import type { QuizQuestion } from "@/types";

// ============================================
// Fallback content used when the Groq API is unreachable, times out,
// or returns a malformed response. Keeps the app usable offline / degraded.
// ============================================

export const FALLBACK_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "fallback-1",
    question: "What is the recommended first step before starting to invest?",
    options: ["Building an emergency fund", "Buying stocks immediately", "Taking a loan", "Ignoring savings"],
    correctAnswerIndex: 0,
    topic: "Savings Basics",
    difficulty: "beginner",
  },
  {
    id: "fallback-2",
    question: "Which of these is a good habit for budgeting?",
    options: ["Spending before saving", "Tracking income and expenses", "Avoiding all records", "Borrowing frequently"],
    correctAnswerIndex: 1,
    topic: "Budgeting",
    difficulty: "beginner",
  },
  {
    id: "fallback-3",
    question: "An emergency fund should typically cover how many months of expenses?",
    options: ["0 months", "1 day", "3–6 months", "10 years"],
    correctAnswerIndex: 2,
    topic: "Savings Basics",
    difficulty: "beginner",
  },
  {
    id: "fallback-4",
    question: "What does 'compound interest' mean?",
    options: [
      "Interest calculated only on the principal",
      "Interest calculated on both principal and accumulated interest",
      "A type of penalty fee",
      "A fixed one-time bonus",
    ],
    correctAnswerIndex: 1,
    topic: "Investing Basics",
    difficulty: "intermediate",
  },
  {
    id: "fallback-5",
    question: "Which is the safest first savings goal for a young adult?",
    options: ["A luxury vacation", "An emergency fund", "A new phone", "Lending to friends"],
    correctAnswerIndex: 1,
    topic: "Savings Basics",
    difficulty: "beginner",
  },
];

export const FALLBACK_SAVING_TIPS: string[] = [
  "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings — even small consistent amounts add up over time.",
  "Set up an automatic transfer to a savings account right after you get paid, so saving happens before spending.",
  "Track your expenses for one week to spot small, avoidable costs that quietly drain your budget.",
  "Start with a modest emergency fund goal, like one month of expenses, before aiming for bigger targets.",
  "Review one subscription or recurring expense this week — cancelling just one can free up meaningful savings.",
];
