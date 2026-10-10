# STEP 6.1 — HAS_CHILD UX polish

Completed: 2026-10-10. Scope: copy, hierarchy and action labels only.

## Changes

- Parent question: “Bạn đang hỏi cho ai?” with the requested helper. Answer values/options unchanged.
- Child privacy copy: “Thông tin này chỉ được dùng để đưa ra gợi ý phù hợp.” The Child navigation accessibility label also avoids development framing; other journeys retain their existing copy.
- No-exact-match behavior unchanged. The message is now visually quieter, followed by “Phương án gần nhất để bạn tham khảo”.
- Childcare cards retain title, area, age, tuition, hours and enrollment-confirmation status. Existing mismatches are summarized in one line, with at most two explanation rows. All known mismatches remain visible in the summary and individually explained in expanded details.
- Expanded details use four groups: Độ tuổi, Chi phí, Thời gian, Trước khi chọn. Age, tuition, meals, extra/after-hours fees, hours, late pickup, address limitations, enrollment, licensing and safety remain available. One bottom note covers changing fees, hours and enrollment.
- Newborn plan buttons now read “Kiểm tra từng việc”, “Xem nơi thực hiện”, “Xem hướng thai sản”, “Xem hướng bảo hiểm y tế”. Click targets are unchanged.
- Plan copy names the existing service/provider, expands insurance acronyms in primary text and explains how to check family documents before following the linked procedure. No location or provider is invented.
- Preschool support remains non-final and asks the family to identify the actual institution and ask whether their circumstances fall within the applicable group. It points to the existing institution/local authority guidance.
- UNDER_6 structure unchanged: documents, residence and health insurance primary; childcare only when requested/relevant; no default maternity or automatically applicable preschool policy.

## Files changed in this pass

- `apps/web/lib/child-journey.ts` — question and plain-language plan copy.
- `apps/web/components/child-journey.tsx` — card/detail hierarchy, service context and CTA labels.
- `apps/web/components/demo-app.tsx` — Child-only privacy and navigation label.
- `apps/web/components/user-journey-progress.tsx` — optional presentation label; existing default unchanged.
- `apps/web/app/globals.css` — Child-only compact styling.
- `apps/web/tests/child-journey.test.ts` — four new tests and adjusted copy assertions.
- This report and `screenshots/step-6-1/preschool-mobile.jpg`.

Matching implementation was compared before and after this pass and is byte-for-byte unchanged. Stage branching, maternity selection, plan conditions and click targets are unchanged. No dataset, backend, route, JOB_LOSS or Housing behavior was changed.

## Validation

From `apps/web`:

```powershell
npm run typecheck -- --incremental false
npm test
npm run build
```

- Typecheck: passed.
- Tests: 69 passed, 0 failed, including four new polish tests.
- Build: passed, no warnings/errors reported.
- Browser: new parent question and privacy copy visible; contextual plan buttons still reach the existing section; expanded childcare has all four groups; known mismatches visible without contradictory positives.
- Mobile 390 × 844: first childcare card approximately 441 px high; no horizontal overflow. Desktop 1280 × 900: two preschool tracks remain equal in width/height; no horizontal overflow.
- UNDER_6 reviewed with completed documents and no care request: no maternity, no preschool policy, no unrequested care block. No console errors reported.

Local entry: `http://127.0.0.1:3000/?journey=child&screen=questions`.

Stopped after STEP 6.1 polish.
