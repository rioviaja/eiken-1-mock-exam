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
import { ScoreBar } from "@/components/ScoreBar";
import type { GradingResult, WritingPrompt } from "@/lib/types";

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function WritingPage() {
  const [prompt, setPrompt] = useState<WritingPrompt | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [summaryAnswer, setSummaryAnswer] = useState("");
  const [essayAnswer, setEssayAnswer] = useState("");
  const [gradingSummary, setGradingSummary] = useState(false);
  const [gradingEssay, setGradingEssay] = useState(false);
  const [summaryResult, setSummaryResult] = useState<GradingResult | null>(null);
  const [essayResult, setEssayResult] = useState<GradingResult | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPrompt(null);
    setSummaryAnswer("");
    setEssayAnswer("");
    setSummaryResult(null);
    setEssayResult(null);
    try {
      const res = await fetch("/api/generate/writing", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");
      setPrompt(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const started = !!prompt || loading || !!error;

  async function gradeSummary() {
    if (!prompt) return;
    setGradingSummary(true);
    setSummaryResult(null);
    try {
      const res = await fetch("/api/grade/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "summary",
          passage: prompt.summary.passage,
          answer: summaryAnswer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "採点に失敗しました");
      setSummaryResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGradingSummary(false);
    }
  }

  async function gradeEssay() {
    if (!prompt) return;
    setGradingEssay(true);
    setEssayResult(null);
    try {
      const res = await fetch("/api/grade/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "essay",
          topic: prompt.essay.topic,
          points: prompt.essay.points,
          answer: essayAnswer,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "採点に失敗しました");
      setEssayResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGradingEssay(false);
    }
  }

  return (
    <Container>
      <BackLink />
      <PageHeader
        eyebrow="一次試験 · Part 3"
        title="英作文（要約＋意見論述）"
        description="2つのタスクに取り組みます。AIが4観点（内容・構成・語彙・文法）で採点します。"
      />

      {error && <ErrorBox message={error} />}
      {!started && (
        <Card>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            「プロンプトを生成」を押すと、要約用パッセージと意見論述トピックを AI が生成します。
          </p>
          <Button onClick={load}>プロンプトを生成</Button>
        </Card>
      )}
      {loading && (
        <Card>
          <LoadingDots label="ライティングのプロンプトを生成しています…" />
        </Card>
      )}

      {!loading && prompt && (
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Task 1: 要約 (Summary)</h2>
            <Card>
              <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {prompt.summary.instruction}
              </p>
              <p className="whitespace-pre-wrap text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {prompt.summary.passage}
              </p>
            </Card>
            <textarea
              value={summaryAnswer}
              onChange={(e) => setSummaryAnswer(e.target.value)}
              rows={8}
              placeholder="90-110語で要約を書いてください…"
              className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm leading-6 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                語数: {wordCount(summaryAnswer)}
              </span>
              <Button
                onClick={gradeSummary}
                disabled={gradingSummary || summaryAnswer.trim().length < 20}
              >
                {gradingSummary ? "採点中…" : "要約を採点する"}
              </Button>
            </div>
            {summaryResult && <ScoreBar result={summaryResult} />}
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Task 2: 意見論述 (Essay)</h2>
            <Card>
              <p className="mb-3 text-base font-medium text-zinc-900 dark:text-zinc-100">
                {prompt.essay.topic}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
                {prompt.essay.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-zinc-500">
                語数の目安: {prompt.essay.wordRange}
              </p>
            </Card>
            <textarea
              value={essayAnswer}
              onChange={(e) => setEssayAnswer(e.target.value)}
              rows={14}
              placeholder="Introduction / Body / Conclusion の構成で書いてください…"
              className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm leading-6 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                語数: {wordCount(essayAnswer)}
              </span>
              <Button
                onClick={gradeEssay}
                disabled={gradingEssay || essayAnswer.trim().length < 50}
              >
                {gradingEssay ? "採点中…" : "エッセイを採点する"}
              </Button>
            </div>
            {essayResult && <ScoreBar result={essayResult} />}
          </section>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={load}>
              新しいプロンプトを生成
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
