# Demo entry and contextual action plan — 04/10/2026

Frontend-only behavior correction; no product redesign, backend, API, database, AI, source CSV or legal-rule changes.

## Public entry and recovery

The public entry is `/` (local: http://127.0.0.1:3000/). It renders Step 1 and the situation question, with no selected situation. Home entry clears answers, question index, tracked checklist, selected situation/service, pending focus and open support. No localStorage/sessionStorage progress exists. Explicit quick-demo links remain optional; they are not the public root.

A small **Bắt đầu lại** button is available in questions, analysis, results and plans. All home/reset navigation returns to `/` without journey, screen, demo or recording query parameters. Back navigation retains in-journey answers; reset removes them.

## Contextual JOB_LOSS actions

The frontend chooses the next information-gathering action from actual answers:

1. Unknown employment situation → confirm it.
2. Unknown termination date → check the employer's papers and record the date.
3. Missing / UNKNOWN termination declaration → **Xác nhận lý do chấm dứt việc làm**, with an operational **Tôi đã kiểm tra** button opening the existing approved enum question.
4. Unknown BHTN participation → **Xem lại thông tin tham gia BHTN**.
5. Known participation but unknown duration → check the existing `bhtn_months_last_24` information (0–24 months or still unknown); participation never supplies duration automatically.
6. Known facts requiring clarification, such as still employed, NO participation or a self-reported UNLAWFUL declaration → contact support before dossier preparation, without deciding eligibility.
7. Information currently requested is supplied → **Chuẩn bị giấy tờ chính** becomes the first task. This acknowledges supplied information, not legal eligibility; other statutory conditions still need agency confirmation.

The ordering helper only selects a UI task. No enum-to-boolean conversion, numeric eligibility threshold or policy engine was added. Termination and insurance values remain verbatim. The 24-month duration field is not silently applied to another period.

Later preparation is marked as a preview while prerequisites are unresolved. Concrete items are employment-termination evidence, the benefit request form, and basic information needed by the reception point. The existing provider address/phone, submission channels, official source disclosure and opportunity continuation remain visible. No submission is simulated and no identity/insurance/account identifiers are requested.

## Verification

- TypeScript passed.
- **18 frontend tests passed, 0 failed**. Four new tests cover task ordering, UNKNOWN declarations, separate insurance/duration tasks and conservative support branches. CSV byte-hash checks still pass.
- **npm run build passed**, Next.js 16.3.8; static `/` and `/_not-found`. Built current sources through npm in the ignored clean `.frontend-npm-check` workspace to preserve the running dev server.
- Fresh-tab browser flow: root → choose JOB_LOSS → all four manual questions → analysis → personalized result → plan. The first task was termination information. Supplying the declaration changed the first task to insurance; supplying YES changed it to duration; supplying 12 months changed it to preparation. Preparation expansion and opportunity navigation worked. Provider location and all three channels remained present.
- Reset then returned to clean `/`, with zero selected situations and disabled Bắt đầu. Starting JOB_LOSS again showed question 1/4 with no selected answer and disabled Tiếp tục, confirming stale answers were removed.
- Screenshots: [missing duration](screenshots/contextual-plan/missing-bhtn.jpg), [preparation](screenshots/contextual-plan/preparation.jpg), [reset home](screenshots/contextual-plan/reset-home.jpg).

## Reproduce

```powershell
cd apps/web
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

Open the clean root URL. Do not distribute a journey/result/plan query as the public entry. Existing standalone Vercel configuration remains unchanged. No deployment performed. Stopped after verification.
