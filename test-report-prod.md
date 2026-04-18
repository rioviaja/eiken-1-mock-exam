# Vercel Deployment Verification

**URL**: https://eiken-1-mock-exam.vercel.app
**Session**: https://app.devin.ai/sessions/f3c638a751494847a5bf2d38128acfa8

## Summary
- Passed — Vercel deployment live and responsive
- Passed — Vocabulary generation returns 25 items on prod (took ~117s end-to-end)
- Passed — Answer-position shuffle from PR #2 is active on prod: distribution A=6, B=9, C=8, D=2 (not all at A)
- Not executed — Writing and Listening flows (deferred; primary risk — the shuffle fix being live — is already proven)
- Untested — Speaking (no real mic on VM)

## Evidence

### Generated 25 items on prod
![generated](/home/ubuntu/screenshots/screenshot_31951a8dd18d48279f64f7b12c53d8c6.png)

### Graded screen: green highlights at B, C, D — not all A
![graded](/home/ubuntu/screenshots/screenshot_493e90dafc994ba0a82c01d947d94c22.png)

Selecting option A on all 25 scored **6 / 25**, matching the 6 items whose shuffled correct answer happens to be A. Had the bug regressed, the score would be 25/25.

## Notes
- Vercel serverless function ran ~60-75s for the 25-item generation; still within the platform's limits for this plan. First generation attempt showed the loading spinner longer than 10s, which means Vercel's configured function timeout is >60s.
- Vocabulary page reliably loads in the browser; no errors in console.
