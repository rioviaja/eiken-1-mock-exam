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
import type { ListeningItem } from "@/lib/types";

type AnswerKey = "A" | "B" | "C" | "D";

function ListeningCard({
  item,
  index,
  selected,
  graded,
  onSelect,
}: {
  item: ListeningItem;
  index: number;
  selected?: AnswerKey;
  graded: boolean;
  onSelect: (k: AnswerKey) => void;
}) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);

  async function loadAudio() {
    setLoadingAudio(true);
    setError(null);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `${item.transcript}\n\nQuestion: ${item.question.stem}`,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "音声の生成に失敗しました");
      }
      const blob = await res.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingAudio(false);
    }
  }

  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
        Listening {index + 1}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {!audioUrl && (
          <Button onClick={loadAudio} disabled={loadingAudio}>
            {loadingAudio ? "音声を生成中…" : "音声を再生する準備"}
          </Button>
        )}
        {audioUrl && (
          <audio controls src={audioUrl} className="w-full max-w-md" />
        )}
        <Button
          variant="ghost"
          onClick={() => setShowTranscript((v) => !v)}
        >
          {showTranscript ? "スクリプトを隠す" : "スクリプトを見る"}
        </Button>
      </div>

      {error && <ErrorBox message={error} />}

      {showTranscript && (
        <div className="rounded-md bg-zinc-50 p-3 text-xs leading-6 text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-300">
          <p className="whitespace-pre-wrap">{item.transcript}</p>
        </div>
      )}

      <Mcq
        question={item.question}
        selected={selected}
        graded={graded}
        onSelect={onSelect}
      />
    </div>
  );
}

export default function ListeningPage() {
  const [items, setItems] = useState<ListeningItem[]>([]);
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
      const res = await fetch("/api/generate/listening", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");
      setItems(data.items ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const started = items.length > 0 || loading || !!error;

  const correct = items.filter(
    (it) => answers[it.question.id] === it.question.answer
  ).length;

  return (
    <Container>
      <BackLink />
      <PageHeader
        eyebrow="一次試験 · Part 4"
        title="リスニング"
        description="各問題の『音声を再生する準備』ボタンを押すと OpenAI TTS が音声を生成します。聴き取った内容に基づいて回答してください。"
      />

      {error && <ErrorBox message={error} />}
      {!started && (
        <Card>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            「問題を生成」を押すと AI がリスニング問題3問を生成します。各問題の音声は個別に生成できます。
          </p>
          <Button onClick={load}>問題を生成</Button>
        </Card>
      )}
      {loading && (
        <Card>
          <LoadingDots label="リスニング問題を生成しています…" />
        </Card>
      )}

      {!loading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((it, i) => (
            <ListeningCard
              key={it.id ?? i}
              item={it}
              index={i}
              selected={answers[it.question.id]}
              graded={graded}
              onSelect={(k) =>
                setAnswers((prev) => ({ ...prev, [it.question.id]: k }))
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
