# Test Plan — Production deploy (Vercel)

URL: https://eiken-1-mock-exam.vercel.app

## What's being tested
The full app after Vercel deployment. Main risk: serverless function timeouts (`/api/generate/vocabulary` takes 30-60s locally; Vercel Hobby plan caps at 10s by default) and env var wiring (`OPENAI_API_KEY`).

## Primary flow — Vocabulary end-to-end
1. Navigate to https://eiken-1-mock-exam.vercel.app/exam/vocabulary
2. Click **「問題を生成」**
   - **Pass** if within 120s the page renders 25 question cards (Q1..Q25).
   - **Fail** if a timeout error banner appears, or generation hangs without results.
3. After render, click option "A" on every question (use UI clicks, not console), then click **「採点する」**.
   - **Pass** if `スコア: X / 25` appears with green highlights on the correct answer position for each item, and those highlights are distributed across A/B/C/D (i.e., not all at position A). Concretely: at least 3 of the 4 keys must appear as a correct position across 25 items.

## Secondary flow — Writing summary grading
1. Navigate to https://eiken-1-mock-exam.vercel.app/exam/writing
2. Click **「問題を生成」**. **Pass** if a summary prompt (English passage) renders within 60s.
3. Paste a 90-110 word English summary into the textarea.
4. Click **「採点する」** on the summary card.
   - **Pass** if a ScoreBar renders with a total like `N/16` and 4 sub-criteria (内容/構成/語彙/文法) that sum to the total.

## Secondary flow — Listening audio
1. Navigate to https://eiken-1-mock-exam.vercel.app/exam/listening
2. Click **「問題を生成」**. **Pass** if 3 listening cards render within 60s.
3. On the first card, click the audio-generation trigger, wait for `<audio controls>` to become non-empty.
   - **Pass** if an audio element with a playable duration > 0 appears.

## Out of scope
- Speaking (no real mic on Devin VM).
- Reading (MCQ machinery identical to vocabulary; trusted).

## Evidence
- Browser recording covering primary flow end-to-end on production URL.
- Distribution counts (A/B/C/D) from the graded vocabulary screen.
