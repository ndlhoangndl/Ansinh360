# AN SINH 360 — Frontend deployment preparation

Đã kiểm tra local production ngày 10/10/2026. Chưa publish lên Vercel.

## Vercel project settings

| Setting | Value |
| --- | --- |
| Root Directory | `apps/web` |
| Framework Preset | Next.js |
| Node.js | `24.x` |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | Default, không override |
| Required environment variables | Không có |

`apps/web/vercel.json` đã cấu hình Next.js, install và build. `package.json` và root package entry trong `package-lock.json` cùng dùng Node `24.x`. Lockfile khóa Next 16.3.8, React 19.3.0; không chỉ dựa vào version range trong package manifest.

Cấu hình đối chiếu với [Vercel build settings](https://vercel.com/docs/builds/configure-a-build) và [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions). Không dùng custom server, không cần PostgreSQL, Docker hoặc biến môi trường backend cho frontend.

## Reproduce locally

Dùng Node 24 và npm, từ thư mục repository:

```powershell
Set-Location 'D:\Ý tưởng dự án Liên Chiểu\apps\web'
npm ci
npm run typecheck -- --incremental false
npm test
npm run build
npm run start -- --port 3001
```

Mở `http://127.0.0.1:3001/`. Ctrl+C dừng production server. Development dùng:

```powershell
npm run dev
```

Development URL là `http://127.0.0.1:3000/`. Dùng `/` làm entry công khai; `?demo=jobloss` chỉ là entry trình bày/kiểm thử nội bộ, không có nút quảng bá trên Home.

Không có lint script. Kiểm tra bổ sung không dùng biến/import:

```powershell
npm exec --no -- tsc --noEmit --noUnusedLocals --incremental false
```

## Packaging and deployment review

- Revision triển khai phải chứa toàn bộ `apps/web`, nhất là các component/lib/test mới còn untracked trong workspace, `app/not-found.tsx`, package lock và `vercel.json`. Chưa commit/push trong STEP 7.
- Build sử dụng `lib/demo-data.json` và `lib/competition-demo.ts` hiện có. Không tự chạy `data:sync`, không sửa CSV, không cần truy cập ngoài Root Directory để build app.
- Không commit `.next`, `node_modules`, log hoặc secret. Không thêm biến môi trường của backend vào project frontend.
- Sau khi người dùng quyết định deploy, kiểm tra Vercel build log và smoke test URL đã deploy: root, cả ba tình huống, reset/brand, URL thiếu ngữ cảnh, 404, nguồn và modal hỗ trợ. Local PASS chưa phải Vercel build PASS.

## Verification already completed

Sau bước actionability: typecheck PASS; **94/94 tests PASS**; unused-locals PASS; production build PASS. Đã kiểm tra các luồng thay đổi trên production cổng riêng, mobile 390 × 844 và desktop 1280 × 900; không ghi nhận console error/warn. Phạm vi kiểm tra và giới hạn nằm trong [báo cáo actionability hiện tại](STEP_7_ACTIONABILITY_REPORT.md); [audit trước đó](STEP_7_FINAL_PRODUCT_AUDIT.md) là lịch sử bước trước.

Các mục phòng/tin tuyển dụng/cơ sở chăm sóc thiếu nguồn được hiển thị thành hướng tìm hoặc loại hình; không gắn trạng thái còn chỗ/đang tuyển/tuyển sinh cho chúng. Chưa có bản ghi cụ thể đủ xác minh ở ba nhóm này. Snapshot chương trình ngày 04/10/2026 cần đối chiếu thông báo mới nhất. External source links đã kiểm tra cấu trúc/an toàn mở tab, chưa kiểm tra lại toàn bộ nội dung và uptime bên ngoài.


## Final user-impact fixes — 10/10/2026

Typecheck PASS; **105/105 tests PASS**; unused-locals PASS; production build PASS. Không có lint script. Các link thủ tục hỏng/503 đã chuyển sang cổng tra cứu; phòng trọ và chăm sóc trẻ dùng hướng loại hình + 1022. Đã kiểm tra trực tiếp các đích quan trọng, có giới hạn về uptime và dữ liệu địa phương. Chi tiết, phạm vi files và bằng chứng trong [FINAL_USER_IMPACT_FIXES.md](FINAL_USER_IMPACT_FIXES.md). Báo cáo 94 tests ở trên là kết quả bước trước. Chưa deploy.
