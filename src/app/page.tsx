import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";

interface SectionMeta {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  badge: string;
}

const SECTIONS: SectionMeta[] = [
  {
    href: "/exam/vocabulary",
    eyebrow: "一次試験 · Part 1",
    title: "語彙（短文空所補充）",
    description:
      "C1レベルの単語・熟語を問う4択問題。AIが毎回異なる25問を生成します。",
    badge: "25問",
  },
  {
    href: "/exam/reading",
    eyebrow: "一次試験 · Part 2",
    title: "長文読解",
    description:
      "学術的なパッセージと3つの内容理解問題。推論・語彙・要旨を総合的に測ります。",
    badge: "1題",
  },
  {
    href: "/exam/writing",
    eyebrow: "一次試験 · Part 3",
    title: "英作文（要約＋意見論述）",
    description:
      "AIが要約用パッセージと意見論述トピックを生成。回答はAIが4観点でルーブリック採点します。",
    badge: "2タスク",
  },
  {
    href: "/exam/listening",
    eyebrow: "一次試験 · Part 4",
    title: "リスニング",
    description:
      "OpenAI TTS が生成する音声を再生して解く4択問題。会話／モノローグをランダムに出題。",
    badge: "3問",
  },
  {
    href: "/exam/speaking",
    eyebrow: "二次試験",
    title: "スピーキング（面接）",
    description:
      "2分スピーチ＋フォローアップQ&Aの模擬面接。録音をWhisperで文字起こしし、AIが4観点で採点します。",
    badge: "面接",
  },
];

export default function Home() {
  return (
    <Container>
      <PageHeader
        eyebrow="Eiken Grade 1 · AI Mock Exam"
        title="英検1級 模擬試験アプリ"
        description="AIが毎回新しい問題を生成します。5つのセクションから受けたい試験を選んでください。一次試験の全セクションと二次試験（面接）に対応しています。"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {SECTIONS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:border-indigo-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-600"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {s.eyebrow}
              </p>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                {s.badge}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900 group-hover:text-indigo-700 dark:text-zinc-50 dark:group-hover:text-indigo-300">
              {s.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {s.description}
            </p>
            <p className="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">
              セクションを開始 →
            </p>
          </Link>
        ))}
      </div>

      <footer className="mt-12 rounded-xl border border-dashed border-zinc-300 bg-white/50 p-5 text-xs leading-6 text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-400">
        <p className="font-semibold text-zinc-700 dark:text-zinc-300">
          セットアップ
        </p>
        <p>
          このアプリの利用には OpenAI API キーが必要です。プロジェクトルートに{" "}
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
            .env.local
          </code>{" "}
          を作成し、
          <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono dark:bg-zinc-800">
            OPENAI_API_KEY=sk-...
          </code>
          を設定してください。問題生成には GPT-4o mini、音声生成には OpenAI TTS、
          文字起こしには Whisper を使用します。
        </p>
      </footer>
    </Container>
  );
}
