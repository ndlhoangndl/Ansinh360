# Action-first frontend UX — 04/10/2026

Completed the result/action redesign around **What to do → Why → What happens next → Official source**. Frontend only; backend, CSV files, legal rules and canonical source URLs were not edited.

## Result and action behavior

- Housing BUY opens with “Bạn có thể kiểm tra nhà ở xã hội”, two action cards, one visually dominant next action, and the open/scheduled/closed legend.
- Summary displays only supplied answers. `<=25M` stays “không quá 25 triệu”, not an exact monthly income. No residency or eligibility is inferred.
- The next unresolved housing question is applicant group. The inline question uses the existing `PF_HOUSE_002` allowed values verbatim: `ARTICLE76_6_WORKER|OTHER|UNKNOWN`. The selection is explicitly self reported and does not run rules or establish eligibility. Unknown offers the existing support panel.
- After a group answer, the primary result action moves to the round section. In the personal to-do screen, the answered group step becomes secondary and viewing the round becomes primary.
- Hòa Hiệp 4 remains **Sắp mở**, 25/10–30/11/2026, according to the 04/10/2026 snapshot. It is an available demo round, not a confirmed match. Rental/lodging never receives this purchase round.
- Early housing checklist contains three preparatory decisions, not document names. The document action points to the prerequisite section; no round-specific dossier is generated or promised by this demo.
- The final screen is “Việc của bạn lúc này”, with four practical housing sections: Làm ngay / Sau đó / Khi đã chọn được đợt / Nếu vẫn chưa rõ.
- Job loss prioritizes recording the termination situation and asking the DVVL center. The primary plan link is its existing official phone; no call was placed during QA.
- Family results prioritize asking the correct reception point about the selected case; secondary policy/service cards keep their respective service destinations.
- All result/action views have one primary CTA. Sources are compact, closed-by-default disclosures below the guidance. Housing Law Article 78/76 is attached to the Law source, while consolidated Articles 29/30 use the existing consolidated source.

## Copy decisions

The unconditional claim that housing never accepts applications year-round was replaced by round-specific timing. Income and ownership descriptions adapt to actual answers. The demo does not promise automatic filtering, legal approval, or future checklist generation. These are presentation safeguards, not changes to business data.

## Verification

- TypeScript: passed.
- Frontend automated tests: **13 passed, 0 failed**. Includes CSV byte hashes, date/status behavior, unknown/negative answer handling, income range preservation and self-reported group domain.
- `npm run build`: passed, Next.js 16.3.8, static `/` and `/_not-found` routes.
- Browser QA: housing BUY question → result → group selection → round → to-do → prerequisite return; family male/newborn result → correct service plan; job demo result → plan with recording flag preserved.
- 390px mobile viewport: no horizontal overflow in the checked result/plan views. Housing desktop/mobile screenshots saved below. Source disclosure expanded/collapsed correctly.
- Existing development dependencies use pnpm. Production build ran through npm in the ignored `.frontend-npm-check` copy with the same current app/component/library/CSS sources and a clean npm installation, to avoid changing the running dev server's output directory.

## Reproduce from a fresh checkout

```powershell
cd apps/web
npm ci
npm test
npm run typecheck
npm run build
npm run dev
```

Open `http://127.0.0.1:3000/`, choose housing → purchase → no home → income range. Use “Kiểm tra nhóm của tôi”, then view the scheduled round and personal to-do screen. Job quick demo also supports `/?demo=jobloss&recording=1`.

Screenshots: [desktop](screenshots/action-first/housing-desktop.jpg), [mobile](screenshots/action-first/housing-mobile.jpg).

Stopped after this frontend UX pass. No deployment or backend work performed.
