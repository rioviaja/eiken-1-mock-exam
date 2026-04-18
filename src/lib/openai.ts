import OpenAI from "openai";

let cachedClient: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error(
      "OPENAI_API_KEY is not set. Create a .env.local file with OPENAI_API_KEY=sk-..."
    );
  }
  if (!cachedClient) {
    cachedClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return cachedClient;
}

// Model defaults - overridable via env
export const MODELS = {
  text: process.env.OPENAI_TEXT_MODEL ?? "gpt-4o-mini",
  tts: process.env.OPENAI_TTS_MODEL ?? "gpt-4o-mini-tts",
  stt: process.env.OPENAI_STT_MODEL ?? "whisper-1",
} as const;
