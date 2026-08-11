import { logger } from "@utils/logger";

// ============================================
// Low-level Groq API client
// Handles the raw HTTP call, timeout, and response shape. Higher-level
// prompt construction and parsing lives in groqService.ts.
// ============================================

const GROQ_API_URL = process.env.EXPO_PUBLIC_GROQ_API_URL ?? "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL ?? "llama-3.3-70b-versatile";

const REQUEST_TIMEOUT_MS = 8000;

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class GroqApiError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "GroqApiError";
  }
}

/**
 * Sends a chat completion request to the Groq API with a hard timeout.
 * Throws GroqApiError on any failure so callers can fall back to cached content.
 */
export async function callGroqChat(messages: GroqMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<string> {
  if (!GROQ_API_KEY) {
    throw new GroqApiError("Groq API key is not configured. Check EXPO_PUBLIC_GROQ_API_KEY in your .env file.");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: options?.temperature ?? 0.7,
        max_tokens: options?.maxTokens ?? 600,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new GroqApiError(`Groq API responded with status ${response.status}`, errorBody);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new GroqApiError("Groq API returned an empty response");
    }

    logger.debug("GroqClient", "Received successful response", { model: GROQ_MODEL });
    return content;
  } catch (error) {
    if ((error as any)?.name === "AbortError") {
      logger.warn("GroqClient", "Request timed out");
      throw new GroqApiError("Groq API request timed out");
    }
    logger.error("GroqClient", "Request failed", error);
    throw error instanceof GroqApiError ? error : new GroqApiError("Unexpected Groq API failure", error);
  } finally {
    clearTimeout(timeout);
  }
}
