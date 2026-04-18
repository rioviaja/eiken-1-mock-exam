"use client";

import { useCallback, useState } from "react";
import {
  BackLink,
  Button,
  Card,
  Container,
  ErrorBox,
  LoadingDots,
  PageHeader,
} from "@/components/ui";
import { Mcq } from "@/components/Mcq";
import type { MCQQuestion } from "@/lib/types";

type AnswerKey = "A" | "B" | "C" | "D";

export default function VocabularyPage() {
  const [items, setItems] = useState<MCQQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const [graded, setGraded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setItems([]);
    setAnswers({});
    setGraded(false);
    try {
      const res = await fetch("/api/generate/vocabulary", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");
      setItems(data.items ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const correct = items.filter((q) => answers[q.id] === q.answer).length;
  const started = items.length > 0 || loading || !!error;

  return (
    <Container>
      <BackLink />
      <PageHeader
        eyebrow="一次試験 · Part 1"
        title="語彙（短文空所補充）"
        description="空所に入れるのに最も適切な語句をA〜Dから選んでください。25問すべて回答してから『採点する』を押すとスコアと解説が表示されます。"
      />

      {error && <ErrorBox message={error} />}
      {!started && (
        <Card>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            「問題を生成」を押すと AI が 25 問の語彙問題を生成します（10〜30秒）。
          </p>
          <Button onClick={load}>問題を生成</Button>
        </Card>
      )}
      {loading && (
        <Card>
          <LoadingDots label="25問の問題を生成しています…（10〜30秒ほどかかります）" />
        </Card>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((q, i) => (
            <Mcq
              key={q.id ?? i}
              question={q}
              index={i}
              selected={answers[q.id]}
              graded={graded}
              onSelect={(k) =>
                setAnswers((prev) => ({ ...prev, [q.id]: k }))
              }
            />
          ))}

          <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              回答済み: {Object.keys(answers).length} / {items.length}
              {graded && (
                <span className="ml-3 font-semibold text-indigo-600 dark:text-indigo-400">
                  スコア: {correct} / {items.length}
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={load}>
                新しい問題を生成
              </Button>
              <Button
                onClick={() => setGraded(true)}
                disabled={graded || Object.keys(answers).length === 0}
              >
                採点する
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
