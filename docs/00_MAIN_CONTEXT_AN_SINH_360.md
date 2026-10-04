# AN SINH 360 — MAIN CONTEXT / NGUỒN CHÍNH DỰ ÁN LIÊN CHIỂU

Cập nhật: 04/10/2026

Trạng thái: Baseline chính thức để các cuộc trò chuyện sau tiếp tục công việc.

## 1. TÊN VÀ ĐỊNH VỊ DỰ ÁN

Tên: AN SINH 360

Định vị ưu tiên: Bộ điều hướng chính sách, dịch vụ và cơ hội cho người lao động Liên Chiểu.

Tagline ưu tiên: “Từ hoàn cảnh đến hành động.”

Không định vị là:

- cổng chính phủ mới;
- super app;
- ứng dụng thay thế VNeID/VssID/MyPortal/DVCQG;
- job board;
- chatbot pháp luật tổng quát.

Mô tả một câu:

AN SINH 360 giúp người lao động chuyển từ hoàn cảnh cá nhân sang chính sách cần kiểm tra, dịch vụ phù hợp, cơ hội đang mở/sắp mở và hành động tiếp theo có căn cứ từ nguồn chính thức.

Core flow:

HOÀN CẢNH → POLICY → SERVICE → OPPORTUNITY → NEXT ACTION

## 2. VẤN ĐỀ CỐT LÕI

Người lao động không thiếu hoàn toàn chính sách hoặc dịch vụ; vấn đề là khi hoàn cảnh thay đổi — mất việc, khó khăn nhà ở, có con nhỏ — họ phải tự tìm, hiểu và ghép nhiều nguồn khác nhau để biết:

- mình có quyền lợi nào cần kiểm tra;
- còn thiếu điều kiện/thông tin gì;
- phải thực hiện ở đâu;
- cần chuẩn bị hồ sơ gì;
- có đợt/chương trình nào đang mở;
- bước tiếp theo nên làm là gì.

## 3. ĐỐI TƯỢNG MVP

Người lao động/công nhân tại Liên Chiểu, ưu tiên công nhân KCN Hòa Khánh và khu nhà trọ đông công nhân.

Hai mode triển khai:

- Worker Mode: người lao động tự dùng.
- Support Mode: Công đoàn/Tổ công nhân tự quản/Điểm dừng chân hỗ trợ người lao động.

## 4. MVP ĐÃ KHÓA — CHỈ 3 JOURNEY

### 4.1 JOB_LOSS — “Tôi vừa mất việc”

Journey demo chính.

Bao gồm:

- trợ cấp thất nghiệp;
- thông báo tìm kiếm việc làm trong thời gian hưởng;
- tìm việc;
- tư vấn việc làm;
- đào tạo/nâng kỹ năng nghề;
- hỗ trợ trực tiếp nếu cần.

### 4.2 HOUSING_DIFFICULTY — “Tôi đang khó khăn về nhà ở”

Bao gồm:

- mua nhà ở xã hội;
- thuê nhà ở xã hội;
- nhà lưu trú công nhân;
- opportunity/đợt tiếp nhận đang mở, sắp mở, đã đóng.

### 4.3 HAS_CHILD — “Tôi có con nhỏ”

Tập trung vào worker-specific family support:

- thai sản nữ;
- thai sản nam;
- liên thông khai sinh/cư trú/BHYT trẻ dưới 6 tuổi;
- hỗ trợ mầm non cho con công nhân/người lao động.

Không mở thêm journey trước cuộc thi.

## 5. ĐIỂM MỚI — POSITIONING PHẢI GIỮ

Không được tuyên bố:

- “life-event là mới”;
- “AI tư vấn chính sách là mới”;
- “đầu tiên ở Việt Nam”;
- “chưa có hệ thống nào làm”.

Lý do:

- DVCQG đã có nhóm dịch vụ theo sự kiện cuộc sống.
- Hành chính công chủ động Đà Nẵng đã có life-event, thông báo chủ động, trợ lý ảo.
- BHXH địa phương đã có AI hỏi đáp theo tình huống.

Điểm mới an toàn:

Một workflow chuyên biệt cho người lao động theo chuỗi:

hoàn cảnh → policy matching đa lĩnh vực → explainable reason/missing info → service resolver → opportunity đang mở/sắp mở → checklist/next action → official source/human support.

Thông điệp so với Hành chính công chủ động:

“Hành chính công chủ động giải bài toán nối các thủ tục hành chính; AN SINH 360 mở rộng tư duy đó sang hành trình an sinh chuyên biệt của công nhân, bao gồm chính sách, dịch vụ và cơ hội ngoài một thủ tục hành chính đơn lẻ.”

## 6. CÔNG NGHỆ LÕI

Không nói chatbot là công nghệ lõi.

Core components:

- Policy Matching Engine
- Service Resolver
- Opportunity Registry
- Provenance / Source Governance Layer
- Optional AI/NLP layer

Luồng:

User text

→ AI trích xuất life event + structured facts

→ deterministic Policy Matching Engine

→ Service Resolver

→ Opportunity Registry

→ action journey

→ optional AI explanation

AI KHÔNG quyết định eligibility pháp lý.

Output status:

- POSSIBLE_MATCH — Có dấu hiệu phù hợp
- NEED_MORE_INFO — Cần thêm thông tin
- NO_MATCH — Chưa thấy phù hợp

Disclaimer chuẩn:

“Dựa trên thông tin bạn cung cấp, bạn có thể thuộc nhóm cần kiểm tra chính sách này. Quyết định cuối cùng do cơ quan có thẩm quyền xác nhận.”

## 7. PROTOTYPE — SCOPE ĐÃ KHÓA

Chỉ cần 4 màn hình:

1) Home: 3 life-event + ô mô tả tự nhiên.

2) Context questions: chỉ hỏi field thiếu cần thiết.

3) “Dành cho bạn”: policy/service match + status + WHY + missing fields + official source.

4) Journey/action plan: checklist + nơi thực hiện + opportunity + next action.

Không làm:

- admin dashboard;
- VNeID integration thật;
- BHXH API thật;
- native app;
- payment;
- crawler production;
- complex map;
- login phức tạp.

Demo chính:

Minh, 28 tuổi, công nhân KCN Hòa Khánh, đang thuê trọ, vừa mất việc.

Hệ thống hiểu JOB_LOSS → hỏi dữ liệu thiếu → kiểm TCTN → tư vấn/tìm việc → TTDVVL → checklist → nguồn chính thức.

## 8. DATASET — TRẠNG THÁI HIỆN TẠI

Tên workbook:

AN_SINH_360_DATASET_MASTER

Google Sheet:

https://docs.google.com/spreadsheets/d/1TqcsuU49GLMoXWP6FxEEZ-uSJllyYBBFYNzPVrYC0ck/edit

Dataset version:

v1.0-RC1

Status:

COMPLETE_FOR_MVP

Quy mô:

- 40 official sources
- 3 life events
- 12 policies
- 54 policy rules
- 22 services
- 23 service rules
- 7 opportunities
- 23 policy-service mappings
- 20 test cases
- 27 service checklist items
- 41 profile fields
- 29 enum/status definitions

Workbook tabs:

00_README

01_SOURCES

02_LIFE_EVENTS

03_POLICIES

04_POLICY_RULES

05_SERVICES

06_SERVICE_RULES

07_OPPORTUNITIES

08_POLICY_SERVICE_MAP

09_TEST_CASES

10_VERIFICATION_LOG

11_SERVICE_CHECKLISTS

12_PROFILE_FIELDS

13_ENUMS

## 9. SOURCE GOVERNANCE

Nguyên tắc:

NO SOURCE → NO DATA

NO VERIFIED SOURCE → NO RECOMMENDATION

Priority:

A0 — Primary legal source

A1 — Primary/direct service source

A2 — Official operation/support source

B — Official mirror

Nguồn dùng:

- vanban.chinhphu.vn
- dichvucong.gov.vn
- baohiemxahoi.gov.vn
- vieclam.gov.vn
- asxh.moha.gov.vn
- danang.gov.vn / cổng TTĐT Đà Nẵng
- MyPortal
- 1022
- Công đoàn Đà Nẵng

Secondary source chỉ dùng research/discovery, không dùng source_of_truth.

Mỗi rule pháp lý phải trace được:

rule_id → policy_id → source_id → document → article/khoản → verification status.

## 10. DỮ LIỆU PHÁP LÝ / SERVICE QUAN TRỌNG

JOB_LOSS:

- Luật Việc làm 74/2025/QH15
- Nghị định 374/2025/NĐ-CP
- TTHC 1.014748 hưởng TCTN
- 1.014749 thông báo tìm kiếm việc làm
- 1.014750 tạm dừng
- 1.014751 tiếp tục hưởng
- 1.014753 chuyển nơi hưởng
- 1.014746 tư vấn/giới thiệu việc làm
- 1.014747 hỗ trợ đào tạo/nâng kỹ năng
- TTDVVL Đà Nẵng: 278 Âu Cơ, phường Liên Chiểu
- Sàn việc làm quốc gia

HOUSING:

- Luật Nhà ở 27/2023/QH15
- NĐ100/2024 + chuỗi sửa đổi
- 24/VBHN-BXD là current reading source
- QĐ111/2026/QĐ-UBND Đà Nẵng là nguồn địa phương hiện hành
- QĐ47/2024/QĐ-UBND giữ historical, không dùng rule hiện hành
- Hòa Hiệp 4 opportunity có trạng thái thời gian
- Opportunity hết hạn phải CLOSED; SCHEDULED không được hiển thị “Nộp ngay”.

HAS_CHILD:

- Luật BHXH 41/2024/QH15
- NĐ105/2020/NĐ-CP
- NĐ145/2020/NĐ-CP (phần còn hiệu lực liên quan)
- NĐ104/2022/NĐ-CP sửa hồ sơ hộ khẩu giấy
- NQ43/2026/NQ-HĐND Đà Nẵng
- QĐ2850/QĐ-UBND
- Mức hỗ trợ mầm non Đà Nẵng: 200.000 đồng/trẻ/tháng, tối đa 9 tháng/năm học theo nguồn đã xác minh.

## 11. SERVICE RESOLVER

Policy trả lời:

“Tôi có thể cần kiểm tra quyền lợi nào?”

Service trả lời:

“Tôi phải đi đâu/dùng dịch vụ nào?”

Opportunity trả lời:

“Hiện có đợt/chương trình cụ thể nào đang/sắp mở?”

Filter/ranking:

1. life_event
2. intent
3. eligibility/context
4. jurisdiction
5. channel
6. freshness/status

Recommendation phải hiện:

- WHY
- missing facts
- provider/source
- last verified
- next action/link

Stale → NEED_REVIEW.

Conflict/complex → human fallback.

## 12. KÊNH PILOT THỰC TẾ

Công đoàn

→ Tổ công nhân tự quản

→ Điểm dừng chân công nhân

→ QR

→ AN SINH 360

→ dịch vụ chính thức

Đây là deployment channel ưu tiên ở Liên Chiểu.

## 13. BUSINESS MODEL

Người lao động dùng miễn phí.

Phân biệt:

- Beneficiary: người lao động.
- Deployment customer/partner: địa phương, Công đoàn, chương trình chuyển đổi số, tổ chức xã hội/CSR.

Nguồn tài chính khả thi:

- chương trình chuyển đổi số;
- ngân sách/chương trình cộng đồng;
- tài trợ/CSR;
- hợp tác/đặt hàng triển khai sau pilot.

Không ép mô hình subscription B2C cho công nhân.

## 14. KPI

Không bịa kết quả.

KPI phù hợp:

- Route Accuracy
- Source Coverage
- Time to Next Action
- User Understanding
- Journey Completion
- Missing-field accuracy
- Human-support routing correctness

Mục tiêu thiết kế được phép nói:

100% recommendation trong demo phải có nguồn chính thức.

Primary research nên bổ sung:

- 30–50 công nhân khảo sát
- 3–5 người Công đoàn/Tổ tự quản/phụ trách hỗ trợ

Không tự tạo tỷ lệ khi chưa khảo sát thật.

## 15. BỘ TIÊU CHÍ BGK — V2 PHỤ LỤC

Tổng 100 điểm:

### A. Sự cần thiết, mức độ ứng dụng — 20

- Giá trị cho khách hàng/xã hội — 10
- Giải quyết vấn đề thực tiễn bằng công nghệ — 10

### B. Tính khả thi, tiềm năng — 30

- Khả thi sản xuất/kinh doanh, cơ cấu chi phí, giá thành/cạnh tranh — 20
- Giám sát rủi ro, vận hành an toàn dữ liệu/AI — 10

### C. Tính mới, độc đáo, sáng tạo — 30

- Khác biệt/lợi thế cạnh tranh — 20
- Hàm lượng công nghệ lõi — 10

### D. Năng lực triển khai — 20

- Thuyết trình — 10
- Teamwork/kỹ năng mềm — 5
- Trưng bày/demo công nghệ — 5

Đánh giá hiện tại:

- Necessity: mạnh
- Feasibility: mạnh nhờ dataset/provenance/rule architecture
- Novelty: có, nhưng phải position là Policy–Service–Opportunity–Next Action; không claim life-event/AI là mới
- Implementation: phần cần làm tiếp vì prototype/slide/demo chưa hoàn thiện

## 16. BMC — HƯỚNG CHỐT

Partners:

Công đoàn, Tổ tự quản, Điểm dừng chân, cơ quan dịch vụ, địa phương.

Activities:

data verification, rule maintenance, service/opportunity refresh, platform operation.

Value:

Từ hoàn cảnh đến hành động; explainable; verified source; low-friction.

Customer relationships:

self-service + assisted support.

Segments:

workers + support staff; triển khai qua local partners.

Resources:

dataset, Rule Engine, source registry, team, web platform.

Channels:

web/PWA, QR, Công đoàn, Điểm dừng chân, Tổ tự quản.

Costs:

hosting, AI API, maintenance/verification, design/pilot/communication.

Funding:

local digital transformation/community program, CSR, partnership.

## 17. RỦI RO CẦN NÊU

- Pháp luật thay đổi → versioning + last_verified + superseded chain.
- Opportunity hết hạn → time-aware status.
- AI hallucination → AI không quyết định rule; chỉ explanation/extraction.
- Thiếu dữ liệu → NEED_MORE_INFO.
- Case phức tạp → human support.
- Privacy → không thu CCCD/số BHXH/tài khoản/ngày bệnh chi tiết trong demo.
- Digital literacy thấp → Support Mode + QR + Công đoàn/Tổ tự quản.

## 18. KIẾN TRÚC KỸ THUẬT MVP

Frontend:

React/Next/Vite, mobile-first.

Backend:

ASP.NET Core API.

Database:

PostgreSQL.

Logic:

Rule Engine + Service Resolver.

AI:

LLM API cho intent extraction + explanation.

Không microservice ở MVP.

Core API có thể:

POST /api/navigate

Input:

lifeEvent + profile facts.

Output:

policies + services + opportunities + missingFields + nextActions + source provenance.

## 19. ROADMAP

Phase 1 — Competition:

dataset + rule engine + 4-screen prototype.

Phase 2 — Liên Chiểu pilot:

QR + user test với worker/support staff.

Phase 3:

admin/change detection/crawler/API nếu cần.

Phase 4:

mở rộng journey/Đà Nẵng.

Future:

có thể tích hợp như module/layer vào nền tảng chính thức nếu có điều kiện.

## 20. VIỆC TIẾP THEO SAU MAIN CONTEXT NÀY

Ưu tiên theo thứ tự:

1) build Rule Engine cho JOB_LOSS;

2) build prototype 4 màn;

3) test 20 cases từ dataset;

4) cắm HOUSING + HAS_CHILD;

5) thêm AI layer sau khi deterministic core chạy;

6) khảo sát user nhỏ;

7) hoàn thiện hồ sơ tối đa 5 trang theo mẫu;

8) slide tối đa 10;

9) poster/QR/demo/video;

10) luyện Q&A.

## 21. CÂU TRẢ LỜI BGK NÊN GIỮ

“Công nghệ lõi là gì?”

→ Policy Matching Engine + Service Resolver + Opportunity Registry + Provenance Layer. AI chỉ hỗ trợ hiểu ngôn ngữ và giải thích.

“Khác Hành chính công chủ động ở đâu?”

→ AN SINH 360 tập trung hành trình an sinh chuyên biệt người lao động, nối policy–service–opportunity–action; không cạnh tranh mà bổ trợ hệ thống hiện hữu.

“Dữ liệu lấy đâu?”

→ Văn bản pháp lý gốc cho eligibility, DVC/BHXH/cơ quan xử lý cho procedure, nguồn địa phương chính thức cho service/opportunity. Mỗi rule có source/article/verification.

“AI có tư vấn sai không?”

→ AI không quyết định quyền lợi; deterministic rule engine xử lý điều kiện. Thiếu dữ liệu thì hỏi thêm hoặc route human support.

## 22. NGUYÊN TẮC CHO CÁC CHAT SAU

Coi tài liệu này là baseline chính.

Không tự ý:

- đổi tên định vị;
- thêm journey;
- đổi novelty claim;
- biến sản phẩm thành chatbot;
- mở scope toàn Việt Nam;
- claim “đầu tiên Việt Nam”;
- dùng source không chính thức làm rule.

Nếu cần thay đổi một quyết định đã khóa, phải nêu rõ lý do và tác động tới hồ sơ/prototype/dataset.

END OF MAIN CONTEXT.
