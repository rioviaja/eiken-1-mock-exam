import { getOpenAI, MODELS } from "./openai";

interface ChatJSONOptions {
  system: string;
  user: string;
  temperature?: number;
}

/**
 * Calls the chat completions API in JSON mode and parses the response.
 * Throws on malformed JSON or missing keys.
 */
export async function chatJSON<T>({
  system,
  user,
  temperature = 0.7,
}: ChatJSONOptions): Promise<T> {
  const openai = getOpenAI();
  const completion = await openai.chat.completions.create({
    model: MODELS.text,
    temperature,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }
  try {
    return JSON.parse(content) as T;
  } catch (err) {
    throw new Error(
      `Failed to parse OpenAI JSON response: ${(err as Error).message}\n\n${content}`
    );
  }
}
