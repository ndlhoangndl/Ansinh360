# AN SINH 360 — frontend competition demo

**Historical baseline report.** The interface described below was subsequently redesigned. See [the current redesign report](REDESIGN_REPORT.md): four question screens, a 1.9-second analysis screen, four action cards, a single desktop column and eight passing tests. Data provenance and independent setup below remain applicable; screenshots in this baseline report show the earlier interface.

Completed 04/10/2026. Scope: a frontend-only, clickable Next.js demo. Backend Phase 1 and the original dataset are preserved. No backend Phase 2 work or dataset contract normalization was performed during this run.

## Pages and components

```text
apps/web/
├── app/
│   ├── layout.tsx                 Vietnamese metadata and viewport
│   ├── page.tsx                   Suspense entry point
│   └── globals.css                Mobile and desktop presentation
├── components/
│   ├── demo-app.tsx               Home, questions, results and action plan
│   └── source-badge.tsx           Official source links and verification dates
├── lib/
│   ├── demo.ts                    Explicit demo scenario and date helpers
│   └── demo-data.json             Generated CSV snapshot with hashes
├── scripts/generate-demo-data.mjs CSV reader and snapshot generator
├── tests/demo.test.ts             Six automated checks
├── next.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
docs/frontend/screenshots/         Seven captured mobile/desktop views
```

The main component also contains reusable journey progress, status badge, icon, timeline and support components. Next.js generated `AGENTS.md` and `CLAUDE.md` during development startup.

## Run independently

Requirements: Node.js 20.9+ and npm. From the repository root:

```powershell
cd apps/web
npm install
npm run dev
```

Open http://127.0.0.1:3000. To preload the sample scenario, open http://127.0.0.1:3000/?demo=jobloss or select **Chạy demo nhanh**.

```powershell
npm test
npm run typecheck
npm run build
npm start
```

Alternatively, use pnpm with the checked-in lockfile: `pnpm install --frozen-lockfile`, then `pnpm dev`, `pnpm test`, `pnpm typecheck`, `pnpm build`, `pnpm start`. The pnpm workspace allows esbuild's installation script. `predev` and `prebuild` regenerate local JSON; `npm run data:sync` does the same explicitly. No database, Docker, .NET process, API or AI key is needed.

Build and dev use Next.js's Webpack mode. Turbopack failed to create its pooled Node process on this Windows environment with access denied, including an elevated retry; Webpack compiled and ran successfully.

## Route map

| Screen | URL | Behavior |
|---|---|---|
| Home | `/` | Three real-life situation cards, optional description disclosure, quick demo |
| Job questions | `/?journey=jobloss&screen=questions` | Five questions, progress, unknown options, back navigation |
| Preloaded job questions | `/?demo=jobloss` | Sample answers already selected; editable |
| Job results | `/?journey=jobloss&screen=results&demo=jobloss` | Policy signals, official services, training preview |
| Job action plan | `/?journey=jobloss&screen=plan&demo=jobloss` | Five steps, two-document checklist, provider and support links |
| Housing questions | `/?journey=housing&screen=questions` | Purchase: three questions; rental/lodging: one intent question |
| Housing results / plan | `/?journey=housing&screen=results` / `screen=plan` | Purchase opportunity and guidance; distinct rental/lodging guidance |
| Child questions | `/?journey=child&screen=questions` | Two short context/age questions |
| Child results / plan | `/?journey=child&screen=results` / `screen=plan` | Maternity, linked child procedures and preschool support |

Answers and checked documents exist only in React memory. They remain during in-app navigation and reset on a full reload. Housing and child routes should be entered through their question flow; direct result links do not restore earlier answers. Demo job links restore the sample when reloaded.

## Video flow, approximately 60 seconds

1. Show the home screen and three situations (5 seconds).
2. Select **Chạy demo nhanh**; progress through five editable, preloaded questions (15 seconds).
3. Show the unemployment card, its three reasons, Article 38 source and verification date (10 seconds).
4. Scroll through the official employment service and training card (5 seconds).
5. Open **Xem bước tiếp theo**. Show the five-step timeline, check a document, show 278 Âu Cơ and support options (15 seconds).
6. Briefly show the housing preview's **Sắp mở** badge and reception dates (10 seconds, separate take if needed).

For housing, select purchase → no existing home → not more than 25 million/month (single-person preview). Hòa Hiệp 4 appears scheduled for **25/10/2026–30/11/2026**. There is no **Nộp ngay** CTA. **Xem điều kiện** opens the plan; **Nhắc tôi kiểm tra khi mở** toggles a visual-only marker and explicitly says no notification was sent.

For child preview, select female worker who has given birth → newborn. The three requested recommendation cards and their official sources appear. The male and preschool selections select their corresponding existing dataset policy/service IDs.

## Data provenance and boundaries

- Generated from nine existing CSVs: metadata, sources, life events, policies, policy rules, services, opportunities, service checklists and profile fields. This includes all six files requested for the demo plus provenance and the existing numeric demo parameters.
- Original CSV bytes are untouched. The generator preserves decoded CSV values and records SHA-256 hashes. The hash test and `git diff -- data` both passed.
- Dataset version comes from current repository metadata: **v1.0-RC1**. The earlier contract-sync request was paused when the frontend priority superseded it.
- Demo evaluation date is deliberately fixed to the dataset snapshot **04/10/2026** for reproducible video. Opportunity status accepts an explicit evaluation date and is tested before, during and after the reception window. It does not poll live availability.
- Job logic is a small explicit scenario using the existing rule IDs `PR_JOB_005` and `PR_JOB_008`. Positive signals only suggest checking the policy. Other legal conditions remain unresolved and are stated on the card. Unknown, negative, expired or future input produces **Cần thêm thông tin**.
- This is not a generic Policy Matching Engine. No automatic profile-to-rule normalization or semantic conversion was added. Housing income selection is a demo category, not an imported numeric rule conversion.
- Verification dates shown in source badges are the dataset's `last_verified_at`; this run did not conduct a new legal/source audit. URLs and document IDs come from the source data, including broad portal URLs where that is the available canonical link.
- `SRC_JOB_DN_001` retains its approved canonical `/so-xay-dung` URL and `VERIFIED_OFFICIAL`. Its previously approved slug anomaly remains recorded in the backend validation/status documents.
- Description input is optional and is not parsed by an AI or used to infer legal eligibility. All answer, checklist and reminder state is local. Official links open separately; telephone links require the user's device dialer.

## Verification results

| Check | Result |
|---|---|
| `pnpm install --offline --frozen-lockfile` after dependency download | Passed, including esbuild postinstall |
| `pnpm test` | **6 passed, 0 failed, 0 skipped** |
| `pnpm typecheck` | Passed |
| `pnpm build` | Passed, static `/` and `/_not-found` generated |
| Production server on 127.0.0.1:3000 | Started and all primary journeys exercised |
| `pnpm dev --port 3001` | Started successfully; predev generator ran |
| Browser mobile viewport 390 × 844 | Three cards, five-question job flow, results, checklist and action plan verified |
| Browser desktop viewport 1280 × 900 | Responsive two-column layout verified |
| Job demo direct query and editable preloaded answers | Verified |
| Housing purchase / rental | Verified; rental did not display the purchase round |
| Reminder | Verified visual confirmation; no notification sent |
| Child female/newborn preview and plan | Verified |
| Browser console warning/error log | Empty during exercised production flow |
| Original CSV changes | None |

The six tests cover positive sample signals with remaining conditions, incomplete/negative/date cases, calendar month-end arithmetic, opportunity date boundaries and purchase-only routing, source references/approved portal anomaly, and unchanged source hashes. Browser interaction checks are recorded manual QA; they are not presented as an automated end-to-end suite.

## Screenshots

Captured with a 390 × 844 mobile viewport and a 1280 × 900 desktop viewport. Result and plan images include the full page; home/question images show the viewport.

| View | Image |
|---|---|
| Mobile home | [01-home-mobile.jpg](screenshots/01-home-mobile.jpg) |
| Mobile question | [02-question-mobile.jpg](screenshots/02-question-mobile.jpg) |
| Job results | [03-results-mobile.jpg](screenshots/03-results-mobile.jpg) |
| Job action plan | [04-plan-mobile.jpg](screenshots/04-plan-mobile.jpg) |
| Housing preview | [05-housing-mobile.jpg](screenshots/05-housing-mobile.jpg) |
| Child preview | [06-child-mobile.jpg](screenshots/06-child-mobile.jpg) |
| Desktop home | [07-home-desktop.jpg](screenshots/07-home-desktop.jpg) |

Stopped at the frontend demo scope. Backend matching, service resolver, `/api/navigate`, PostgreSQL integration and dataset normalization remain separate future work.
