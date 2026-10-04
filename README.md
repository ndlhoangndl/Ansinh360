# AN SINH 360 — BỘ ĐIỀU HƯỚNG CHÍNH SÁCH, DỊCH VỤ VÀ CƠ HỘI CHO NGƯỜI LAO ĐỘNG LIÊN CHIỂU

> **Tagline**: *“Từ hoàn cảnh đến hành động.”*  
> **Phiên bản baseline**: v1.0-RC1 (COMPLETE_FOR_MVP)  
> **Trạng thái**: Khóa baseline cho cuộc thi Ý tưởng Sáng tạo trong Thanh niên Liên Chiểu 2026.

---

## 1. Định vị & Nguyên tắc cốt lõi

- **Mục tiêu**: Hỗ trợ người lao động/công nhân Liên Chiểu chuyển từ hoàn cảnh cá nhân sang chính sách cần kiểm tra, dịch vụ phù hợp, cơ hội đang mở/sắp mở và hành động tiếp theo có căn cứ pháp lý và thực tiễn từ nguồn chính thức.
- **Core flow**:
  ```text
  HOÀN CẢNH (Life Event) ➔ CHÍNH SÁCH (Policy) ➔ DỊCH VỤ (Service) ➔ CƠ HỘI (Opportunity) ➔ HÀNH ĐỘNG TIẾP THEO (Next Action)
  ```
- **Không định vị là**:
  - Không phải cổng dịch vụ công thay thế VNeID / VssID / DVCQG / MyPortal Đà Nẵng.
  - Không phải Super App hay Job Board tuyển dụng tự do.
  - Không phải Chatbot pháp luật mở vô căn cứ.
- **Nguyên tắc kỹ thuật**:
  - **Deterministic Rule Engine trước AI**: Xử lý logic điều kiện, eligibility bằng Rule Engine dựa trên văn bản pháp lý. AI chỉ đóng vai trò phân tích ngôn ngữ tự nhiên đầu vào, hỏi bù thông tin còn thiếu và diễn giải kết quả thân thiện.
  - **Provenance / No Source No Rule**: Mọi rule đều phải gắn `source_id`, điều, khoản, độ tin cậy được kiểm chứng.

---

## 2. Phạm vi MVP (Đã khóa 3 Journey)

1. **`JOB_LOSS`** (*“Tôi vừa mất việc”*): Trợ cấp thất nghiệp, tìm việc, học nghề, hỗ trợ công đoàn (Journey demo chính).
2. **`HOUSING_DIFFICULTY`** (*“Tôi đang khó khăn về nhà ở”*): Mua/thuê nhà ở xã hội, nhà lưu trú công nhân, theo dõi các đợt tiếp nhận hồ sơ tại Đà Nẵng / Liên Chiểu.
3. **`HAS_CHILD`** (*“Tôi có con nhỏ”*): Chế độ thai sản nam/nữ, liên thông thủ tục khai sinh - thường trú - BHYT trẻ em, hỗ trợ mầm non cho con công nhân.

---

## 3. Cấu trúc thư mục Repository

```text
ansinh360/
├── docs/
│   ├── 00_MAIN_CONTEXT_AN_SINH_360.md       # Source of truth: định vị, scope, kiến trúc, quy tắc
│   └── 00_MAIN_CONTEXT_AN_SINH_360.docx     # Bản gốc docx lưu trữ
├── data/
│   ├── AN_SINH_360_DATASET_MASTER.xlsx      # Master workbook
│   ├── 00_README.csv                         # Metadata & quy ước dataset
│   ├── 01_SOURCES.csv                        # Danh mục nguồn pháp lý & dịch vụ chính thức
│   ├── 02_LIFE_EVENTS.csv                    # 3 Life Events của MVP
│   ├── 03_POLICIES.csv                       # Danh mục chính sách
│   ├── 04_POLICY_RULES.csv                   # Luật/Quy tắc điều kiện hưởng
│   ├── 05_SERVICES.csv                       # Dịch vụ hành chính / hỗ trợ thực tế
│   ├── 06_SERVICE_RULES.csv                  # Quy tắc ánh xạ và chọn dịch vụ
│   ├── 07_OPPORTUNITIES.csv                  # Đợt/chương trình mở hoặc sắp mở
│   ├── 08_POLICY_SERVICE_MAP.csv             # Bản đồ liên kết Policy ↔ Service
│   ├── 09_TEST_CASES.csv                     # 20 kịch bản kiểm thử mẫu cho MVP
│   ├── 10_VERIFICATION_LOG.csv               # Nhật ký kiểm chứng nguồn
│   ├── 11_SERVICE_CHECKLISTS.csv             # Checklist giấy tờ/hồ sơ theo dịch vụ
│   ├── 12_PROFILE_FIELDS.csv                 # Trường dữ liệu thu thập hồ sơ tối thiểu
│   └── 13_ENUMS.csv                          # Định nghĩa danh mục chuẩn & trạng thái
├── references/
│   ├── KH_CUOC_THI_2026.docx                 # Kế hoạch & Thể lệ cuộc thi 2026
│   └── V2_PHU_LUC_BAO_CAO_CUOC_THI.docx      # Khung phụ lục báo cáo đánh giá BGK
├── .gitignore                                # Cấu hình loại trừ cho Next.js, .NET, Docker
└── README.md                                 # Hướng dẫn tổng quan dự án
```

---

## 4. Công nghệ dự kiến (Baseline)

- **Frontend**: React / Next.js, Tailwind CSS (giao diện tối giản, Worker Mode & Support Mode).
- **Backend**: ASP.NET Core Web API (.NET 8+), C# strongly-typed Rule Engine.
- **Database**: PostgreSQL (chạy qua Docker Compose).
- **AI Integration**: OpenAI / DeepSeek API (tùy chọn tầng NLU & NLG sau khi Rule Engine hoàn thiện).

---

## 5. Hướng dẫn cho Codex / AI Coding Agent

Khi bắt đầu làm việc với repository này:
1. Đọc kỹ file [docs/00_MAIN_CONTEXT_AN_SINH_360.md](docs/00_MAIN_CONTEXT_AN_SINH_360.md).
2. Kiểm tra dữ liệu trong thư mục [data/](data/) để đảm bảo tính nhất quán của các bảng CSV.
3. Tham khảo tiêu chí BGK tại [references/V2_PHU_LUC_BAO_CAO_CUOC_THI.docx](references/V2_PHU_LUC_BAO_CAO_CUOC_THI.docx) để giữ đúng phạm vi demo tinh gọn, không tự ý nới rộng scope.
4. **Không tự ý sinh code trước khi tóm tắt yêu cầu và thống nhất Phase 1 implementation plan.**
