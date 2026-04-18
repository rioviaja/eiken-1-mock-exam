"use client";

import type { MCQQuestion } from "@/lib/types";

interface Props {
  question: MCQQuestion;
  index?: number;
  selected?: "A" | "B" | "C" | "D";
  graded?: boolean;
  onSelect?: (key: "A" | "B" | "C" | "D") => void;
}

export function Mcq({ question, index, selected, graded, onSelect }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      {typeof index === "number" && (
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Q{index + 1}
        </p>
      )}
      <p className="mb-4 text-base leading-7 text-zinc-900 dark:text-zinc-100">
        {question.stem}
      </p>
      <div className="grid gap-2">
        {question.choices.map((c) => {
          const isSelected = selected === c.key;
          const isCorrect = graded && c.key === question.answer;
          const isWrongSelection =
            graded && isSelected && c.key !== question.answer;
          const base =
            "flex items-start gap-3 rounded-md border px-3 py-2 text-left text-sm transition";
          let color =
            "border-zinc-200 hover:border-indigo-400 dark:border-zinc-800 dark:hover:border-indigo-600";
          if (isSelected && !graded)
            color = "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40";
          if (isCorrect)
            color =
              "border-green-500 bg-green-50 text-green-900 dark:bg-green-950/40 dark:text-green-200";
          if (isWrongSelection)
            color =
              "border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200";
          return (
            <button
              key={c.key}
              type="button"
              disabled={graded}
              onClick={() => onSelect?.(c.key)}
              className={`${base} ${color}`}
            >
              <span className="font-semibold">{c.key}.</span>
              <span>{c.text}</span>
            </button>
          );
        })}
      </div>
      {graded && (
        <div className="mt-3 rounded-md bg-zinc-50 p-3 text-sm leading-6 text-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300">
          <span className="font-semibold">正解: {question.answer}</span>
          {question.explanation && (
            <>
              {" — "}
              {question.explanation}
            </>
          )}
        </div>
      )}
    </div>
  );
}
