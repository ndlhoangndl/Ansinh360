"use client";
import { officialDestination } from "@/lib/official-destinations";
import { useEffect, useRef, useState } from "react";
import { type Answers, policy, service } from "@/lib/demo";
import { competitionServices } from "@/lib/competition-demo";
import { jobNextAction, jobFirstAction } from "@/lib/action-plan";
import { JobTerminationQuestion } from "./job-termination-question";
import { JobServiceHandoff } from "./job-service-handoff";
import { SourceDisclosure } from "./source-badge";

export const jobContactChecklist = ["Thông tin/ngày nghỉ việc", "Giấy tờ chứng minh chấm dứt việc làm nếu đang có", "Thông tin quá trình tham gia bảo hiểm thất nghiệp mà bạn biết", "Thông tin liên hệ cơ bản"];

function InsuranceConfirmation({ answers, onAnswer, duration = false }: { answers: Answers; onAnswer: (key: keyof Answers, value: string) => void; duration?: boolean }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("UNKNOWN");
  return <>{!open ? <button className="outline-button" onClick={() => { setDraft((duration ? answers.contributionMonths : answers.insurance) ?? "UNKNOWN"); setOpen(true); }}>Tôi đã kiểm tra</button> : <fieldset className="followup-options"><legend>{duration ? "Trong 24 tháng trước khi nghỉ việc, bạn biết đã đóng bao nhiêu tháng?" : "Khi nghỉ việc, bạn có tham gia bảo hiểm thất nghiệp không?"}</legend>{duration ? <select aria-label="Thời gian tham gia bảo hiểm thất nghiệp" value={draft} onChange={(event) => setDraft(event.target.value)}><option value="UNKNOWN">Tôi chưa rõ</option>{Array.from({ length: 25 }, (_, value) => <option key={value} value={String(value)}>{value} tháng</option>)}</select> : [["YES", "Có"], ["NO", "Không"], ["UNKNOWN", "Không rõ"]].map(([value, label]) => <label className="group-option" key={value}><input type="radio" name="job-insurance-confirmation" checked={draft === value} onChange={() => setDraft(value)} />{label}</label>)}<p>Chỉ ghi thời gian bạn biết trong khoảng đang hỏi; cơ quan tiếp nhận kiểm tra trường hợp cụ thể. Không nhập số bảo hiểm hay thông tin định danh.</p><button className="outline-button" onClick={() => { onAnswer(duration ? "contributionMonths" : "insurance", draft); setOpen(false); }}>Ghi nhận câu trả lời</button><button className="back-link" onClick={() => setOpen(false)}>Hủy thay đổi</button></fieldset>}</>;
}
function EmploymentConfirmation({ answers, onAnswer }: { answers: Answers; onAnswer: (key: keyof Answers, value: string) => void }) {
  const [draft, setDraft] = useState(answers.employmentEnded ?? "UNKNOWN");
  return <fieldset className="followup-options"><legend>Bạn đã chấm dứt việc làm chưa?</legend>{[["true", "Đã nghỉ việc"], ["false", "Chưa nghỉ hẳn"], ["UNKNOWN", "Không rõ trường hợp của tôi"]].map(([value, label]) => <label className="group-option" key={value}><input type="radio" name="job-employment-confirmation" checked={draft === value} onChange={() => setDraft(value)} />{label}</label>)}<button className="outline-button" onClick={() => onAnswer("employmentEnded", draft)}>Ghi nhận câu trả lời</button></fieldset>;
}
export function JobActionPlan({ answers, onAnswer, checked, onToggle, onIncomePath, onSupport }: { answers: Answers; onAnswer: (key: keyof Answers, value: string) => void; checked: string[]; onToggle: (id: string) => void; onIncomePath: (section: "jobs" | "training") => void; onSupport: () => void }) {
  const next = jobNextAction(answers);
  const center = competitionServices.find((item) => item.id === "JOB_SV_006")!;
  const previousAction = useRef(next);
  useEffect(() => {
    if (previousAction.current === next) return;
    previousAction.current = next;
    const target = document.querySelector<HTMLElement>(".job-plan-priority");
    target?.focus(); target?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [next]);
  return <div className="job-plan">
    <div className="job-plan-priority" tabIndex={-1}><h2>Việc ưu tiên với thông tin của bạn</h2><p>{jobFirstAction(answers)}</p><p>Ba bước dưới đây giúp chuẩn bị thông tin để hỏi; chưa xác nhận quyền hưởng.</p></div>
    <section className="job-plan-followup"><span className="action-label">BƯỚC 1</span><h2>Kiểm tra giấy tờ nghỉ việc</h2><p>Tìm quyết định nghỉ việc, thông báo chấm dứt hợp đồng hoặc giấy tờ doanh nghiệp đã cấp.</p><p>Ghi ngày và lý do trên giấy tờ. Nếu chưa rõ hoặc chưa có, hỏi doanh nghiệp đã làm hoặc Trung tâm; không tự đoán lý do pháp lý.</p>
      {next==='termination'&&<JobTerminationQuestion answers={answers} onAnswer={value=>onAnswer('terminationCircumstance',value)} actionLabel="Tôi đã kiểm tra"/>}
      {next==='employment'&&<EmploymentConfirmation answers={answers} onAnswer={onAnswer}/>}
      {answers.terminationCircumstance&&answers.terminationCircumstance!=='UNKNOWN'&&<p className="job-recorded-fact">Đã ghi nhận lý do nghỉ việc theo thông tin bạn có; chưa xác nhận quyền hưởng.</p>}
    </section>
    <section className="job-plan-followup"><span className="action-label">BƯỚC 2</span><h2>Xem lại thông tin tham gia bảo hiểm thất nghiệp</h2><p>Xác định bạn có tham gia tại thời điểm nghỉ việc và khoảng thời gian đã tham gia mà bạn biết.</p><h3>Tìm ở đâu?</h3><p>Thông tin bảo hiểm đang có, đơn vị sử dụng lao động hoặc Trung tâm Dịch vụ việc làm. Không suy ra số tháng từ câu trả lời “Có”.</p><p>Không cần nhập số bảo hiểm, số căn cước hay tài khoản ngân hàng.</p>
      {(next==='insurance'||next==='duration')&&<InsuranceConfirmation key={next} answers={answers} onAnswer={onAnswer} duration={next==='duration'}/>}
    </section>
    <section className="job-plan-contact"><span className="action-label">BƯỚC 3</span><JobServiceHandoff procedure primary/>
      <details id="job-contact-preparation" className="job-plan-preparation"><summary>Những thứ nên có trước khi liên hệ</summary><p>Đánh dấu để tự theo dõi; bạn không cần gửi giấy tờ tại đây.</p><div className="job-contact-checklist">{jobContactChecklist.map(item=><label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={()=>onToggle(item)}/><span>{item}</span></label>)}</div><p>Giấy tờ từ doanh nghiệp cho thông tin nghỉ việc; quá trình bảo hiểm đang có cho thông tin tham gia. Ghi câu hỏi còn thiếu để trao đổi với Trung tâm.</p><p>Chỉ xem mẫu và chuẩn bị hồ sơ theo hướng dẫn sau khi nơi tiếp nhận đối chiếu trường hợp của bạn.</p><a className="text-action" href={officialDestination(service('JOB_SV_001').online_url)} target="_blank" rel="noopener noreferrer">Tra cứu thủ tục chính thức</a></details>
    </section>
    <section className="job-plan-income"><span className="action-label">QUAY LẠI THU NHẬP</span><h2>Tiếp tục tìm đường quay lại thu nhập</h2><p>Tìm tin công việc thực tế hoặc hỏi hướng đào tạo song song với quyền lợi.</p><button className="outline-button" onClick={()=>onIncomePath('jobs')}>Tìm hướng công việc</button><button className="text-action" onClick={()=>onIncomePath('training')}>Xem hướng học nghề</button></section>
    <button className="outline-button job-support-button" onClick={onSupport}>Tôi cần người hỗ trợ</button><SourceDisclosure entries={[{id:policy('POL_JOB_001').legal_source_id,detail:'Điều 38'},{id:service('JOB_SV_001').source_id,detail:'Mã thủ tục 1.014748'},{id:center.sourceId},{id:service('JOB_SV_007').source_id}]}/>
  </div>;
}
