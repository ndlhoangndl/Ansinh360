# STEP 6 — HAS_CHILD

Completed: 2026-10-10. Scope: frontend Child journey only.

## Files

- `apps/web/lib/child-journey.ts`: stage questions, confirmed facts, maternity direction, childcare ordering, action plans.
- `apps/web/components/child-journey.tsx`: results, cards, confirmations, plans, human-support summary and secondary sources.
- `apps/web/lib/demo.ts`: optional Child answer fields only.
- `apps/web/components/demo-app.tsx`: Child integration with the existing four screens and reset behavior.
- `apps/web/components/analysis-screen.tsx`: stage-specific Child transition.
- `apps/web/app/globals.css`: Child presentation and mobile styles.
- `apps/web/tests/child-journey.test.ts`: 15 Child tests.
- Screenshots: `screenshots/step-6/preschool-mobile.jpg`, `screenshots/step-6/preschool-desktop.jpg`.

## Questions and results

The first question selects NEWBORN, UNDER_6 or PRESCHOOL. NEWBORN and UNDER_6 have three further questions; PRESCHOOL has four. Changing the stage clears dependent answers. Unknown facts stay unresolved. No sensitive identifiers are collected.

NEWBORN shows the post-birth checklist alongside maternity guidance. A mother sees the female-worker direction; a father sees the male-worker direction. A helper must clarify whose situation needs guidance. Knowing insurance information does not establish participation, contribution duration or eligibility. For an expected birth, instructions distinguish preparation now from procedures after birth.

UNDER_6 prioritizes birth registration, residence and BHYT. The combined status answer marks all three as completed only when explicitly selected. Otherwise, individual status remains to be checked. Maternity is absent. A secondary childcare path appears only for an expressed care need or preview request.

PRESCHOOL uses exactly the three existing records, with balanced care/support tracks. Cards show age, area, tuition, hours, confirmation status and at most three reasons. Expanded details include meals, extra costs, pickup arrangements, area/address limitations and unverified enrollment. No registration, booking, school account or payment action is provided.

## Presentation ordering and limits

Ordering is deterministic: age coverage, selected area, tuition range, pickup-time coverage, then original record order. No numeric score is shown. A partially overlapping age range cannot outrank full coverage on another criterion. Budget or pickup warnings remain visible even when extra reasons are moved into expanded details.

Age answers use conservative whole-year coverage: 2–3 years spans 24–47 months; 3–5 years spans 36–71 months. The under-24-month answer does not establish a more precise age, so the 18–36-month record is only a partial match. Unknown age never generates a positive age reason.

Tuition ranges are read from the existing descriptive strings in the frontend only. Entire ranges must fit the selected band for a positive tuition reason. Tuition does not include the full cost of care: meals and additional fees must be confirmed separately. Current tuition ranges cross the selected budget boundaries; the UI therefore warns that no current option fully matches instead of inventing an exact match.

The 17:00–18:00 answer requires displayed closing time to cover 18:00 for an indicative time match. A late-pickup flag supplies a question to ask, not a promised closing time. All opening hours remain subject to confirmation. Unknown or variable pickup time does not generate a positive time-match reason.

These are presentation comparisons, not legal eligibility rules. CSV, `demo-data.json`, `competition-demo.ts`, backend, routing, JOB_LOSS and Housing logic are unchanged by this step.

## Support and action plans

Preschool support uses existing official sources and remains a direction to check. Its single prioritized unknown is whether the child's actual institution and the family's circumstances fall within the applicable group. No benefit amount is placed in primary results.

Plans have stage-specific headings and practical steps, each with why, where to find information and what to do next. Preschool plans include tuition, meals, extra fees, pickup/dropoff and after-hours costs. Links return to the appropriate result section. Human support summarizes the current stage and known answers, followed by existing 1022 and local support links. Official sources remain collapsed under “Căn cứ để AN SINH 360 đưa hướng dẫn này”.

## Verification

From `apps/web`:

```powershell
npm run typecheck -- --incremental false
npm test
npm run build
```

- Typecheck: passed.
- Tests: 65 passed, 0 failed; 15 new Child tests and all 50 existing tests pass.
- Production build: passed; `/` and `/_not-found` remain the generated routes. No build warnings or errors reported.
- Browser: exercised all three branches at 390 × 844; checked prenatal guidance, completed admin state, optional care transition, expanded confirmations, support modal, plan links and reset to `/`.
- Desktop at 1280 × 900: preschool tracks have equal height and width; expected first option matches the chosen age/area.
- No horizontal overflow observed on tested mobile and desktop screens. No console errors reported.

Local entry: `http://127.0.0.1:3000/?journey=child&screen=questions`. Root stays Home; direct protected results/plan URLs do not reconstruct stale answers.

STOP after HAS_CHILD. No subsequent journey implementation is included.
