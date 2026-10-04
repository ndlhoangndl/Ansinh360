> Historical redesign report. Current behavior and deployment instructions: [Final polish report](POLISH_REPORT.md). Automatic predev/prebuild CSV synchronization and the inline contribution-month question were removed in the final polish pass.

# Frontend demo redesign

Redesigned the existing `apps/web` frontend in place. Project setup, local CSV-derived data, official URLs, legal parameters and backend files are preserved.

## Changed screens and components

| File | Change |
|---|---|
| `components/demo-app.tsx` | Four job question screens; BHTN contribution choices on the BHTN screen; analysis route; shorter copy; removal of the right column and decorative five-step rail; sample seeded on direct demo load |
| `components/analysis-screen.tsx` | Progressive five-stage analysis, factual answer indicators, cleanup on exit, automatic completion after 1,900ms |
| `components/job-results.tsx` | Strong unemployment card, explicit reasons and unresolved conditions, primary/official-source CTAs, dedicated provider card with address/phone/tags, employment/training opportunities |
| `components/mechanism-strip.tsx` | Compact situation → policy → service → action explanation with current step |
| `components/job-action-plan.tsx` | Four action cards: check, prepare, execute, move forward; one primary action per card; expandable checklist and employment/training choices |
| `app/globals.css` | Single column, stronger type and contrast, fewer card borders, larger controls, blue/green/amber states, subtle progressive motion and reduced-motion support |
| `lib/demo.ts` | Analysis presentation facts for all three journeys; existing result logic and legal parameters retained |
| `tests/demo.test.ts` | Two additional checks for unknown/negative analysis facts and preserved housing/child branches |

`SourceBadge` is reused with more readable presentation. `app/page.tsx`, `layout.tsx`, package setup and data generation structure remain in place. There are no new dependencies.

## Current flow and routes

```text
Home
  → Questions (job: 4 screens)
  → Analysis (1.9 seconds)
  → Policy suggestion + reasons + unresolved conditions
  → Official service + next opportunities
  → Four action cards
```

The four job screens collect five existing answer fields: employment status, termination date, BHTN plus contribution category together, and desired next step. Unknown answers can continue and remain unresolved. The last CTA is **Phân tích hoàn cảnh của tôi**.

The new screen uses `/?journey=jobloss&screen=analysis&demo=jobloss`. Housing and child use their own `journey` value with `screen=analysis`; animation facts and policy/service names follow that journey. On completion, the analysis route is replaced by `screen=results`, so browser Back does not replay the timed analysis. Leaving the analysis component cancels its timers.

The sequence is a frontend demonstration of information comparison, not a live search, AI model or confirmed eligibility decision. Known and negative/unknown answers are displayed differently. Result eligibility signals still use the existing explicit demo function, date and rule parameters. Remaining legal conditions and the supplied disclaimer remain visible.

## Run

From the repository root:

```powershell
cd apps/web
npm install
npm run dev
```

Open http://127.0.0.1:3000/?demo=jobloss or choose **Chạy demo nhanh**. npm is the standard local setup; pnpm is equivalent and was used in this environment.

```powershell
npm test
npm run typecheck
npm run build
npm start
```

The build script is `next build --webpack` and its prebuild script regenerates the local JSON snapshot. No .NET, Docker, PostgreSQL, backend API, authentication or AI key is required.

## Validation

- Production build (`pnpm run build`, equivalent to `npm run build`): **passed**, including TypeScript and static page generation.
- Automated tests: **8 passed, 0 failed, 0 skipped**. Existing source hashes, source references, date boundaries and result statuses remain covered. New checks cover unknown/negative analysis facts and journey-specific policy branches.
- Browser: mobile **390 × 844** and desktop **1280 × 900**. Desktop content width measured **800px**; no aside or horizontal overflow.
- Four-screen preloaded job questions → visible analysis → automatic result transition: passed. Analysis configured for **1,900ms**; one browser observation saw the result approximately **2.25 seconds after the click**, including route/render overhead.
- Result reasons, verification list, official source, provider address/phone, mechanism strip and action plan: verified.
- Four action cards, checklist expansion/checking, and employment/training choice expansion: verified.
- Unknown contribution period produced **Cần thêm thông tin**, with no positive-match badge.
- Housing purchase still shows Hòa Hiệp 4 **Sắp mở**, 25/10/2026–30/11/2026, without **Nộp ngay**. Child female/newborn preview retained its three official-source cards. Both traversed their analysis screen successfully.
- Original CSV changes: **none**; hash test passed and `git diff -- data` was empty.

## Screenshots

| View | Capture |
|---|---|
| Home, mobile | [01-home-mobile.jpg](screenshots/redesign/01-home-mobile.jpg) |
| BHTN question, mobile | [02-question-mobile.jpg](screenshots/redesign/02-question-mobile.jpg) |
| Analysis, mobile | [03-analysis-mobile.jpg](screenshots/redesign/03-analysis-mobile.jpg) |
| Job result, mobile | [04-results-mobile.jpg](screenshots/redesign/04-results-mobile.jpg) |
| Job plan, mobile | [05-plan-mobile.jpg](screenshots/redesign/05-plan-mobile.jpg) |
| Housing preview | [06-housing-mobile.jpg](screenshots/redesign/06-housing-mobile.jpg) |
| Child preview | [07-child-mobile.jpg](screenshots/redesign/07-child-mobile.jpg) |
| Job result, desktop | [08-results-desktop.jpg](screenshots/redesign/08-results-desktop.jpg) |
| Job plan, desktop | [09-plan-desktop.jpg](screenshots/redesign/09-plan-desktop.jpg) |

For a 45–60-second recording: show the situation selection, use preloaded answers to move through four screens, let the analysis sequence run, show the three reasons and official source, then the provider card and four actions. Open the checklist to demonstrate a concrete next step.

Stopped after the requested frontend redesign. Backend Phase 2 and dataset normalization remain outside this run.
