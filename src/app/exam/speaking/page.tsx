"use client";

import { useCallback, useRef, useState } from "react";
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
import type { GradingResult, SpeakingCard } from "@/lib/types";

type RecState = "idle" | "recording" | "stopping";

function useRecorder() {
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [state, setState] = useState<RecState>("idle");
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.start();
      mediaRef.current = rec;
      setState("recording");
    } catch (err) {
      setError((err as Error).message);
    }
  }, []);

  const stop = useCallback((): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const rec = mediaRef.current;
      if (!rec) {
        reject(new Error("Recorder not initialized"));
        return;
      }
      setState("stopping");
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        rec.stream.getTracks().forEach((t) => t.stop());
        setState("idle");
        resolve(blob);
      };
      rec.stop();
    });
  }, []);

  return { state, error, start, stop };
}

export default function SpeakingPage() {
  const [card, setCard] = useState<SpeakingCard | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [topicAudioUrl, setTopicAudioUrl] = useState<string | null>(null);
  const [loadingTopicAudio, setLoadingTopicAudio] = useState(false);

  const [transcript, setTranscript] = useState("");
  const [transcribing, setTranscribing] = useState(false);
  const [grading, setGrading] = useState(false);
  const [result, setResult] = useState<GradingResult | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recorder = useRecorder();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setCard(null);
    setTopicAudioUrl(null);
    setTranscript("");
    setResult(null);
    setAudioUrl(null);
    try {
      const res = await fetch("/api/generate/speaking", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "生成に失敗しました");
      setCard(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  const started = !!card || loading || !!error;

  async function playTopic() {
    if (!card) return;
    setLoadingTopicAudio(true);
    try {
      const text = `Here is your topic. ${card.instruction} Topic: ${card.topic}. After your speech, I will ask you four questions: ${card.followUpQuestions.join(" ")}`;
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error("音声生成に失敗しました");
      const blob = await res.blob();
      setTopicAudioUrl(URL.createObjectURL(blob));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoadingTopicAudio(false);
    }
  }

  async function handleStop() {
    try {
      const blob = await recorder.stop();
      setAudioUrl(URL.createObjectURL(blob));
      setTranscribing(true);
      const form = new FormData();
      form.append("file", new File([blob], "speech.webm", { type: "audio/webm" }));
      const res = await fetch("/api/stt", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "文字起こしに失敗しました");
      setTranscript(data.text ?? "");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setTranscribing(false);
    }
  }

  async function grade() {
    if (!card) return;
    setGrading(true);
    setResult(null);
    try {
      const res = await fetch("/api/grade/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: card.topic,
          followUpQuestions: card.followUpQuestions,
          transcript,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "採点に失敗しました");
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setGrading(false);
    }
  }

  return (
    <Container>
      <BackLink />
      <PageHeader
        eyebrow="二次試験 · Interview"
        title="スピーキング（模擬面接）"
        description="2分間のスピーチを録音し、その後フォローアップ質問にも答えてください。録音をWhisperで文字起こしし、AIが4観点で採点します。"
      />

      {error && <ErrorBox message={error} />}
      {!started && (
        <Card>
          <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
            「面接カードを生成」を押すと AI が二次試験の面接カードを生成します。
          </p>
          <Button onClick={load}>面接カードを生成</Button>
        </Card>
      )}
      {loading && (
        <Card>
          <LoadingDots label="面接カードを生成しています…" />
        </Card>
      )}

      {!loading && card && (
        <div className="space-y-6">
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Topic
            </p>
            <p className="text-lg font-semibold">{card.topic}</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {card.instruction}
            </p>
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
              {card.followUpQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {!topicAudioUrl ? (
                <Button onClick={playTopic} disabled={loadingTopicAudio}>
                  {loadingTopicAudio ? "音声生成中…" : "試験官の読み上げを聴く"}
                </Button>
              ) : (
                <audio controls src={topicAudioUrl} className="w-full max-w-md" />
              )}
            </div>
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-semibold">録音</h2>
            <p className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              マイクの使用を許可し、スピーチとフォローアップQ&Aをまとめて録音してください。
              停止を押すと自動で文字起こしされます。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {recorder.state === "idle" && !audioUrl && (
                <Button onClick={recorder.start}>録音開始</Button>
              )}
              {recorder.state === "recording" && (
                <Button onClick={handleStop}>停止して文字起こし</Button>
              )}
              {recorder.state === "stopping" && (
                <LoadingDots label="停止中…" />
              )}
              {audioUrl && recorder.state === "idle" && (
                <>
                  <audio controls src={audioUrl} className="w-full max-w-md" />
                  <Button variant="secondary" onClick={recorder.start}>
                    撮り直す
                  </Button>
                </>
              )}
            </div>
            {recorder.error && <ErrorBox message={recorder.error} />}
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-semibold">文字起こし</h2>
            {transcribing ? (
              <LoadingDots label="Whisperで文字起こし中…" />
            ) : (
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                rows={10}
                placeholder="録音を停止すると自動で文字起こしされます。必要に応じて手動で編集できます。"
                className="w-full rounded-lg border border-zinc-300 bg-white p-3 font-mono text-sm leading-6 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
              />
            )}
            <div className="mt-3 flex justify-end">
              <Button
                onClick={grade}
                disabled={grading || transcript.trim().length < 10}
              >
                {grading ? "採点中…" : "採点する"}
              </Button>
            </div>
          </Card>

          {result && <ScoreBar result={result} />}

          <div className="flex justify-end">
            <Button variant="secondary" onClick={load}>
              新しい面接カードを生成
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
