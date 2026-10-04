# Final frontend demo UX refinement — 04/10/2026

Completed the requested frontend-only competition-demo refinement. No backend, API, database, AI, authentication, new journeys, legal thresholds or source CSV changes. The application uses the existing approved static snapshot.

## 1. Screens changed

- Home: choose one situation, then one primary **Bắt đầu** button. **Chạy thử demo** is secondary. Removed experimental badges and the description textarea that did not drive guidance. Brand and approved introductory copy retained.
- Questions: original four one-at-a-time JOB_LOSS questions retained, with editable preselected demo answers and no legal citations at this stage.
- Analysis: 1.9-second transition retained; copy now names receiving facts, checking a policy direction, finding a reception point and identifying the next step. It remains a visualization, not an AI claim or fifth navigation step.
- Results: consistent **Bạn có thể bắt đầu từ đây**, supplied-answer chips, reasons, one actionable follow-up, plain explanation and one dominant CTA into step 4. Detailed job preparation moved to the action screen to reduce repetition.
- Action plans: practical to-do blocks; preparation, where to find information, place/channels of implementation, simple steps and next opportunities.

## 2. Components changed

Updated `demo-app`, `analysis-screen`, `job-results`, `job-action-plan`, `family-housing-results`, `local-action-plan`, `result-guidance`, `mechanism-explainer`, `source-badge` and global styles. Added `job-termination-question` and `action-details` (`InformationOrigins`, `ServiceExecution`). Added presentation of an optional termination declaration and a regression test.

The judge explanation is now a small closed-by-default disclosure; it is not navigation. Official source entries are deduplicated by source ID, retaining article/procedure details and last verification date.

## 3. CTA hierarchy

- Home: **Bắt đầu**; demo is secondary.
- Questions: **Tiếp tục** / the final transition button.
- Results: **Xem tôi cần làm gì** moves to step 4; missing-information answers, service and opportunity links are secondary.
- Job plan: answer the next question first; after any declaration, asking the DVVL center becomes primary. Editing the declaration becomes secondary.
- Housing plan: identify the group first; after a supplied group, viewing the round becomes primary.
- Family plan: one primary link to the guidance for the selected procedure; other actions are secondary.

## 4. Preparation and information origins

JOB_LOSS preparation has four categories: employment termination, BHTN participation, main dossier, contact information. Checkboxes are only self-tracking; no personal values or identifiers are collected. The expandable preparation block links to the existing procedure for the form and detailed requirements.

Information origins explain where to look for termination papers, known insurance history and procedure forms. Housing explains current occupation, household housing information, actual income if relevant, and the form of the exact project/round. Family guidance points to existing family/insurance/child papers and the selected procedure's dossier instructions.

Early housing still shows prerequisites rather than a dossier to submit. High-level preparation categories appear in the later to-do block, explicitly conditional on the correct round and requirements. No automatic checklist generation, matching or application submission is implemented.

## 5. Implementation location and channels

Job execution shows **Trung tâm Dịch vụ việc làm TP Đà Nẵng**, **278 Âu Cơ, phường Liên Chiểu, Đà Nẵng**, **0236 3740260**. Submission channels **Trực tiếp / Trực tuyến / Bưu chính** and secondary procedure **1.014748** come directly from `JOB_SV_001`.

Family channels and reception-provider names come from the selected service. Where a concrete address is absent, the UI explicitly asks users to confirm the reception point instead of inventing one. Housing's information service is labelled as a lookup head, not automatically a dossier reception point; its channels remain **Trực tuyến / Tra cứu**.

Simple execution steps: confirm missing information → prepare the principal papers → choose an available channel → follow results / supplement when requested.

## 6. Demo flow and verification

Four user-facing steps remain **Tình huống → Một vài câu hỏi → Dành cho bạn → Việc cần làm**. Demo runs through home, all four questions, the analysis transition, results and plan. Recording parameters continue through the existing navigation.

The termination follow-up reuses the approved `termination_legal` field and `LEGAL|UNLAWFUL|UNKNOWN` domain verbatim. It is self reported and does not run policy rules or convert enums to booleans. Any supplied follow-up leaves the result requiring confirmation rather than automatically affirming eligibility.

Browser QA this pass: full four-question job demo; UNKNOWN follow-up retained in the plan; expandable preparation and checkbox tracking; location/channels shown; home selection plus Bắt đầu routes to housing; rental results contain no purchase round and no inferred ownership/income. 390×844 mobile has no horizontal overflow in checked job views. Desktop checked at 1280×900, with centered content. Existing tests cover purchase-round scheduling and other journey branches.

Screenshots: [mobile execution](screenshots/final-refinement/job-location-mobile.jpg), [desktop plan](screenshots/final-refinement/job-plan-desktop.jpg).

## 7. Build result

- TypeScript passed.
- **14 frontend tests passed, 0 failed**, including CSV byte hashes and self-reported enum presentation.
- Final **npm run build passed**, Next.js 16.3.8; `/` and `/_not-found` statically prerendered.
- Build used the ignored `.frontend-npm-check` copy with current sources and a clean npm installation; the running development server uses the existing pnpm installation. No environment variables or backend requests exist in application source.

Fresh-checkout reproduction:

```powershell
cd apps/web
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

## 8. Vercel readiness

Existing `apps/web/vercel.json` specifies Next.js, `npm ci`, `npm run build`. Select Root Directory **apps/web**, Node.js **24.x** and the checked-in npm lockfile. No backend or environment-variable setup is required. Deployment itself was not performed or remotely verified.

Stopped after the requested final refinement and successful build.
