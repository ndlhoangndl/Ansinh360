# AN SINH 360 — BỘ ĐIỀU HƯỚNG CHÍNH SÁCH, DỊCH VỤ VÀ CƠ HỘI CHO NGƯỜI LAO ĐỘNG LIÊN CHIỂU

> **Tagline**: *“Từ hoàn cảnh đến hành động.”*  
> **Phiên bản baseline**: v1.0-RC1 (COMPLETE_FOR_MVP)  
> **Trạng thái**: Khóa baseline cho cuộc thi Ý tưởng Sáng tạo trong Thanh niên Liên Chiểu 2026.

---

## Frontend demo cuộc thi — chạy độc lập

Demo Next.js tại `apps/web`, không cần .NET, Docker, PostgreSQL, API hay khóa AI. Cần Node.js 20.9+ và npm.

```powershell
cd apps/web
npm install
npm run dev
```

Mở **http://127.0.0.1:3000**. Nút **Chạy thử demo: Tôi vừa mất việc** hoặc **http://127.0.0.1:3000/?demo=jobloss** điền sẵn tình huống mẫu; có thể đổi câu trả lời.

```powershell
npm test
npm run typecheck
npm run build
npm start
```

Tương đương với pnpm: `pnpm install --frozen-lockfile`, `pnpm dev`, `pnpm test`, `pnpm build`, `pnpm start` trong `apps/web`. Lockfile pnpm được lưu trong repository; cấu hình cho phép script cài đặt của esbuild.

Luồng demo đã thiết kế lại: **Trang chủ → 4 câu hỏi mất việc → đối chiếu 1,9 giây → kết quả có lý do → 4 thẻ hành động**. Mỗi màn chỉ có một câu hỏi. Số tháng đóng BHTN được ghi nhận là cần xác minh; chỉ tình huống demo mẫu có giá trị điền sẵn, không suy ra từ câu trả lời Có. Giao diện một cột, thẻ dịch vụ nổi bật, nguồn chính thức và checklist mở rộng. Màn đối chiếu là minh họa frontend, phản ánh câu trả lời thực tế; chưa quyết định điều kiện hưởng. Có thêm xem trước mua/thuê nhà và có con nhỏ. Nội dung lấy từ CSV hiện có bằng `npm run data:sync`; script chỉ ghi `apps/web/lib/demo-data.json`. Ngày đánh giá demo cố định **04/10/2026**, để đợt Hòa Hiệp 4 hiển thị **Sắp mở** khi quay video. Câu trả lời và checklist nằm trong bộ nhớ trình duyệt, mất khi tải lại. Nhắc lịch chỉ minh họa.

Ảnh mobile/desktop và kiểm tra bản hiện tại: [Báo cáo thiết kế lại](docs/frontend/REDESIGN_REPORT.md). [Báo cáo demo ban đầu](docs/frontend/DEMO_REPORT.md) giữ lại thông tin provenance và thiết lập chạy. Backend Phase 1 bên dưới vẫn được giữ nguyên; công việc contract sync và backend Phase 2 chưa tiếp tục trong lần xây demo này.

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

## 3. Cấu trúc tài liệu baseline

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
4. Tuân thủ phạm vi thực thi do người dùng phê duyệt cho từng phiên. Phase 1 hiện chỉ gồm nền tảng dữ liệu/backend; chưa triển khai matching engine, resolver, navigation API, frontend hoặc AI.

---

## 6. Phase 1 — Backend và nền tảng dữ liệu

**Đã hoàn thành implementation và kiểm chứng offline.** Build Release: 0 lỗi, 0 cảnh báo biên dịch. Tests: 32 đạt, 0 lỗi, 3 PostgreSQL integration tests bị bỏ qua với trạng thái **blocked by local environment** vì Docker/WSL chưa sẵn sàng. Chưa xác nhận import thành công vào PostgreSQL hoặc idempotency trên database thật.

Đã đọc/validate toàn bộ **382 dòng thật** trong 14 CSV: **0 lỗi chặn import, 84 cảnh báo không chặn**. CSV nguồn được giữ nguyên; các định nghĩa profile/rule chưa có hợp đồng chuyển đổi được lưu verbatim. Không chuyển YES/NO, LEGAL, MONEY_RANGE hoặc BOOLEAN sang kiểu dùng cho matching.

Chi tiết đầy đủ về kiến trúc, cây thư mục, số lượng, kết quả kiểm thử, quyết định và việc cần review:

- [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)
- [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md)
- [Validation report](docs/reports/dataset-validation.json)
- [Dataset summary](docs/reports/dataset-summary.json)
- [Import plan — chưa ghi database](docs/reports/import-plan.json)
- [Migration SQL](docs/reports/initial-migration.sql)
- [Test results](docs/reports/tests/phase1-tests.trx)

```text
AnSinh360.sln
src/
  AnSinh360.Domain/          # 14 entity types, nguyên giá trị CSV
  AnSinh360.Application/     # CSV reader, validator, import planner
  AnSinh360.Infrastructure/  # EF Core + Npgsql, migration, importer
  AnSinh360.Cli/             # validate/summary/plan/migrate/import/verify-idempotency
  AnSinh360.Api/             # GET /health
tests/AnSinh360.Tests/
scripts/verify-phase1.ps1
compose.yaml
.env.example
.config/dotnet-tools.json
```

### Chạy build và kiểm thử không cần Docker

Yêu cầu .NET SDK 8.0.419 hoặc patch mới hơn thuộc nhánh 8.0.4xx; NuGet cần mạng ở lần restore đầu tiên. Script tự tìm `dotnet` trong PATH hoặc `%USERPROFILE%/.dotnet/`.

```powershell
Set-Location -LiteralPath "D:\Ý tưởng dự án Liên Chiểu"
./scripts/verify-phase1.ps1
```

Script chạy restore theo lock files, build Release, validate/summary/import plan từ `/data`, kiểm tra migration không lệch model, xuất SQL và chạy tests. Các cảnh báo contract không làm validation/import thất bại. Không có PostgreSQL đang chạy thì integration tests được báo skipped, không coi là đã đạt.

### Chạy PostgreSQL sau khi sửa Docker/WSL

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
# Sửa POSTGRES_PASSWORD trong .env trước khi chạy.
docker compose up -d --wait postgres

$localPassword = Read-Host 'PostgreSQL password used in .env'
$env:AS360_CONNECTION_STRING = "Host=localhost;Port=5432;Database=ansinh360;Username=ansinh360;Password=$localPassword"
$env:AS360_TEST_CONNECTION_STRING = "Host=localhost;Port=5432;Database=postgres;Username=ansinh360;Password=$localPassword"
./scripts/verify-phase1.ps1 -WithPostgres
```

Nếu đổi `POSTGRES_PORT`, dùng cùng port trong connection strings. `.env` được Git bỏ qua. Chỉ dùng connection test với PostgreSQL local dành cho development; tests tạo database `as360_test_*` riêng và xóa đúng các database test đó khi kết thúc.

Import diễn ra trong một transaction và được khóa giữa các tiến trình importer. Khóa tự nhiên chống trùng; chỉ update ô thay đổi, giữ các dòng database không xuất hiện trong dataset mới. Import giống hệt không thêm audit row. Test trên PostgreSQL sẽ xác nhận rollback, từng ô dữ liệu và idempotency khi môi trường hoạt động.

### CLI và health

```powershell
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- validate --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- summary --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- plan --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- migrate
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- import --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- verify-idempotency --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- summary --database
dotnet run --project src/AnSinh360.Api -c Release --no-build -- --urls http://localhost:5080
# Terminal khác:
Invoke-RestMethod http://localhost:5080/health
```

Trên máy hiện tại, nếu `dotnet` chưa có trong PATH, thay bằng `& "$env:USERPROFILE/.dotnet/dotnet.exe"`. `/health` kiểm tra process liveness, không xác nhận database readiness. Các lệnh database yêu cầu `AS360_CONNECTION_STRING`; `validate`, `summary` CSV và `plan` chạy offline. `--report <file.json>` lưu báo cáo; `--as-of yyyy-MM-dd` đổi ngày kiểm tra mà không sửa trạng thái/dữ liệu.

**Dừng ở Phase 1.** Các contract trong mục “Dataset contract issues to resolve before Phase 2” phải được phê duyệt trước khi triển khai Policy Matching Engine.

## Final frontend polish (04/10/2026)

AN SINH 360 hiện có ba hành trình JOB_LOSS, HOUSING_DIFFICULTY và HAS_CHILD, cùng bốn bước Tình huống → Một vài câu hỏi → Dành cho bạn → Việc cần làm. Entry công khai là `/`; `/?demo=jobloss` vẫn dùng được nội bộ nhưng không xuất hiện dưới dạng CTA trên Home. Các báo cáo cũ bên dưới ghi lại từng bước trước đây; xem báo cáo STEP 7 để biết trạng thái cuối hiện tại.

Dev/build consume committed `apps/web/lib/demo-data.json`; they do not read CSV files. Manual answers never infer contribution months from insurance participation. The original dataset remains unchanged.

For Vercel, select Root Directory `apps/web`, Next.js preset, Node.js 24.x and the checked-in npm lockfile. `vercel.json` specifies `npm ci` and `npm run build`; no environment variables or backend are needed. See [final polish report](docs/frontend/POLISH_REPORT.md) for commands, QA and deployment details. This pass prepares deployment without publishing a site.

## Điều chỉnh điều hướng và nội dung demo

Thanh tiến trình có đúng bốn bước: **Tình huống → Một vài câu hỏi → Dành cho bạn → Việc cần làm**. Số câu hỏi hiển thị riêng bằng “Câu 1/4”; giai đoạn câu hỏi luôn là “Bước 2/4”. Phân tích là chuyển tiếp 1,9 giây giữa bước 2 và 3. Chính sách, dịch vụ và cơ hội nằm trong cùng màn kết quả. Mô-đun “AN SINH 360 xử lý như thế nào?” chỉ giải thích cơ chế, không có điều hướng. Xem [báo cáo UX](docs/frontend/NAVIGATION_COPY_REPORT.md).

## Giải thích gợi ý và hướng dẫn hành động

Các màn kết quả đã có tóm tắt từ câu trả lời thực tế, lý do gợi ý, điều còn thiếu, giải thích ngắn, checklist và việc nên làm trước nguồn chính thức. Màn hành động chia thành **Hôm nay / Tiếp theo / Sau đó / Song song**. Không thu thập số định danh hay thay đổi dữ liệu nguồn. Xem [báo cáo cập nhật](docs/frontend/EXPLAINABILITY_REPORT.md); build npm và 12 test frontend đã đạt.

## Kết quả tập trung vào việc cần làm

Màn kết quả ưu tiên **làm gì → vì sao → bước sau → nguồn chính thức**. Nhà ở có câu hỏi nhóm đối tượng từ dữ liệu hiện có, trạng thái đợt tiếp nhận và checklist trước khi làm hồ sơ. Màn cuối là “Việc của bạn lúc này”; mỗi màn có một nút chính, nguồn được thu gọn cuối nội dung. Xem [báo cáo action-first](docs/frontend/ACTION_FIRST_REPORT.md). Build npm và 13 test frontend đã đạt.

## Tinh chỉnh cuối cho demo dự thi

Trang chủ chọn tình huống rồi **Bắt đầu**; luồng vẫn có đúng bốn bước. Kế hoạch hành động giải thích **chuẩn bị gì / lấy thông tin ở đâu / làm ở đâu / làm bằng cách nào / tiếp theo làm gì**. Nguồn chính thức và cơ chế dành cho giám khảo được thu gọn. Câu trả lời bổ sung chỉ tự khai, không tự kết luận điều kiện hưởng. Xem [báo cáo cuối](docs/frontend/FINAL_UX_REFINEMENT_REPORT.md): npm build và 14 test đạt; cấu hình standalone Vercel giữ nguyên, chưa triển khai.

## Điểm vào demo và kế hoạch theo câu trả lời

Link công khai dùng đường dẫn `/`, luôn bắt đầu ở **Tình huống**. **Bắt đầu lại** xóa câu trả lời và tiến độ, trả về URL sạch. Kế hoạch mất việc ưu tiên thông tin còn thiếu (nghỉ việc → BHTN → thời gian đóng), rồi mới đưa chuẩn bị giấy tờ lên đầu; phần sau được ghi là xem trước khi còn thiếu thông tin. Xem [báo cáo hành vi demo](docs/frontend/DEMO_STATE_REPORT.md). TypeScript, 18 test và npm build đạt.


## STEP 7 — Final product audit và chuẩn bị triển khai (10/10/2026)

Đã hoàn tất polish toàn frontend, giữ nguyên logic và dữ liệu của ba hành trình. Home đúng ba tình huống; một nút chính ở mỗi màn; nguồn và cơ chế được thu gọn. Cơ hội giữ nhãn cần xác nhận, không được mô tả là đang tuyển/còn chỗ/đang tuyển sinh đã xác minh. Refresh hoặc URL kết quả/kế hoạch không có ngữ cảnh trả về Home; không lưu câu trả lời lâu dài.

Typecheck PASS, **76/76 tests PASS**, kiểm tra unused PASS, **production build PASS**. Đã chạy production riêng để kiểm tra UI, recovery và 404; mobile 390 × 844 và desktop 1280 × 900 không thấy tràn ngang hoặc control bị cắt. Không có lint script.

Vercel: Root Directory **apps/web**, preset Next.js, Node **24.x**, `npm ci`, `npm run build`, không có environment variable bắt buộc. **Chưa deploy**. Phải đưa các file frontend mới còn untracked vào revision triển khai trước khi build từ Git.

Xem [báo cáo STEP 7](docs/frontend/STEP_7_FINAL_PRODUCT_AUDIT.md), [hướng dẫn chạy và cấu hình Vercel](docs/frontend/DEPLOYMENT.md), [bằng chứng browser QA](docs/frontend/STEP_7_BROWSER_AUDIT.json).

## STEP 7 — Actionability, data realism và child logic (10/10/2026)

Trạng thái hiện tại: các mục nhà ở, công việc và chăm sóc chưa có nguồn cụ thể được trình bày thành **gợi ý loại hình/hướng tìm**, không giả tin còn phòng, đang tuyển hoặc cơ sở đang nhận trẻ. Nút dẫn tới nguồn/đầu mối xác minh đã có. Trợ cấp thất nghiệp có việc đầu tiên, địa chỉ/điện thoại Trung tâm và ba bước rõ ràng. HAS_CHILD chỉ đề nghị việc còn thiếu, theo nhu cầu thực tế; việc đã hoàn thành không xuất hiện lại trong kế hoạch. Preschool có một lựa chọn chính và tối đa hai phương án phụ thu gọn.

**94/94 tests PASS**, typecheck/unused PASS, production build PASS; không có lint script. Đã kiểm tra các màn thay đổi trên mobile/desktop; chưa deploy. Không sửa CSV, snapshot nguồn hoặc quy tắc pháp lý. Ba nhóm cơ hội tư nhân hiện đều có **0 bản ghi đủ nguồn xác minh**; cần dữ liệu thực tế trước khi trình bày như tin/cơ sở cụ thể. Xem [báo cáo 11 mục và lệnh chạy lại](docs/frontend/STEP_7_ACTIONABILITY_REPORT.md).


### Final worker-impact fixes (10/10/2026)

Frontend đã sửa thứ tự nhà ở theo sức chứa và trần ngân sách, câu hỏi nghỉ việc theo sự việc, tóm tắt nhu cầu trẻ hiện tại, và đích tra cứu/1022 khi chưa có dữ liệu cụ thể. CSV, snapshot và quy tắc pháp lý được giữ nguyên. Typecheck, 105 tests, unused-locals và production build PASS. Báo cáo: [docs/frontend/FINAL_USER_IMPACT_FIXES.md](docs/frontend/FINAL_USER_IMPACT_FIXES.md). Chưa deploy.
