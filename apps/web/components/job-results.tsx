import { ArrowRight, BriefcaseBusiness, Check, CircleHelp, ExternalLink, FileCheck2, GraduationCap, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Answers, jobDemoResult, policy, service, source } from "@/lib/demo";
import { JobTerminationQuestion } from "./job-termination-question";
import { SourceDisclosure } from "./source-badge";
import { NextActions, PlainExplanation, PracticalChecklist, RecommendationGuidance } from "./result-guidance";
import { jobPreparation } from "@/lib/presentation";

export function JobResults({ answers, onPlan, checked, onToggle, onSupport, onAnswer }: { answers: Answers; onPlan: () => void; checked: string[]; onToggle: (id: string) => void; onSupport: () => void; onAnswer: (value: string) => void }) {
  const result = jobDemoResult(answers);
  // Follow-up declarations are not evaluated by the demo; require confirmation for all values.
  const positive = result.status === "POSSIBLE_MATCH" && !answers.terminationLegal;
  const provider = service("JOB_SV_006");
  const reasons = [
    { met: answers.employmentEnded === "true", text: answers.employmentEnded === "true" ? "Bạn đã chấm dứt việc làm" : answers.employmentEnded === "false" ? "Bạn vẫn đang làm việc" : "Tình trạng việc làm cần xác minh" },
    { met: answers.insurance === "YES", text: answers.insurance === "YES" ? "Bạn có tham gia BHTN" : answers.insurance === "NO" ? "Bạn không tham gia BHTN" : "Thông tin BHTN cần xác minh" },
    { met: ["JOB", "TRAINING", "BOTH", "UNKNOWN"].includes(answers.goal ?? ""), text: answers.goal === "JOB" ? "Bạn muốn tìm việc mới" : answers.goal === "TRAINING" ? "Bạn muốn học nghề / nâng kỹ năng" : answers.goal === "BOTH" ? "Bạn muốn tìm việc mới và học nghề" : answers.goal === "UNKNOWN" ? "Bạn muốn được tư vấn hướng đi" : "Nhu cầu hỗ trợ cần được làm rõ" },
  ];
  return <>
    <article className="match-card">
      <div className="match-top"><span className="match-icon"><FileCheck2 size={25} /></span><span className={`badge ${positive ? "badge-good" : "badge-review"}`}><span className="badge-dot" />{positive ? "Có dấu hiệu phù hợp" : "Cần kiểm tra thêm"}</span></div>
      <span className="card-kicker"><Check size={13} />Đã đối chiếu · thông tin bạn cung cấp</span>
      <h2>Trợ cấp thất nghiệp</h2><p>Ghi lại lý do nghỉ việc và thông tin đóng BHTN. Hỏi Trung tâm xem còn điều kiện nào cần xác nhận; sau đó mới chuẩn bị hồ sơ đúng trường hợp.</p><button className="primary-button" onClick={onPlan}>Xem tôi cần làm gì<ArrowRight size={18} /></button>
      <p className="match-support">Dựa trên thông tin bạn cung cấp, đây là hướng nên kiểm tra trước.</p><div className="match-reasons"><h3>Vì sao có gợi ý này?</h3>{reasons.map((reason) => <p key={reason.text} className={reason.met ? "met" : "unresolved"}>{reason.met ? <Check size={17} /> : <CircleHelp size={17} />}{reason.text}</p>)}</div>
      <JobTerminationQuestion answers={answers} onAnswer={onAnswer} />
      <PlainExplanation>Trợ cấp thất nghiệp không chỉ phụ thuộc vào việc bạn đã nghỉ việc hay chưa. Cách chấm dứt việc làm, thời gian đóng BHTN và thời hạn nộp hồ sơ vẫn cần được kiểm tra.</PlainExplanation>

    </article>
    <article className="service-card">
      <div className="section-label"><MapPin size={18} />Nơi bạn có thể liên hệ<span className="badge badge-review">Cần kiểm tra thêm</span></div>
      <h2>{provider.service_name}</h2>
      <div className="service-contact"><p><MapPin size={17} />{provider.address}</p><a href={`tel:${provider.phone.replace(/\s/g, "")}`}><Phone size={17} />{provider.phone}</a></div>
      <div className="service-tags"><span>BHTN</span><span>Việc làm</span><span>Tư vấn nghề nghiệp</span></div>
      <div className="service-guidance"><h3>Vì sao có gợi ý này?</h3><p>Đây là đầu mối để hỏi về BHTN, việc làm và tư vấn nghề nghiệp. Bạn có thể mang theo các thông tin đã chuẩn bị để làm rõ điều kiện và cách nộp hồ sơ.</p><h3>Hỏi gì khi liên hệ?</h3><p>“Với lý do nghỉ việc và quá trình đóng BHTN của tôi, cần xác nhận điều kiện nào và nộp qua kênh nào?”</p></div>
      <button className="outline-button" onClick={onPlan}>Xem cách thực hiện<ArrowRight size={17} /></button>
    </article>
    <section className="next-opportunities" id="next-paths"><div className="section-label"><BriefcaseBusiness size={18} />Sau bước này, bạn có thể…</div>
      <article className="next-opportunity"><span className="icon-box blue"><BriefcaseBusiness size={22} /></span><h2>Tìm việc mới</h2><p>{service("JOB_SV_007").service_name}</p><span className="badge badge-review">Cần kiểm tra thêm</span><RecommendationGuidance reasons={[answers.goal === "JOB" || answers.goal === "BOTH" ? "Bạn muốn tìm việc mới" : "Bạn có thể tìm hiểu kênh việc làm song song với việc kiểm tra hỗ trợ"]} missing={["Mở tin tuyển dụng, đọc yêu cầu công việc rồi liên hệ nếu phù hợp."]} explanation="Bạn có thể xem công việc theo nhu cầu của mình trên sàn quốc gia. Kiểm tra yêu cầu của từng tin trước khi liên hệ." /><a className="text-action" href={service("JOB_SV_007").online_url} target="_blank" rel="noopener noreferrer">Xem cơ hội việc làm<ExternalLink size={15} /></a></article>
      <article className="next-opportunity"><span className="icon-box amber"><GraduationCap size={22} /></span><h2>Học nghề / nâng kỹ năng</h2><p>Kiểm tra hỗ trợ đào tạo · Thủ tục {service("JOB_SV_010").procedure_code}</p><span className="badge badge-review">Cần kiểm tra thêm</span><RecommendationGuidance reasons={[answers.goal === "TRAINING" || answers.goal === "BOTH" ? "Bạn muốn học nghề / nâng kỹ năng" : "Bạn có thể tìm hiểu hướng học nghề nếu cần đổi công việc"]} missing={["Hỏi Trung tâm DVVL về khóa học bạn muốn học và điều kiện hỗ trợ của khóa đó."]} explanation="Hỗ trợ học nghề có điều kiện cần kiểm tra riêng. Hỏi Trung tâm DVVL về nhu cầu học, khóa học và thủ tục trước khi thực hiện." /><a className="text-action" href={service("JOB_SV_010").online_url} target="_blank" rel="noopener noreferrer">Xem thủ tục học nghề<ExternalLink size={15} /></a></article>
      <button className="outline-button" onClick={onSupport}>Liên hệ người hỗ trợ nếu chưa rõ<CircleHelp size={17} /></button>
    </section>

    <SourceDisclosure entries={[{ id: policy("POL_JOB_001").legal_source_id, detail: "Điều 38" }, { id: provider.source_id }, { id: service("JOB_SV_007").source_id }, { id: policy("POL_JOB_004").legal_source_id, detail: "Điều 37" }]} />
  </>;
}
