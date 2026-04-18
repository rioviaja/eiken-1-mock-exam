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
import type { ReadingPassage } from "@/lib/types";

type AnswerKey = "A" | "B" | "C" | "D";

export default function ReadingPage() {
  const [passage, setPassage] = useState<ReadingPassage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const [graded, setGraded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPassage(null);
    setAnswers({});
    setGraded(false);
    try {
      const res = await fetch("/api/generate/reading", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");
      setPassage(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const correct =
    passage?.questions.filter((q) => answers[q.id] === q.answer).length ?? 0;
  const started = !!passage || loading || !!error;

  return (
    <Container>
      <BackLink />
      <PageHeader
        eyebrow="一次試験 · Part 2"
        title="長文読解"
        description="パッセージを読み、各設問に答えてください。すべて回答してから『採点する』を押すとスコアと解説が表示されます。"
      />

      {error && <ErrorBox message={error} />}
      {!started && (
        <Card>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            「パッセージを生成」を押すと AI が読解問題を生成します。
          </p>
          <Button onClick={load}>パッセージを生成</Button>
        </Card>
      )}
      {loading && (
        <Card>
          <LoadingDots label="パッセージを生成しています…" />
        </Card>
      )}

      {!loading && passage && (
        <div className="space-y-4">
          <Card>
            <h2 className="mb-2 text-xl font-semibold">{passage.title}</h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
              {passage.passage}
            </p>
          </Card>

          {passage.questions.map((q, i) => (
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
              回答済み: {Object.keys(answers).length} / {passage.questions.length}
              {graded && (
                <span className="ml-3 font-semibold text-indigo-600 dark:text-indigo-400">
                  スコア: {correct} / {passage.questions.length}
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
