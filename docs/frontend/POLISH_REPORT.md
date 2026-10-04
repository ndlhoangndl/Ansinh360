> Historical polish report. The subsequent [navigation and copy correction](NAVIGATION_COPY_REPORT.md) replaces the pipeline stepper and demo labels described here.

# Final frontend demo polish

Completed 04/10/2026. Scope: existing frontend only.

## Components changed

- `demo-app.tsx`: branded hero, experimental journey badges, four single-question screens, demo label, keyboard controls, recording query preservation and support-dialog focus handling.
- `analysis-screen.tsx`: sequential deterministic visualization, exact connection heading, 1,900 ms total duration.
- `job-results.tsx`: reasons, unresolved conditions, official source, service contact, job and training continuations.
- `mechanism-strip.tsx`: Hoàn cảnh → Phân tích → Chính sách → Dịch vụ → Hành động.
- New `mechanism-explainer.tsx`: vertical explanation including opportunities.
- `job-action-plan.tsx` and `source-badge.tsx`: four action cards, one CTA per card, source provenance displayed without extra action links.
- `globals.css`: hierarchy, blue/green/amber styling, recording visibility and reduced motion.
- `package.json`, `package-lock.json`, `vercel.json`: standalone npm deployment; no automatic CSV synchronization during dev/build.

## Demo and recording

Home → **Chạy demo 60 giây** → four preselected questions → 1.9-second analysis → policy/reasons/source → service/opportunities → four action cards. Answers remain editable; screens are not skipped. “60 giây” names the presentation shortcut, not an enforced countdown.

Recording home: `/?recording=1`. Direct sample: `/?demo=jobloss&recording=1`. Recording mode persists across questions, analysis, results, plan and home; hides support, optional description, footer and extra plan controls. The next-path action scrolls to existing job/training choices. Reduced motion disables visual animation and smooth scrolling.

Manual flow asks employment end, termination date, insurance participation and next goal. Contribution months remain unresolved in manual answers; **YES never derives 12 months**. The sample scenario explicitly retains its existing 12-month value. Both paths show further verification; neither constitutes a legal eligibility decision. Source CSVs, policy definitions and canonical URLs remain unchanged.

## Verification

- Nine automated dataset/demo tests passed, including missing-month regression and CSV SHA-256 preservation.
- TypeScript check passed.
- Production build passed; root and not-found routes statically prerendered.
- Clean standalone `npm install` succeeded (50 packages), `npm run dev -- --port 3001` became ready and served the homepage, and `npm run build` passed.
- First npm attempt against pnpm-created node_modules failed inside npm Arborist; clean installation resolved the package-manager layout conflict. Use one package manager per installation.
- Browser QA: 390 × 844 and 1280 × 900; no horizontal overflow. Sample preselection, four screens, insurance single-question layout, automatic analysis navigation, recording query, official links, service contact, continuation scrolling, checklist update and one CTA per action card verified. Desktop content width 800 px within the centered layout.
- Basic keyboard answer navigation and support-dialog Escape/focus containment added. Visible focus and reduced-motion CSS retained.

## Local reproduction and Vercel

Requires Node.js 22 or 24 and npm. From a fresh checkout:

```powershell
cd apps/web
npm install
npm run dev
# Separate run after stopping dev:
npm run build
npm start
npm test
```

Vercel project settings: **Root Directory `apps/web`**, **Next.js** preset, **Node.js 24.x**, install `npm ci`, build `npm run build`, default Next.js output directory. `vercel.json` provides the install/build commands. No environment variables or backend are required. Commit `package-lock.json` and `lib/demo-data.json` with the app. Root-directory/build settings follow [Vercel build documentation](https://vercel.com/docs/builds/configure-a-build).

Runtime and builds consume the committed JSON snapshot only. `npm run data:sync` is an optional local maintenance command requiring repository `/data`; it is never invoked by dev/build/deployment. Dataset provenance tests require the repository `/data`, but deployment does not.

Prepared for deployment; no Vercel project was published during this pass. Earlier reports remain historical. No backend, API, database, authentication, analytics, AI, maps or new journeys were added. Stop after this polish pass.
