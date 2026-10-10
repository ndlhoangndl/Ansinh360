# STEP 7 — Actionability, data realism và child logic

Hoàn thành ngày 10/10/2026. Chỉ frontend; chưa deploy. Báo cáo này cập nhật trạng thái sau `STEP_7_FINAL_PRODUCT_AUDIT.md`; các báo cáo trước là lịch sử từng bước.

## 1. Files changed trong bước này

Các file dưới `apps/web/`:

```text
app/globals.css
components/demo-app.tsx
components/housing-journey.tsx
components/job-results.tsx
components/job-action-plan.tsx
components/job-opportunities.tsx
components/job-service-handoff.tsx
components/child-journey.tsx
lib/opportunity-grounding.ts             (mới)
lib/competition-demo.ts                  (mở rộng type; không sửa bản ghi)
lib/housing-journey.ts
lib/action-plan.ts
lib/child-journey.ts
lib/demo.ts
tests/actionability-realism.test.ts      (mới, 18 tests)
tests/child-journey.test.ts
tests/housing-journey.test.ts
tests/job-journey.test.ts
tests/public-copy.test.ts
```

Tài liệu: `README.md`, `docs/frontend/DEPLOYMENT.md`, báo cáo này. Bằng chứng: `STEP_7_ACTIONABILITY_TEST.log` và `screenshots/step-7-actionability/`. Workspace có thay đổi từ các bước trước; danh sách trên không coi toàn bộ `git status` là thay đổi mới của bước này. Chưa commit/push.

## 2. Housing: thông tin và hành động

Thẻ cụ thể cần provenance đã xác minh trong dự án, địa chỉ rõ, khu vực, nguồn có tên và HTTPS URL, giá, ngày xác minh và trạng thái. Khi đủ dữ liệu, thẻ hiển thị địa chỉ, giá, diện tích nếu có, số người, nguồn/ngày/trạng thái và nút mở nguồn. Không sao chép liên hệ cá nhân từ nguồn ngoài.

Ranking giữ thứ tự ngân sách → khu vực → số người → điều kiện ở cùng trẻ chỉ khi có xác minh riêng. Không gắn lý do trong ngân sách cho mục vượt ngân sách; thông báo không khớp hoàn toàn vẫn hiển thị. `RECENT`, `NEEDS_CONFIRMATION`, `EXPIRED` có nhãn công khai tương ứng; bản ghi hết hạn được loại trước khi xếp hạng. Hết hạn theo trạng thái rõ ràng hoặc `expiresAt`, không tự đặt thời hạn cho nguồn. Ngày chỉnh sửa bản ghi không được coi là ngày xác minh.

Các hướng hỗ trợ/chương trình nhà ở xã hội giữ riêng, một hướng chính theo ý định người dùng, các hướng khác thu gọn. Nội dung pháp lý và thông báo gốc giữ nguyên.

## 3. Housing: gợi ý loại hình và chỗ ở cụ thể

Ba mục nhà ở hiện tại đều thiếu địa chỉ và tin gốc được xác minh: hiển thị **Gợi ý loại hình**, tên hướng tìm và chi phí tham khảo, không phải phòng đang cho thuê. Không hiển thị “Cần xác nhận còn chỗ” cho chúng. Điều kiện trẻ nhỏ hiển thị chưa có thông tin xác nhận, không suy từ mẫu loại hình.

Nút dẫn tới `housing-search-destination`, chuyển focus và cuộn tới nơi tiếp tục: ghi ngân sách/khu vực/số người → mở nguồn hỗ trợ người lao động đã có trong dự án → tìm tin thật có địa chỉ và nguồn → đối chiếu chi phí/hợp đồng, xem trực tiếp. Nguồn điểm dừng chân công nhân là đầu mối hỗ trợ, không được mô tả thành danh mục phòng hoặc bảo đảm còn phòng. Chi tiết kết thúc bằng một ghi chú về giá/tình trạng có thể thay đổi.

## 4. Trợ cấp thất nghiệp

Kết quả hiển thị ngay một việc đầu tiên theo thông tin còn thiếu, rồi Trung tâm Dịch vụ việc làm TP Đà Nẵng, **278 Âu Cơ, phường Liên Chiểu**, **0236 3740260**. Nút **Xem 3 bước kiểm tra trợ cấp** dẫn tới:

1. Kiểm tra giấy tờ nghỉ việc.
2. Xem lại thông tin tham gia bảo hiểm thất nghiệp.
3. Liên hệ nơi có thể đối chiếu.

Bước 3 có địa chỉ, số điện thoại nhìn thấy, nút **Gọi Trung tâm** (`tel:02363740260`) và **Xem thủ tục chính thức**. Mã thủ tục vẫn là metadata phụ. Việc ưu tiên theo ngữ cảnh và các biểu mẫu xác nhận hiện có được giữ. Không thu số BHXH/CCCD/tài khoản; không suy số tháng đóng từ câu trả lời có tham gia; không thay eligibility/threshold/enum pháp lý.

## 5. Hướng công việc và tin tuyển dụng

Ba mục hiện có thiếu employer/source được xác minh nên là **Gợi ý hướng công việc**, dưới tiêu đề **Một số hướng công việc đáng tìm**. Thu nhập/lịch là tham khảo; tối đa hai lý do theo câu trả lời; không có “Ứng tuyển ngay”.

Nút **Tìm tin đang tuyển cho công việc này** cập nhật tên hướng đang tìm và thực sự chuyển focus/cuộn tới `job-search-destination`. Đích hiển thị Trung tâm, địa chỉ/điện thoại và **Mở nguồn việc làm** tới `https://vieclam.gov.vn/` từ dữ liệu dự án. Không dừng ở hướng dẫn trong accordion.

Nhánh thẻ có nguồn chỉ dùng khi provenance, employer, nguồn/URL, khu vực, ngày xác minh và trạng thái đầy đủ; có nút **Mở tin gốc**. Hiện chưa có bản ghi thực tế dùng nhánh này.

## 6. UNDER_6

Hỏi nhu cầu chính trước: giấy tờ/bảo hiểm, chăm sóc, hỗ trợ hoặc chưa rõ. Chỉ hỏi việc còn thiếu khi nhu cầu giấy tờ/chưa rõ. Một việc thiếu thì chỉ đề nghị việc đó. Khi chọn nhiều việc, hỏi nhóm việc cụ thể; chưa rõ không đồng nghĩa cả ba việc chưa xong.

Cả ba đã xong → loại thẻ và kế hoạch giấy tờ. Hỏi nhu cầu tiếp theo: chăm sóc, hỗ trợ hoặc hiện chưa cần việc khác. Chăm sóc giữ nguyên giai đoạn UNDER_6 và bổ sung bốn câu hỏi chăm sóc; hỗ trợ là hướng chính có điều kiện, không suy trẻ đang học mầm non; không có thai sản. Không có nhu cầu khác → thông báo hoàn thành và hai lựa chọn phụ khi cần, không tạo nhiệm vụ.

Đổi nhu cầu xóa ưu tiên tiếp theo cũ và trạng thái chăm sóc cũ, giữ sự kiện các việc đã hoàn thành. Nhu cầu vừa chọn luôn ưu tiên trước trạng thái cũ. Có regression test riêng cho việc đổi từ CARE sang SUPPORT.

## 7. NEWBORN

Giữ hướng sau sinh và thai sản theo cha/mẹ/người hỗ trợ. Với bé đã sinh, hỏi việc nào chưa hoàn thành; việc biết đã xong không được đề nghị làm lại. Cả ba xong → bỏ thẻ giấy tờ và các bước giấy tờ, còn hướng thai sản theo vai trò. Chưa rõ → xác định việc nào đã hoàn thành, không mặc định mọi việc đều thiếu. Bé sắp sinh chỉ chuẩn bị cho sau sinh, không yêu cầu làm thủ tục cho trẻ chưa sinh.

## 8. PRESCHOOL

Giữ ranking theo nhu cầu hiện có. Hiển thị kết luận trước, một phương án mạnh nhất/gần nhất, tối đa hai phương án phụ đóng mặc định, rồi hỗ trợ mầm non và kế hoạch. Không hiển thị điểm số hoặc thư mục cơ sở. Các lý do không khớp chỉ gồm ngân sách/giờ đón/khu vực/tuổi thực sự khác lựa chọn.

Kế hoạch: chọn 1–2 cơ sở thực tế từ nguồn tìm được → xác nhận tổng chi phí/giờ đưa đón → hỏi tuyển sinh và xem trực tiếp → hỏi hỗ trợ song song. Không có thai sản; hỗ trợ không ngang hàng với lựa chọn chăm sóc chính.

## 9. Loại hình chăm sóc và cơ sở thực tế

Ba mục hiện có là **Gợi ý loại hình chăm sóc**: không dùng tên mẫu như tên trường thật, không gắn trạng thái tuyển sinh giả. Giải thích rõ dùng để xác định loại cơ sở và mức chi phí trước khi tìm cơ sở thực tế. Hỏi nguồn địa phương qua đầu mối 1022 đã có trong dự án; nguồn hướng dẫn hỗ trợ mầm non chỉ là hướng dẫn hỗ trợ, không phải danh bạ cơ sở.

Nhánh cơ sở cụ thể cần tên cơ sở, địa chỉ, khu vực, nguồn có tên/URL, nhóm tuổi, ngày xác minh và trạng thái; học phí nếu có vẫn cần đối chiếu. Không thêm trường/địa chỉ/số điện thoại ngoài dữ liệu xác minh.

## 10. Validation

| Check | Kết quả |
| --- | --- |
| `npm run typecheck -- --incremental false` | PASS |
| `npm test` | **94/94 PASS**, 0 fail/skip/cancel |
| `npm exec --no -- tsc --noEmit --noUnusedLocals --incremental false` | PASS |
| Lint | Không có lint script trong project; không báo là lint PASS |
| `npm run build` | **PASS**, Next 16.3.8 webpack, không warning/error |
| Local production `npm run start -- --port 3001` | PASS |

18 test mới cùng các test cập nhật bao phủ toàn matrix Housing/Job/UNDER_6/NEWBORN/PRESCHOOL yêu cầu. Thẻ có nguồn được kiểm thử bằng bản ghi tổng hợp riêng trong test; bản ghi đó không được đưa vào dữ liệu hoặc UI công khai.

Build chạy trong môi trường Windows local được cấp quyền để tránh vấn đề sandbox/SWC đã biết. Lần build hoàn tất của bước này không có lỗi; không suy rằng build local cũng xác nhận Vercel đã deploy.

Browser QA production: Home, route trình bày nội bộ, Job bảo hiểm chưa rõ → kết quả/bộ ba bước → hướng kho vận → focus tới nguồn tìm tin; Housing dưới 2 triệu/ba người/có trẻ/Hòa Khánh → cảnh báo ngân sách, gợi ý loại hình → focus nguồn → kế hoạch; UNDER_6 cả ba xong/không cần thêm → không có admin; chuyển sang CARE → giữ giai đoạn, một lựa chọn chính/hai phụ đóng, không admin/thai sản trong kế hoạch; chuyển sang SUPPORT → không admin/thai sản. Kiểm tra viewport **390 × 844** và **1280 × 900**; không thấy horizontal overflow trong các màn đã đo. Không ghi nhận console warn/error ở phiên QA. Các nhánh còn lại trong matrix được kiểm tra tự động, không tuyên bố đã thao tác thủ công tất cả tổ hợp.

Nguồn ngoài: đã kiểm tra đích URL, `tel`, rel an toàn và hành vi điều hướng; không gọi điện, không đăng ký/nộp hồ sơ, không xác nhận lại uptime/nội dung mọi nguồn bên ngoài.

Chạy lại từ repository với Node 24:

```powershell
Set-Location 'D:\Ý tưởng dự án Liên Chiểu\apps\web'
npm ci
npm run typecheck -- --incremental false
npm test
npm exec --no -- tsc --noEmit --noUnusedLocals --incremental false
npm run build
npm run start -- --port 3001
```

Mở `http://127.0.0.1:3001/`; Ctrl+C dừng server. Development: `npm run dev`, cổng 3000. Không đổi routing/reset/storage. `/` vẫn là Home, route nội bộ không được quảng bá trên giao diện.

## 11. Khoảng trống dữ liệu

| Nhóm | Bản ghi cụ thể đủ nguồn hiện tại | Dữ liệu còn cần |
| --- | --- | --- |
| Phòng/chỗ ở tư nhân | **0**; ba hướng loại hình | Địa chỉ thật, nguồn tin/giá, ngày xác minh, trạng thái/hạn, điều kiện trẻ/số người/chi phí |
| Tin tuyển dụng | **0**; ba hướng công việc | Employer thật, tin gốc, địa điểm, lịch/lương công bố, ngày/trạng thái |
| Cơ sở chăm sóc | **0**; ba hướng loại hình | Tên thật, địa chỉ, nguồn/giấy phép, tuổi nhận, tổng phí/lịch, ngày/trạng thái |

Nguồn chính thức đã có về chương trình, thủ tục và đầu mối hỗ trợ không xác minh những mục tư nhân này. `VERIFIED_PROJECT` là hợp đồng dữ liệu yêu cầu xác minh trước, không phải tính năng tự xác minh URL. Các nguồn/ngày/status cần được đối chiếu bằng nguồn thực tế trước khi đưa bản ghi cụ thể vào sản phẩm; không tự diễn giải giá mẫu thành báo giá thật hoặc suy “RECENT” từ thời gian chỉnh sửa.

Không sửa CSV, snapshot `demo-data.json`, backend, kiến trúc database hay quy tắc pháp lý. Giữ URL và trạng thái `VERIFIED_OFFICIAL` của `SRC_JOB_DN_001` theo phê duyệt anomaly trước đây. Không phát hiện xung đột pháp lý mới trong phạm vi thay đổi này. **Dừng sau STEP 7 này; chưa deploy.**
