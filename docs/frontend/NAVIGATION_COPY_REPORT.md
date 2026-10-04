# Navigation and demo copy correction

Completed 04/10/2026. Frontend UX and copy only.

1. **Navigation:** replaced the pipeline stepper with `UserJourneyProgress`: Tình huống → Một vài câu hỏi → Dành cho bạn → Việc cần làm. It appears across the experience. Questions use “Bước 2/4” with a separate “Câu 1/4…” counter. Results and actions show steps 3 and 4. Analysis is a 1,900 ms transition within step 2, never a fifth numbered step.
2. **Routes/state:** retained the existing single-page query state (`screen=questions`, `results`, `plan`). `screen=analysis` remains a temporary transition automatically replaced by results. Demo/recording flags and existing back behavior are preserved. No separate policy, service or opportunity routes exist; all outputs remain on the result screen.
3. **Copy:** updated the exact home support text and three card helpers; secondary “Chạy thử demo: Tôi vừa mất việc” CTA and helper; subtle “Bản demo ý tưởng” badge; question intro; “Đang nối các dữ kiện…” transition and rows; result heading/sections/CTA; action heading and four card titles. The noninteractive “AN SINH 360 xử lý như thế nào?” module remains a product explanation with the requested descriptions. No developer/debug/mock terms were added to the experience.
4. **Build:** `npm run build` passed against the synchronized clean npm verification copy. Root and not-found pages prerender successfully. TypeScript passed; existing nine tests passed, including preservation of CSV bytes and unresolved contribution months.

Browser checks covered the four labels, separate question counter, automatic analysis-to-result transition, result-to-action CTA, recording query preservation, no horizontal overflow, and zero interactive controls in the product explanation. Mobile 390 × 844 and desktop layouts were inspected. Screenshot: `screenshots/navigation/result-desktop.jpg`.

Reproduce from `apps/web`: `npm install`, `npm run dev`, and `npm run build`. Use a clean node_modules installation when changing package managers. Demo entry: `/?demo=jobloss&recording=1` or the home secondary CTA.

This report supersedes the pipeline navigation and demo labels in earlier redesign/polish reports. Backend, database, API, AI, authentication, source data and functionality are unchanged.
