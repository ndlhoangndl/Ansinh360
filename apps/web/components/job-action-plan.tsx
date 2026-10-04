"use client";

import { useState } from "react";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Answers, policy, service, snapshotDate } from "@/lib/demo";
import { SourceDisclosure } from "./source-badge";
import { InformationOrigins, ServiceExecution } from "./action-details";
import { JobTerminationQuestion } from "./job-termination-question";
import { jobNextAction } from "@/lib/action-plan";
import { jobPreparation } from "@/lib/presentation";

const preparation = [
  { title: "Thông tin về việc nghỉ việc", text: "Ngày chấm dứt; hình thức / lý do chấm dứt; giấy tờ chứng minh nếu có." },
  { title: "Thông tin về BHTN", text: "Bạn có tham gia BHTN lúc nghỉ việc không? Khoảng thời gian / số tháng đã đóng mà bạn biết." },
  { title: "Hồ sơ chính", text: "Mẫu đề nghị hưởng trợ cấp thất nghiệp và giấy tờ chứng minh chấm dứt hợp đồng / việc làm. Xem yêu cầu cụ thể của thủ tục." },
  { title: "Thông tin liên hệ", text: "Số điện thoại; email nếu cần nhận thông tin. Chỉ chuẩn bị cho nơi tiếp nhận, không nhập vào bản demo." },
];
export function JobActionPlan({ answers, onAnswer, checked, onToggle, onNextPaths }: { answers: Answers; onAnswer: (key: keyof Answers, value: string) => void; checked: string[]; onToggle: (id: string) => void; onNextPaths: () => void }) {
  const next = jobNextAction(answers);
  const preparing = next === "preparation";
  const [editing, setEditing] = useState(false);
  const provider = service("JOB_SV_006");
  const titles = { employment: "Xác nhận tình trạng việc làm", date: "Xác nhận ngày chấm dứt việc làm", termination: "Xác nhận lý do chấm dứt việc làm", insurance: "Xem lại thông tin tham gia BHTN", duration: "Xem lại thời gian tham gia BHTN", support: "Hỏi Trung tâm về hướng hỗ trợ" };
  return <>
    <div className="action-cards">
      {!preparing && <article className="action-card action-blue" key={next}><span className="action-label">LÀM NGAY</span><h2>{titles[next]}</h2>
        {next === "termination" ? <><p>Đây là thông tin còn thiếu để tiếp tục kiểm tra hướng trợ cấp thất nghiệp.</p><JobTerminationQuestion answers={answers} onAnswer={(value) => onAnswer("terminationLegal", value)} primary actionLabel="Tôi đã kiểm tra" /></> : next === "support" ? <><p>Với thông tin bạn đã chọn, hãy hỏi Trung tâm về hướng hỗ trợ trước khi chuẩn bị hồ sơ trợ cấp. Bản demo chưa xác nhận quyền hưởng.</p><a className="primary-button" href={`tel:${provider.phone.replace(/\s/g, "")}`}>Hỏi Trung tâm DVVL<ArrowRight size={16} /></a></> : <>
          <p>{next === "insurance" || next === "duration" ? "Bạn cần biết mình có tham gia BHTN tại thời điểm nghỉ việc và khoảng thời gian đã tham gia." : "Xác nhận thông tin này trước khi chuyển sang chuẩn bị."}</p>
          <p>{next === "insurance" || next === "duration" ? "Kiểm tra thông tin quá trình tham gia BHXH/BHTN mà bạn đang có hoặc hỏi đơn vị hỗ trợ nếu chưa rõ." : "Xem quyết định nghỉ việc, thông báo chấm dứt hợp đồng hoặc giấy tờ từ doanh nghiệp."}</p>
          {!editing ? <button className="primary-button" onClick={() => setEditing(true)}>Tôi đã kiểm tra</button> : <fieldset className="followup-options"><legend>Ghi nhận thông tin bạn đã kiểm tra</legend>
            {next === "date" ? <><label htmlFor="plan-termination-date">Ngày chấm dứt việc làm</label><input id="plan-termination-date" type="date" max={snapshotDate} value={answers.terminationDate === "UNKNOWN" ? "" : answers.terminationDate ?? ""} onChange={(event) => { if (event.target.value && event.target.value <= snapshotDate) onAnswer("terminationDate", event.target.value); }} /></> : next === "duration" ? <><label htmlFor="plan-bhtn-months">Trong 24 tháng trước khi nghỉ việc, bạn đã đóng BHTN bao nhiêu tháng?</label><select id="plan-bhtn-months" value={answers.contributionMonths ?? "UNKNOWN"} onChange={(event) => onAnswer("contributionMonths", event.target.value)}><option value="UNKNOWN">Tôi chưa rõ</option>{Array.from({length:25}, (_, value) => <option key={value} value={String(value)}>{value} tháng</option>)}</select><p>Chỉ ghi nhận thời gian bạn biết; không kết luận điều kiện hưởng hay áp dụng cho cửa sổ thời gian khác.</p></> : (next === "employment" ? [["true", "Đã chấm dứt việc làm"], ["false", "Vẫn đang làm việc"], ["UNKNOWN", "Tôi chưa rõ"]] : [["YES", "Có tham gia BHTN lúc nghỉ việc"], ["NO", "Không tham gia BHTN lúc nghỉ việc"], ["UNKNOWN", "Tôi chưa rõ"]]).map(([value,label]) => <label className="group-option" key={value}><input type="radio" name="plan-followup" checked={(next === "employment" ? answers.employmentEnded : answers.insurance) === value} onChange={() => onAnswer(next === "employment" ? "employmentEnded" : "insurance", value)} />{label}</label>)}
            <button className="primary-button" onClick={() => setEditing(false)}>Ghi nhận câu trả lời</button>
          </fieldset>}
        </>}
        <InformationOrigins />
        {(answers.terminationLegal === "UNKNOWN" || editing) && <a className="text-action" href={`tel:${provider.phone.replace(/\s/g, "")}`}>Chưa rõ? Hỏi Trung tâm DVVL</a>}
      </article>}
      <article className="action-card action-amber" id="job-preparation"><span className="action-label">{preparing ? "LÀM NGAY" : "SAU KHI LÀM RÕ THÔNG TIN"}</span><h2>Chuẩn bị giấy tờ chính</h2><p>{preparing ? "Các thông tin đang hỏi đã được ghi nhận; cơ quan tiếp nhận vẫn cần xác nhận điều kiện hưởng." : "Bạn còn thông tin cần làm rõ ở bước trên. Đây là hướng dẫn để xem trước, chưa phải bước nộp hồ sơ."}</p><ul><li>Giấy tờ chứng minh việc chấm dứt việc làm.</li><li>Mẫu đề nghị hưởng trợ cấp thất nghiệp.</li><li>Thông tin cơ bản cần để cơ quan tiếp nhận kiểm tra hồ sơ.</li></ul><p>Chỉ chuẩn bị các giấy tờ cần thiết cho bước bạn đang thực hiện. Không nhập số định danh hay thông tin liên hệ vào bản demo.</p>{preparing && <InformationOrigins />}
        <details className="preparation-details"><summary className={preparing ? "primary-button" : undefined}>{preparing ? "Xem cần chuẩn bị gì" : "Xem trước nhóm giấy tờ"}</summary><h3>Bạn cần chuẩn bị gì?</h3><p>Đánh dấu để tự theo dõi các nhóm thông tin.</p><div className="preparation-categories">{preparation.map((item, index) => <label key={item.title}><input type="checkbox" checked={checked.includes(jobPreparation[index])} onChange={() => onToggle(jobPreparation[index])} /><span><strong>{index + 1}. {item.title}</strong><small>{item.text}</small></span></label>)}</div><a className="text-action" href={service("JOB_SV_001").online_url} target="_blank" rel="noopener noreferrer">Xem mẫu và yêu cầu hồ sơ của thủ tục<ExternalLink size={16} /></a></details>
      </article>
      <article className="action-card action-mint"><span className="action-label">SAU ĐÓ</span><h2>Thực hiện tại đúng nơi</h2>{!preparing && <p>Tham khảo nơi và kênh thực hiện; hãy làm rõ thông tin ở bước đầu trước khi chuẩn bị và nộp.</p>}<ServiceExecution serviceId="JOB_SV_001" providerId="JOB_SV_006" /><a className="outline-button" href={service("JOB_SV_001").online_url} target="_blank" rel="noopener noreferrer">Xem hướng dẫn nộp hồ sơ<ExternalLink size={16} /></a></article>
      <article className="action-card action-blue"><span className="action-label">SONG SONG</span><h2>Trong lúc xử lý, bạn có thể…</h2><p>Tìm việc mới trên Sàn giao dịch việc làm quốc gia, hoặc tìm hiểu thủ tục hỗ trợ học nghề / nâng kỹ năng.</p><button className="outline-button" onClick={onNextPaths}>Xem cơ hội tiếp theo<ArrowRight size={16} /></button></article>
    </div>
    <SourceDisclosure entries={[{ id: policy("POL_JOB_001").legal_source_id, detail: "Điều 38" }, { id: service("JOB_SV_001").source_id, detail: "Mã thủ tục 1.014748" }, { id: service("JOB_SV_006").source_id }, { id: service("JOB_SV_007").source_id }]} />
  </>;
}
