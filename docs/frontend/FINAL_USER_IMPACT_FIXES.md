# FINAL USER-IMPACT FIXES — AN SINH 360

Ngày kiểm tra: 10/10/2026. Chỉ sửa frontend trong phạm vi worker audit. Không thêm hành trình, backend, xác thực, AI, marketplace; không sửa CSV, snapshot, luật hoặc kết luận quyền hưởng. Chưa deploy.

## 1. Files changed

| Nhóm | Files trong `apps/web` |
| --- | --- |
| Đích đến và ngôn ngữ | `lib/official-destinations.ts` (mới), `lib/public-copy.ts`, `components/source-badge.tsx`, `components/demo-app.tsx` |
| Mất việc | `lib/demo.ts`, `lib/action-plan.ts`, `lib/job-journey.ts`, `components/job-termination-question.tsx`, `components/job-action-plan.tsx`, `components/job-service-handoff.tsx`, `components/job-opportunities.tsx` |
| Nhà ở | `lib/housing-journey.ts`, `components/housing-journey.tsx` |
| Trẻ em | `lib/child-journey.ts`, `components/child-journey.tsx`, `components/analysis-screen.tsx` |
| Kiểm thử | `tests/user-impact.test.ts` (mới); cập nhật `actionability-realism`, `child-journey`, `housing-journey`, `job-journey`, `presentation`, `product-audit`, `public-copy` tests |
| Tài liệu | README, báo cáo này, `docs/frontend/DEPLOYMENT.md`; ảnh `screenshots/user-impact/job-factual-question-mobile.png` |

Workspace đã có nhiều thay đổi từ các bước trước. Danh sách trên là phạm vi chỉnh sửa của bước này; không coi toàn bộ `git status` là thay đổi mới.

## 2. Broken links fixed/replaced

Bộ chuyển đích đến chỉ áp dụng khi render. Canonical URL và trạng thái VERIFIED_OFFICIAL trong nguồn vẫn nguyên vẹn, kể cả SRC_JOB_DN_001.

| Đường dẫn/đích đến | Kiểm tra | UI sử dụng |
| --- | --- | --- |
| JOB_SV_001, mã 1.014748, URL `/p/home/...` | Worker audit: trang “Trang không tồn tại” | “Tra cứu thủ tục chính thức” → [Cổng Dịch vụ công](https://dichvucong.gov.vn/), có ô tìm kiếm. Tìm “Hưởng trợ cấp thất nghiệp” |
| CHILD_SV_002, mã 410633 | Kiểm tra trực tiếp: “Trang không tồn tại” | Cổng tra cứu chính thức, tên thủ tục/provider và 1022 khi chưa biết nơi tiếp nhận |
| CHILD_SV_003, mã 2.002621 | Kiểm tra trực tiếp: “Trang không tồn tại” | Cổng tra cứu chính thức, cơ quan phụ trách phần việc và 1022 |
| CHILD_SV_001, mã 410614, host `thutuc` | Kiểm tra trực tiếp: 503 Service Temporarily Unavailable; không khẳng định mất vĩnh viễn | Cổng tra cứu chính thức |
| Bài “Điểm dừng chân công nhân” SRC_GEN_004 | Worker audit: Not Found | Không dùng bài hỏng làm CTA. Nguồn phụ chuyển [Công đoàn Đà Nẵng](https://congdoandanang.org.vn/); tìm nhà trọ dẫn đến gọi 1022 |
| Host công đoàn `site.congdoandanang.org.vn` | Không dùng làm đích quan trọng; chưa xác nhận lại uptime host này | Cổng Công đoàn Đà Nẵng. Không gọi trang chủ là địa chỉ điểm dừng chân cụ thể |
| [Đà Nẵng](https://danang.gov.vn/) | Trình duyệt hiển thị trang chủ và ô tìm kiếm | Tra cứu thông báo nhà ở, có 1022 dự phòng |
| [Thông báo B4-1/B4-2](https://hoacuong.danang.gov.vn/vi/web/p-hoa-cuong/w/cong-bo-cong-khai-thong-tin-tiep-nhan-ho-so-dang-ky-mua-nha-o-xa-hoi-tai-khu-dat-b4-1-b4-2-thuoc-khu-tai-dinh-cu-hoa-hiep-4) | Mở được đúng tiêu đề thông báo | Giữ link thông báo mua; không dùng cho nhu cầu thuê |
| [Hướng dẫn mầm non](https://cttdt.danangportal.gov.vn/en/web/dng/w/trien-khai-chinh-sach-phat-trien-giao-duc-mam-non-o-khu-cong-nghiep) | Trình duyệt hiển thị bài 01/07/2026 và các cơ quan hướng dẫn | Giữ hướng dẫn; không gọi bài này là danh bạ cơ sở |
| [1022](https://1022.vn/) / [Việc làm quốc gia](https://vieclam.gov.vn/) | Trình duyệt mở được các cổng tương ứng | Giữ kênh hỗ trợ/tìm việc; không xác nhận một phòng, trường hoặc vị trí tuyển dụng từ việc trang chủ mở được |
| [Trang liên hệ Trung tâm](https://cttdt.danangportal.gov.vn/vi/web/dng/w/so-xay-dung) | Hiển thị “Sở Nội vụ”, Trung tâm, 278 Âu Cơ và 0236 3740260 | Giữ nguồn đã duyệt; không đánh giá nguồn bằng slug |

Công cụ web có timeout/403 ở một số cổng; đã kiểm tra bằng trình duyệt thật. Kiểm tra là một thời điểm, không bảo đảm uptime về sau. Không gọi điện, gửi biểu mẫu hoặc đăng nhập. Chưa kiểm tra lại toàn bộ tài liệu pháp luật và thông báo lịch sử nằm trong disclosure.

## 3. JOB_LOSS legal-question change

Câu mới: “Bạn nghỉ việc theo trường hợp nào gần nhất?” với năm đáp án: hết hạn hợp đồng; hai bên thỏa thuận; doanh nghiệp chấm dứt; chủ động nghỉ; chưa rõ.

Lưu riêng `terminationCircumstance` để ghi sự việc. Không chuyển sang LEGAL/UNLAWFUL, không suy ra quyền hưởng. Trường pháp lý và rule nguồn không sửa. Câu trả lời thực tế cho phép tiếp tục kiểm tra thời gian tham gia/chuẩn bị thông tin, rồi Trung tâm đối chiếu pháp lý. Các trạng thái pháp lý cũ vẫn được xử lý tương thích nội bộ nhưng không hiển thị thành lựa chọn cho người lao động.

Đích dự phòng luôn có tại kết quả/kế hoạch: **Trung tâm Dịch vụ việc làm TP Đà Nẵng — 278 Âu Cơ, phường Liên Chiểu — 0236 3740260**; nút gọi `tel:02363740260`.

## 4. Housing budget/capacity fix

Sức chứa là ràng buộc: nhóm đáp ứng số người đứng trước nhóm không đáp ứng, rồi xếp theo ngân sách, khu vực và điều kiện trẻ nhỏ đã có căn cứ. Hộ ba người không nhận loại tối đa hai người ở đầu khi có loại đủ sức chứa. Mismatch luôn ở ngoài phần mở rộng. Khi không loại nào đáp ứng, có thông báo thiếu sức chứa và heading “Phương án gần nhất để tham khảo”.

Giới hạn tiền nhà là **mức tối đa theo đầu trên, bao gồm điểm biên**:

| Lựa chọn | Trần dùng để so sánh |
| --- | --- |
| Dưới 2 triệu | ≤ 2.000.000 đồng |
| 2–3 triệu | ≤ 3.000.000 đồng |
| 3–5 triệu | ≤ 5.000.000 đồng |
| Trên 5 triệu / chưa xác định | Chưa có trần cụ thể; không tuyên bố trong ngân sách hoặc suy ra khả năng chi trả vô hạn |

Toàn bộ khoảng giá phải không vượt trần mới được ghi “Không vượt ngân sách bạn chọn”. Giá thấp hơn không bị phạt. Khoảng có đầu trên vượt trần mang cảnh báo. Thông báo thiếu phương án ngân sách xét các loại hình đáp ứng sức chứa, có dòng giải thích rõ phạm vi này. Với 4 người trở lên, chỉ dùng tối thiểu bốn người để đối chiếu; vẫn yêu cầu hỏi lại nếu đông hơn.

## 5. Housing concrete-vs-direction

Giữ kiểm tra provenance, địa chỉ, nguồn HTTPS an toàn, giá, ngày xác minh và trạng thái trước khi render tin cụ thể. Link nguồn của bản ghi đã xác minh là đường liên hệ dựa trên nguồn. Tin cụ thể hiển thị địa chỉ, diện tích nếu có, sức chứa, nguồn/ngày và CTA mở nguồn.

Cả ba bản ghi nhà ở hiện tại chưa đủ căn cứ: hiển thị **Gợi ý loại hình**, không dựng địa chỉ/chủ trọ/số điện thoại/còn phòng. Ghi rõ “AN SINH 360 chưa có tin phòng cụ thể đã được xác minh cho lựa chọn này.” Giá là “Khoảng tham khảo”. Một nơi tìm thông tin chung dẫn đến 1022, có nội dung thẳng thắn rằng chưa có đầu mối phòng trọ cụ thể.

## 6. Social-housing destination

Kế hoạch: xác định mua/thuê → xem đợt đang/sắp mở → đọc cơ quan/cách liên hệ trong thông báo → chỉ chuẩn bị hồ sơ sau khi chọn đúng đợt. Có cổng Đà Nẵng để tìm thông báo và 1022 để hỏi đầu mối; không gán địa chỉ tiếp nhận mới. Với thuê, ghi chưa có đợt hiện hành đã xác minh trong dữ liệu. Thông báo mua B4-1/B4-2 không được coi là đợt thuê. Lịch vẫn theo snapshot 04/10/2026 và có yêu cầu đối chiếu mới nhất.

## 7. UNDER_6 stale-summary fix

Tóm tắt dùng `childPrimaryNeed` hiện tại thay vì lặp ý định giấy tờ ban đầu. ALL_DONE + CARE hiển thị **“Ưu tiên: Tìm nơi chăm sóc trẻ”** ở kết quả và bản tóm tắt nhờ hỗ trợ. Giữ sự kiện ba việc đã xong; không gợi ý làm lại.

## 8. Childcare concrete-vs-direction

Cơ sở cụ thể phải có tên, địa chỉ, nguồn, URL an toàn, nhóm tuổi, ngày xác minh và trạng thái; phí/lịch chỉ trình bày như thông tin cơ sở khi thuộc bản ghi đủ căn cứ. CTA “Mở nguồn / Liên hệ cơ sở”. Test cơ sở cụ thể dùng dữ liệu synthetic `example.org` chỉ trong kiểm thử, không thêm vào dữ liệu sản phẩm.

Ba bản ghi hiện tại đều là **Gợi ý loại hình chăm sóc**. Phí và giờ mang nhãn “Khoảng tham khảo”, không dùng ngày chỉnh sửa làm ngày kiểm tra thị trường. Một disclosure chung xác nhận chưa có cơ sở cụ thể được xác minh. Kế hoạch mở đầu bằng **Xác định loại cơ sở phù hợp** → **Tìm cơ sở thực tế trong khu vực**, gọi 1022; kiểm tra phí/giờ/an toàn thực hiện sau khi tìm được cơ sở. Không còn yêu cầu chọn 1–2 nơi để liên hệ khi chỉ có loại hình.

## 9. Preschool support destination

Giữ “Hỗ trợ mầm non cho con người lao động”, hướng dẫn chính thức hiện có và cơ quan trong dữ liệu: Ủy ban nhân dân / Sở Giáo dục và Đào tạo Đà Nẵng. Nếu trẻ chưa học, chỉ rõ hỏi đầu mối địa phương/cơ quan trong hướng dẫn; gọi 1022 nếu chưa biết nơi phụ trách. Không kết luận gia đình được hưởng, không chế địa chỉ/số điện thoại cơ quan mới.

## 10. Duplicated-content cleanup

Một nhãn trạng thái trên mỗi card và một note chung mỗi nhóm cơ hội. Bỏ disclaimer lặp trong từng trường/card, bỏ cảnh báo vượt ngân sách lặp trong danh sách lý do khi đã có cảnh báo riêng. Giữ các mismatch thực tế. Lịch sử nhà ở nằm dưới “Các đợt trước đây”, mặc định đóng. Các từ NOXH/GDMN/KCN/BHYT/BHXH/BHTN ở tiêu đề nguồn/provider chính được chuyển thành từ đầy đủ khi render; nội dung và mã văn bản nguồn không sửa. Loading nói so sánh hướng chăm sóc, không tuyên bố đã tìm được trường.

## 11. Validation

| Check | Result |
| --- | --- |
| `npm run typecheck -- --incremental false` | PASS |
| `npm test` | **105/105 PASS**, 0 fail, 0 skipped; gồm 11 tests mới |
| Lint | Không có lint script; không cài thêm công cụ |
| `npm exec --no -- tsc --noEmit --noUnusedLocals --incremental false` | PASS |
| `npm run build` | PASS, production webpack build, `/` và `/_not-found`; không warning/error trong log build |

Browser production kiểm tra ca hộ 3 người dưới 2 triệu tại Hòa Khánh: loại 2–4 người đứng trước loại 1–2, cảnh báo ngân sách và sức chứa có mặt. UNDER_6 đi từ giấy tờ → cả ba đã xong → chăm sóc: summary đúng nhu cầu hiện tại, kế hoạch đúng hai bước và link 1022. JOB_LOSS: mở năm đáp án thực tế, chọn chủ động nghỉ, ưu tiên chuyển sang thông tin thời gian bảo hiểm, không hiển thị kết luận pháp lý; cổng tra cứu và Trung tâm vẫn có mặt. Bản cuối reload production, kiểm tra câu hỏi trên viewport 390 × 844; không overflow ngang (`scrollWidth` ≤ `innerWidth`). Ảnh lưu trong thư mục báo cáo. Các ca biên còn lại và nhánh cơ sở cụ thể kiểm tra tự động; không tuyên bố đã duyệt thủ công tất cả tổ hợp.

Chạy lại từ `apps/web`:

```powershell
npm run typecheck -- --incremental false
npm test
npm exec --no -- tsc --noEmit --noUnusedLocals --incremental false
npm run build
npm run start -- --port 3001
```

## 12. Remaining verified-data limitations

- **0 tin tuyển dụng cụ thể, 0 tin phòng cụ thể, 0 cơ sở chăm sóc trẻ cụ thể đủ xác minh** trong dữ liệu hiện tại; mỗi nhóm giữ ba gợi ý. Không thêm dữ liệu ngoài đời để lấp chỗ trống.
- Chưa có đầu mối phòng trọ/cơ sở trẻ cụ thể. 1022 là đường hỏi nơi phụ trách, không bảo đảm có phòng/trường hoặc tiếp nhận hồ sơ cho mọi việc.
- Thiếu nguồn/ngày xác minh giá, lương, học phí, lịch theo từng cơ sở. Các khoảng này không được khẳng định là thị trường hiện tại.
- Không có đợt thuê nhà ở xã hội hiện hành được xác minh trong snapshot. Cần đối chiếu thông báo mới; chưa tái xác minh toàn bộ lịch sử.
- Không có URL thủ tục chi tiết thay thế đã xác minh cho các link Dịch vụ công nêu trên. Dùng cổng tra cứu chính thức và người hỗ trợ, không giả vờ đó là trang hồ sơ trực tiếp.
- Kiểm thử không xác nhận quyền hưởng, chất lượng cơ sở, tồn phòng, tuyển sinh, tuyển dụng hoặc cơ quan ra quyết định. Chưa có cơ chế cập nhật/kiểm tra URL tự động; phạm vi vẫn frontend.

Dừng sau các sửa đổi này.
