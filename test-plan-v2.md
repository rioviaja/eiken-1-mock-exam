# Test Plan — PR #2: MCQ answer-key shuffle

## What changed
- Before: `/api/generate/vocabulary` returned 25 items where the correct answer was always `A`.
- After: A server-side Fisher–Yates shuffle in `src/lib/shuffle.ts` reorders `choices` and updates `answer`, applied in `vocabulary`, `reading`, and `listening` generate routes. Prompt also asks for a balanced distribution.

## Primary flow — Vocabulary distribution (adversarial)
Focus is *distribution of the `answer` field*, which is the thing that was broken. Browser UI just renders whatever the API returns, so API-level assertions are the tightest test.

1. **Setup**: dev server already running on `devin/1776521249-shuffle-mcq-answers` at http://localhost:3000.
2. **API probe #1**: `POST http://localhost:3000/api/generate/vocabulary` → parse JSON.
   - **Pass** if `items.length === 25`.
   - **Pass** if among 25 items, each of A/B/C/D appears as `answer` at least twice (a broken "all-A" implementation would have A=25 and B=C=D=0, and even a naive non-shuffle would fail the ≥2 threshold).
   - **Pass** if no single key accounts for more than 15/25 (60%) — guards against a subtle regression where only some items get shuffled.
3. **Integrity check**: For each item, the choice at position `answer` must be a non-empty string and all 4 keys must be exactly `A`,`B`,`C`,`D` (validates that the shuffle didn't corrupt the structure).
4. **UI spot check (visible evidence for PR)**: load `/exam/vocabulary`, click 生成, then click 採点する without answering to grade 0/25, and visually confirm that the green "正解" highlights appear at *different positions* (not all the top row). Screenshot this.

## Secondary flow — Regression on Reading
Single quick API probe: `POST /api/generate/reading`, verify `questions.length === 3` and answers aren't all the same letter. Not adversarial-strong (3 items, the all-A scenario could coincidentally produce A,A,A even when shuffled), so this is a smoke check only.

## Out of scope
- Listening MCQ distribution — same `shuffleMCQ` function as vocabulary, so trusting vocabulary result.
- Writing / Speaking — no MCQ, untouched.
- Semantic correctness of "correct choice" vs explanation — the shuffle preserves the `text` string and rekeys only; not reorders the semantic mapping. Verified by reading `src/lib/shuffle.ts:7-20`.

## Evidence to attach
- Vocabulary distribution counts (e.g. `{A:6,B:7,C:5,D:7}`).
- Browser screenshot showing mixed green highlights.
- PR comment on #2 summarizing.
