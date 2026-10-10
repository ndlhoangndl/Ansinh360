# AN SINH 360 — STEP 7: Final product audit

Ngày kiểm tra: 10/10/2026. Hoàn tất audit, polish và chuẩn bị triển khai frontend. Chưa deploy công khai.

## 1. Files changed

Danh sách dưới đây là phạm vi STEP 7, không phải toàn bộ `git diff` vì workspace đã có thay đổi từ các bước trước.

| File trong `apps/web` | Thay đổi |
| --- | --- |
| `app/layout.tsx` | Title công khai đúng định vị sản phẩm. |
| `app/not-found.tsx` | Trang 404 đơn giản, link về Home. |
| `app/globals.css` | Max width 960px, metadata dễ đọc, status wrap, touch target, focus, reduced motion và phân cấp nút khi mở câu hỏi tìm việc. |
| `components/demo-app.tsx` | Bỏ câu chữ “lượt trải nghiệm”; cơ chế thu gọn ở cả ba Results; bỏ state/helper/import không dùng; modal hỗ trợ có một tiêu đề. |
| `components/analysis-screen.tsx` | Bỏ import không dùng. |
| `components/user-journey-progress.tsx` | Nhãn truy cập “Các bước của bạn”. |
| `components/mechanism-explainer.tsx` | Hoàn cảnh → Quyền lợi → Dịch vụ → Cơ hội → Hành động; icon trang trí không đọc như nội dung. |
| `components/job-opportunities.tsx` | Viết đầy đủ Trung tâm Dịch vụ việc làm, hỗ trợ bàn phím cho lựa chọn tìm việc, bỏ biến không dùng. |
| `components/job-results.tsx` | Mở lại phần việc làm vẫn focus/scroll đúng; nút học nghề đổi nhãn khi đang mở. |
| `components/job-service-handoff.tsx` | Copy kênh thủ tục và ngày xác minh rõ hơn. |
| `components/housing-journey.tsx` | Note giá/chỗ ở, label link hướng dẫn, lịch sử đợt; một nút chính; bỏ CTA trùng đích đến trong kế hoạch. |
| `components/child-journey.tsx` | Status hỗ trợ thống nhất; một nút chính; bỏ CTA trùng đích đến trong kế hoạch. |
| `lib/housing-journey.ts` | Chỉ sửa tiêu đề bước đầu thành “Chọn 2–3 phương án để đối chiếu ngân sách”, tránh ngụ ý đã có phương án trong ngân sách. |
| `lib/presentation.ts` | Bỏ import không dùng. |
| `package.json`, `package-lock.json` | Đồng bộ Node `24.x`; không thêm dependency. |
| `tests/product-audit.test.ts` | Ma trận chín tình huống, status/navigation, cơ chế, nút chính, CTA trùng đích đến, link an toàn và copy công khai. |
| `tests/child-journey.test.ts`, `tests/housing-journey.test.ts`, `tests/public-copy.test.ts` | Cập nhật kỳ vọng trình bày và kiểm tra nội dung còn nguyên. |

Tài liệu: `README.md`, báo cáo này, `docs/frontend/DEPLOYMENT.md`, `STEP_7_BROWSER_AUDIT.json`, ảnh tại `screenshots/step-7/`. Next.js cũng tự tạo/cập nhật `next-env.d.ts` khi chạy build; không chỉnh thủ công.

## 2. Product-wide cleanup

- Home giữ đúng ba tình huống, subtitle, tagline và nút **Bắt đầu**. Không có CTA demo, badge phát triển hoặc ngày demo trên footer.
- Navigation giữ đúng **Tình huống → Một vài câu hỏi → Dành cho bạn → Việc cần làm**. Analysis vẫn ở bước 2.
- Cơ chế thu gọn gần cuối Results có ở cả ba hành trình, không có điều hướng kỹ thuật.
- Nguồn chính thức vẫn là phần thứ cấp thu gọn. Các status cơ hội vẫn yêu cầu xác nhận, không được mô tả là tin đang hoạt động/đã xác minh.
- Title: **AN SINH 360 | Từ hoàn cảnh đến hành động**. Description đúng định vị người lao động Liên Chiểu; `lang="vi"`.
- Không sửa dữ liệu nguồn, thuật toán xếp hạng, câu hỏi hay điều kiện quyền lợi.

## 3–5. Ba hành trình

| Hành trình | Kết quả kiểm tra |
| --- | --- |
| JOB_LOSS | Bốn câu hỏi chính; hai hướng cân bằng; WHY và một thông tin thiếu ưu tiên còn nguyên. Ba lựa chọn tìm việc riêng vẫn hoạt động. Thẻ việc làm ngắn, tối đa hai lý do; cách tìm tin đã xác minh, Trung tâm, học nghề và kế hoạch theo ngữ cảnh còn nguyên. |
| HOUSING | Ngân sách tiếp tục ưu tiên trước khu vực/quy mô/trẻ nhỏ. Phương án vượt ngân sách không được gắn lý do “trong ngân sách”. Khi không có khớp đầy đủ, cảnh báo và “phương án gần nhất” hiển thị. Ý định thuê/mua quyết định hướng hỗ trợ chính. Đợt đã đóng/sắp mở không có lời mời nộp ngay. |
| HAS_CHILD | NEWBORN ưu tiên việc sau sinh và hướng thai sản đúng cha/mẹ; UNDER_6 ưu tiên giấy tờ/cư trú/bảo hiểm; PRESCHOOL ưu tiên chăm sóc và hỗ trợ mầm non. Tuổi/khu vực/giá/giờ đón chưa khớp vẫn được nói rõ. Giữ câu “Bạn đang hỏi cho ai?”. |

Ma trận tự động đã kiểm tra đủ chín tình huống yêu cầu:

1. Job A: biết tham gia bảo hiểm, thiếu lý do nghỉ việc.
2. Job B: chưa rõ bảo hiểm.
3. Job C: ưu tiên tìm việc.
4. Housing A: dưới 2 triệu.
5. Housing B: 2–3 triệu, ba người, có trẻ nhỏ.
6. Housing C: muốn thuê nhà ở xã hội.
7. Child A: vừa sinh, hỏi cho mẹ.
8. Child B: trẻ dưới 6 tuổi, cần giấy tờ.
9. Child C: mầm non với ngân sách/giờ đón chưa khớp.

## 6. CTA audit

| CTA/interaction | Kết quả |
| --- | --- |
| Bắt đầu / Tiếp tục / Quay lại | Hoạt động; tiến trình giữ đúng bước. |
| Xem tôi cần làm gì | Mở kế hoạch hiện tại. |
| Xem việc phù hợp | Mở câu hỏi tìm việc; khi đã mở vẫn đưa focus về phần việc làm. |
| Xem chỗ phù hợp / Xem nơi phù hợp / Xem hướng hỗ trợ | Đưa đến đúng phần Results, không thay hành trình. |
| Xem điều cần xác nhận / Xem cách tìm tin đã xác minh | Details/summary thật; nội dung thực tế, không nút giả. |
| Tôi đã kiểm tra | Mở câu hỏi bổ sung; hủy thay đổi hoạt động. Không tự ghi nhận kết luận. |
| Checklist | Checkbox thật; chỉ theo dõi trong bộ nhớ. |
| Tôi cần người hỗ trợ | Modal đúng ngữ cảnh, đóng bằng Escape, giữ các nguồn và số điện thoại. Không có tính năng sao chép giả. |
| Căn cứ / Xem nguồn chính thức | Thu gọn/mở được; link HTTPS, tab mới có `noopener noreferrer`. |
| Hướng học nghề | Mở/ẩn đúng; nhãn đổi theo trạng thái. |
| Bắt đầu lại / brand / Khám phá tình huống khác | Về Home sạch. |

Mỗi màn kết quả có một nút chính. Khi mở bộ câu hỏi tìm việc, nút tiếp tục là hành động nổi bật tại ngữ cảnh đó. Kế hoạch nhà ở/con nhỏ chỉ giữ một CTA cho mỗi đích đến, các bước, checklist, giải thích và hướng dẫn vẫn còn đầy đủ. Không phát hiện nút giả trong các màn đang dùng.

## 7. Mobile and desktop

Kiểm tra trình duyệt tại **390 × 844**: Home, Questions, Results, Plan của cả ba hành trình; phần cơ hội, nguồn mở rộng và hỗ trợ. Không tràn ngang, không control bị cắt. Cards một cột; status wrap; nguồn/metadata từ 12px; nút và summary có touch target tối thiểu 44px ở các control chính.

Desktop **1280 × 900**: Home và Results cả ba hành trình không tràn ngang. Main rộng 960px, căn giữa. Hai track JOB_LOSS đo được cùng kích thước 432 × 326px. Housing/Child giữ hai cột khi đủ rộng. Không có sidebar rỗng hoặc carousel ngang.

Bằng chứng: [browser audit](STEP_7_BROWSER_AUDIT.json), [Home desktop](screenshots/step-7/home-desktop.jpg), [Home mobile](screenshots/step-7/home-mobile.jpg), [Job](screenshots/step-7/job-mobile.jpg), [Housing](screenshots/step-7/housing-mobile.jpg), [Child](screenshots/step-7/child-mobile.jpg).

## 8. Accessibility / quality

Buttons/links/checkbox/summary dùng control thật. Chọn tình huống và câu trả lời có bàn phím; kiểm tra ArrowRight chọn được lựa chọn tiếp theo ở phần tìm việc. Focus hiển thị cho control và summary. Modal có tên, Escape đóng và không còn tiêu đề đọc hai lần. Icon cơ chế chỉ trang trí. Tăng độ đọc của metadata và note; hỗ trợ giảm chuyển động. Đây là kiểm tra cơ bản, không phải chứng nhận WCAG hoặc kiểm tra đầy đủ bằng screen reader.

## 9. Recovery

State nằm trong React và query URL; không dùng localStorage/sessionStorage/cookie để lưu câu trả lời. Home `/` không khôi phục hành trình cũ. Refresh kế hoạch thủ công về Home, vì URL không có câu trả lời. Results/plan thiếu ngữ cảnh và journey không hợp lệ được chuẩn hóa thành `/`; đã xác nhận trên production. `?demo=jobloss` vẫn mở câu hỏi có ngữ cảnh nội bộ, không được quảng bá trên UI. Trang không tồn tại có 404 tiếng Việt và link Home.

## 10. Validation

Chạy trong `apps/web`, Node **v24.14.1**, package lock: Next **16.3.8**, React **19.3.0**, TypeScript **5.9.3**, Tailwind **4.3.3**.

| Command | Result |
| --- | --- |
| `npm run typecheck -- --incremental false` | PASS, exit 0. |
| `npm test` | PASS: 76/76, 0 failed/skipped. |
| `npm exec --no -- tsc --noEmit --noUnusedLocals --incremental false` | PASS, exit 0. |
| Lint | Không có script lint, không thêm công cụ mới. Kiểm tra unused không được coi là lint. |
| `npm run build` | PASS, exit 0 trong môi trường local thực tế; không warning/error trong output. Webpack compile, TypeScript, static pages, build traces hoàn tất. |
| `npm run start -- --port 3001` | PASS; production sẵn sàng, không phụ thuộc dev server; kiểm tra UI/recovery/404 hoàn tất, không có console error/warn được ghi nhận. Tiến trình kiểm tra đã dừng. |

Build tạo `/` và `/_not-found` dạng static. Build production đã được chạy ngoài sandbox với quyền thực thi local; không bỏ qua lỗi build hay dùng dev server thay cho build. Port 3000 của người dùng được giữ nguyên.

## 11. Vercel readiness

Root Directory **apps/web**, preset **Next.js**, Node **24.x**, Install **npm ci**, Build **npm run build**, Output Directory mặc định. `vercel.json` hiện có đã đúng, không cần đổi. Không có environment variable bắt buộc hoặc backend để build/chạy frontend. Xem [deployment commands/settings](DEPLOYMENT.md).

Không thấy localhost, đường dẫn file local, environment variable hoặc fetch backend trong app/components/lib đang dùng. Rendered links trong cả chín tình huống Results/Plan đã kiểm tra HTTPS/tel/hash và rel an toàn. Dữ liệu frontend được bundle từ JSON/TypeScript hiện có; Vercel không phải đọc `/data` hay chạy Docker.

## 12. Remaining risks / scope limits

- Các cơ hội vẫn chưa xác nhận tin tuyển dụng, còn chỗ hoặc tuyển sinh. Giá, phí và giờ hoạt động cần hỏi lại; không phải marketplace giao dịch.
- Đợt/chương trình hiển thị dựa trên snapshot ngày **04/10/2026**, không phải cập nhật thời gian thực. Cần đối chiếu thông báo mới nhất; note ngày vẫn được giữ.
- Kiểm tra source trong bước này xác nhận presentation và cấu trúc link. Không xác nhận lại nội dung hoặc uptime của mọi trang bên ngoài. Anomaly slug `SRC_JOB_DN_001` đã được phê duyệt trước đó; giữ nguyên URL và trạng thái nguồn.
- Refresh thủ công xóa ngữ cảnh có chủ ý; không có lưu hồ sơ/câu trả lời lâu dài.
- Trước khi Vercel build từ Git, phải đưa các file frontend hiện còn untracked vào revision triển khai. Bước này không commit/push/deploy.
- Vercel build thực tế chưa chạy vì chưa deploy. Không có cam kết WCAG đầy đủ hoặc bảo đảm xác nhận quyền hưởng.

Dừng sau STEP 7. Không triển khai thêm feature hoặc backend.
