# 英検1級 模擬試験アプリ | Eiken Grade 1 Mock Exam

AIが毎回新しい問題を生成する、英検1級（Eiken Grade 1）向けの模擬試験 Web アプリ。

## セクション

| # | セクション | 概要 |
|---|---|---|
| 1 | **語彙**（短文空所補充） | C1レベル25問の4択問題 |
| 2 | **長文読解** | 380-450語のパッセージ＋3問 |
| 3 | **英作文** | 要約（90-110語）＋ 意見論述（200-240語）。AIが4観点で採点 |
| 4 | **リスニング** | OpenAI TTS による音声再生＋4択問題 |
| 5 | **スピーキング**（二次試験） | 2分スピーチ＋フォローアップQ&A。録音→Whisper文字起こし→AI採点 |

## 技術スタック

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS v4
- [OpenAI SDK](https://github.com/openai/openai-node)
  - Chat Completions (`gpt-4o-mini`) で問題生成・採点
  - TTS (`gpt-4o-mini-tts`) でリスニング音声生成
  - Whisper (`whisper-1`) でスピーキング録音の文字起こし
- Web Audio / `MediaRecorder` API で録音

## セットアップ

```bash
npm install
cp .env.local.example .env.local
# .env.local を編集して OPENAI_API_KEY を設定
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

### 環境変数

| 変数名 | 必須 | デフォルト | 説明 |
|---|---|---|---|
| `OPENAI_API_KEY` | ✓ | - | OpenAI API キー |
| `OPENAI_TEXT_MODEL` | | `gpt-4o-mini` | 問題生成・採点に使うテキストモデル |
| `OPENAI_TTS_MODEL` | | `gpt-4o-mini-tts` | リスニング用 TTS モデル |
| `OPENAI_STT_MODEL` | | `whisper-1` | スピーキング用 STT モデル |

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx                 # ホーム（セクション選択）
│   ├── exam/
│   │   ├── vocabulary/page.tsx  # 語彙
│   │   ├── reading/page.tsx     # 長文読解
│   │   ├── writing/page.tsx     # 英作文
│   │   ├── listening/page.tsx   # リスニング
│   │   └── speaking/page.tsx    # スピーキング
│   └── api/
│       ├── generate/{section}/route.ts  # 問題生成
│       ├── grade/{writing,speaking}/    # AI採点
│       ├── tts/route.ts                 # TTS
│       └── stt/route.ts                 # Whisper文字起こし
├── components/                  # UIプリミティブ・MCQ・スコア表示
└── lib/                         # OpenAIクライアント・プロンプト・型
```

## 注意事項

- 問題生成はオンデマンドで OpenAI API を呼び出します。`gpt-4o-mini` で25問の語彙生成には10〜30秒かかります。
- リスニング音声は問題ごとに `audio/mpeg` で生成します（キャッシュなし）。
- スピーキングの録音は `MediaRecorder` を使うため、ブラウザのマイク権限が必要です（Chrome推奨）。
- 本アプリは学習用途の模擬試験であり、公式のスコア保証はありません。

## ライセンス

MIT
