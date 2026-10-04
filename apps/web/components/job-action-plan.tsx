"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { Answers, policy, service } from "@/lib/demo";
import { SourceDisclosure } from "./source-badge";
import { InformationOrigins, ServiceExecution } from "./action-details";
import { JobTerminationQuestion } from "./job-termination-question";
import { jobPreparation } from "@/lib/presentation";

const preparation = [
  { title: "Thông tin về việc nghỉ việc", text: "Ngày chấm dứt; hình thức / lý do chấm dứt; giấy tờ chứng minh nếu có." },
  { title: "Thông tin về BHTN", text: "Bạn có tham gia BHTN lúc nghỉ việc không? Khoảng thời gian / số tháng đã đóng mà bạn biết." },
  { title: "Hồ sơ chính", text: "Mẫu đề nghị hưởng trợ cấp thất nghiệp và giấy tờ chứng minh chấm dứt hợp đồng / việc làm. Xem yêu cầu cụ thể của thủ tục." },
  { title: "Thông tin liên hệ", text: "Số điện thoại; email nếu cần nhận thông tin. Chỉ chuẩn bị cho nơi tiếp nhận, không nhập vào bản demo." },
];
export function JobActionPlan({ answers, onAnswer, checked, onToggle, onNextPaths }: { answers: Answers; onAnswer: (value: string) => void; checked: string[]; onToggle: (id: string) => void; onNextPaths: () => void }) {
  return <>
    <div className="action-cards">
      <article className="action-card action-blue"><span className="action-label">LÀM NGAY</span><h2>1. Xác nhận thông tin còn thiếu</h2><p>Làm rõ hình thức chấm dứt việc làm trước, rồi hỏi Trung tâm về những thông tin cần thiết để tiếp tục kiểm tra.</p><JobTerminationQuestion answers={answers} onAnswer={onAnswer} primary={!answers.terminationLegal} />{answers.terminationLegal && <a className="primary-button" href={`tel:${service("JOB_SV_006").phone.replace(/\s/g, "")}`}>Hỏi Trung tâm về thông tin cần xác nhận<ArrowRight size={16} /></a>}<InformationOrigins /></article>
      <article className="action-card action-amber" id="job-preparation"><span className="action-label">TIẾP THEO</span><h2>2. Chuẩn bị thông tin và giấy tờ cần thiết</h2><p>Chỉ chuẩn bị để làm việc với nơi tiếp nhận. Bạn không cần nhập số CCCD, BHXH, tài khoản ngân hàng hay thông tin liên hệ vào đây.</p>
        <details className="preparation-details"><summary>Xem cần chuẩn bị gì</summary><h3>Bạn cần chuẩn bị gì?</h3><p>Đánh dấu để tự theo dõi các nhóm thông tin.</p><div className="preparation-categories">{preparation.map((item, index) => <label key={item.title}><input type="checkbox" checked={checked.includes(jobPreparation[index])} onChange={() => onToggle(jobPreparation[index])} /><span><strong>{index + 1}. {item.title}</strong><small>{item.text}</small></span></label>)}</div><a className="text-action" href={service("JOB_SV_001").online_url} target="_blank" rel="noopener noreferrer">Xem mẫu và yêu cầu hồ sơ của thủ tục<ExternalLink size={16} /></a></details>
      </article>
      <article className="action-card action-mint"><span className="action-label">SAU ĐÓ</span><h2>3. Thực hiện tại đúng nơi</h2><ServiceExecution serviceId="JOB_SV_001" providerId="JOB_SV_006" /><a className="outline-button" href={service("JOB_SV_001").online_url} target="_blank" rel="noopener noreferrer">Xem hướng dẫn nộp hồ sơ<ExternalLink size={16} /></a></article>
      <article className="action-card action-blue"><span className="action-label">SONG SONG</span><h2>4. Xem cơ hội tiếp theo</h2><p>Tìm việc mới trên Sàn giao dịch việc làm quốc gia, hoặc tìm hiểu thủ tục hỗ trợ học nghề / nâng kỹ năng.</p><button className="outline-button" onClick={onNextPaths}>Xem cơ hội tiếp theo<ArrowRight size={16} /></button></article>
    </div>
    <SourceDisclosure entries={[{ id: policy("POL_JOB_001").legal_source_id, detail: "Điều 38" }, { id: service("JOB_SV_001").source_id, detail: "Mã thủ tục 1.014748" }, { id: service("JOB_SV_006").source_id }, { id: service("JOB_SV_007").source_id }]} />
  </>;
}
