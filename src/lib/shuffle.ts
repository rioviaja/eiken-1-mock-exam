import type { MCQChoice, MCQQuestion } from "@/lib/types";

const KEYS: Array<MCQChoice["key"]> = ["A", "B", "C", "D"];

export function shuffleMCQ(q: MCQQuestion): MCQQuestion {
  const original = q.choices.find((c) => c.key === q.answer);
  if (!original) return q;

  const texts = q.choices.map((c) => c.text);
  for (let i = texts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [texts[i], texts[j]] = [texts[j], texts[i]];
  }

  const choices: MCQChoice[] = texts.slice(0, 4).map((text, i) => ({
    key: KEYS[i],
    text,
  }));
  const newAnswerIdx = choices.findIndex((c) => c.text === original.text);
  const answer = newAnswerIdx >= 0 ? KEYS[newAnswerIdx] : q.answer;

  return { ...q, choices, answer };
}
